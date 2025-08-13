import { Op } from "sequelize";
import BarangMasuk from "../models/BarangMasuk.js";
import Barang from "../models/BarangModel.js";
import Kategori from "../models/KategoriBarang.js";
import BarangController from "./BarangController.js";
import BarangUnitModel from "../models/BarangUnitModel.js";

class BarangMasukController extends BarangController {
  constructor() {
    super();
  }

  createBarangMasuk = async (req, res) => {
    const { barangId, qty, desc, tgl_masuk } = req.body;

    try {
      // 1️⃣ Ambil barang beserta kategori
      const barang = await Barang.findByPk(barangId, {
        include: { model: Kategori, as: "kategori_brg" },
      });

      if (!barang) {
        return res.status(404).json({ msg: "Barang tidak ditemukan" });
      }

      if (!barangId || !qty || !desc || !tgl_masuk) {
        return res
          .status(400)
          .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
      }

      // 2️⃣ Hitung masa ekonomis & penyusutan
      const estimasiByKategori =
        barang.kategori_brg.masa_ekonomis * this.bulanPerTahun;

      const masaEkonomisBarang = parseFloat(
        (
          this.hitungSisaUmurBulan(tgl_masuk, estimasiByKategori) /
          this.bulanPerTahun
        ).toFixed(1)
      );

      const biayaPenyusutan = parseFloat(
        (barang.harga / estimasiByKategori).toFixed(2)
      );

      // 3️⃣ Update stok Barang
      const stokBaru = barang.qty + parseInt(qty);
      await Barang.update({ qty: stokBaru }, { where: { id: barangId } });

      // 4️⃣ Simpan riwayat BarangMasuk
      const barangMasuk = await BarangMasuk.create({
        barangId,
        qty,
        desc,
        tgl_masuk,
        sisa_stok: stokBaru,
        umur_ekonomis: masaEkonomisBarang,
        biaya_penyusutan: biayaPenyusutan,
        penyusutan_berjalan: 0,
        nilai_buku: barang.harga,
      });

      // 5️⃣ Cari kode_unit terakhir untuk barang ini
      const lastUnit = await BarangUnitModel.findOne({
        where: { barangId },
        order: [["createdAt", "DESC"]],
      });

      let startNumber = 1;
      if (lastUnit && lastUnit.kode_unit) {
        const lastNumber = parseInt(lastUnit.kode_unit.split("-").pop(), 10);
        if (!isNaN(lastNumber)) {
          startNumber = lastNumber + 1;
        }
      }

      // 6️⃣ Generate unit baru
      let units = [];
      for (let i = 0; i < qty; i++) {
        units.push({
          barangId,
          kode_unit: `${barang.name.toLowerCase()}-${startNumber + i}`,
          lokasi_asal: barang.lokasi_barang,
          lokasi_barang: barang.lokasi_barang,
          kategori: barang.kategori,
          tgl_beli: tgl_masuk,
          harga: barang.harga,
          kondisi: "BAIK",
          riwayat_pemeliharaan: null,
          kategori: barang.kategori,
          umur_ekonomis: masaEkonomisBarang,
          biaya_penyusutan: biayaPenyusutan,
          penyusutan_berjalan: 0,
          nilai_buku: barang.harga,
          status: "baik",
        });
      }

      await BarangUnitModel.bulkCreate(units);

      res.status(201).json({
        msg: "Berhasil menambah data barang masuk & per unit",
        barangMasuk,
        totalUnitDitambah: qty,
      });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getBarangMasukById = async (req, res) => {
    try {
      const brgMasuk = await BarangMasuk.findByPk(req.params.id, {
        include: {
          model: Barang,
        },
      });
      if (!brgMasuk) {
        return res
          .status(404)
          .json({ msg: "Data barang masuk tidak ditemukan!" });
      }

      res.status(200).json(brgMasuk);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getAllBrgMasuk = async (req, res) => {
    try {
      const brgMasuk = await BarangMasuk.findAll({
        include: {
          model: Barang,
        },
      });

      res.status(200).json(brgMasuk);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getBarangMasuk = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    const offset = limit * page;
    let totalPage;
    try {
      const count = await BarangMasuk.count({
        include: {
          model: Barang,
          where: { name: { [Op.like]: `%${search}%` } },
        },
      });

      totalPage = Math.ceil(count / limit);

      const brgMasuk = await BarangMasuk.findAll({
        include: {
          model: Barang,
          where: { name: { [Op.like]: `%${search}%` } },
        },
        order: [["createdAt", "ASC"]],
        limit,
        offset,
      });

      res.status(200).json({ page, limit, totalPage, count, brgMasuk });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  updatePenyusutan = async (req, res) => {
    try {
      const brgMasukList = await BarangMasuk.findAll({
        include: { model: Barang, include: [{ model: Kategori }] },
      });

      for (const item of brgMasukList) {
        const tglMasuk = new Date(item.tgl_masuk);
        const now = new Date();

        // Hitung selisih bulan
        const selisihBulan =
          (now.getFullYear() - tglMasuk.getFullYear()) * 12 +
          (now.getMonth() - tglMasuk.getMonth());

        const masaEkonomisKategori =
          item.barang.kategori_brg.masa_ekonomis * this.bulanPerTahun;
        const penyusutanPerBulan = item.biaya_penyusutan;

        // Total penyusutan yang sudah terjadi ( max harga beli)
        const totalPenyusutan = Math.min(
          selisihBulan * penyusutanPerBulan,
          item.barang.harga
        );

        // Nilai buku tidak boleh negatif
        const nilaiBuku = Math.max(0, item.barang.harga - totalPenyusutan);

        // Update data barang
        await BarangMasuk.update(
          {
            penyusutan_berjalan: totalPenyusutan,
            nilai_buku: nilaiBuku,
            umur_ekonomis: parseFloat(
              (
                this.hitungSisaUmurBulan(tglMasuk, masaEkonomisKategori) /
                this.bulanPerTahun
              ).toFixed(1)
            ),
          },
          { where: { id: item.id } }
        );
      }

      res.status(200).json({ msg: "Berhasil update penyusutan semua barang." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  deleteBarangMasuk = async (req, res) => {
    try {
      const brgMasuk = await BarangMasuk.findByPk(req.params.id);

      if (!brgMasuk) {
        return res
          .status(404)
          .json({ msg: "Data barang masuk tidak ditemukan!" });
      }

      await BarangMasuk.destroy({ where: { id: brgMasuk.id } });

      res.status(200).json({ msg: "Berhasil menghapus data barang masuk." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  // updateBarangMasuk = async (req, res) => {
  //   const { desc, qty, tgl_masuk } = req.body;
  //   try {
  //     const brgMasuk = await BarangMasuk.findByPk(req.params.id, {
  //       include: {
  //         model: Barang,
  //       },
  //     });

  //     if (!brgMasuk) {
  //       return res
  //         .status(404)
  //         .json({ msg: "Data barang masuk tidak ditemukan!" });
  //     }

  //     const qtyBarang = brgMasuk.barang.qty;
  //     const selisih = qty - brgMasuk.qty;

  //     if (selisih > qtyBarang) {
  //       return res.status(400).json({ msg: "Input jumlah tidak valid!" });
  //     }

  //     await BarangMasuk.update(
  //       { desc, qty, tgl_masuk, sisa_stok: brgMasuk.barang.qty + qty },
  //       {
  //         where: {
  //           id: brgMasuk.id,
  //         },
  //       }
  //     );

  //     await Barang.update(
  //       { qty: qtyBarang - selisih },
  //       {
  //         where: {
  //           id: brgMasuk.barang.id,
  //         },
  //       }
  //     );

  //     res.status(200).json({ msg: "Berhasil mengubah data barang masuk." });
  //   } catch (error) {
  //     res.status(500).json({ msg: "ERROR: " + error.message });
  //   }
  // };
}

export default BarangMasukController;
