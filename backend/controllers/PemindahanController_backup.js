import { Op } from "sequelize";
import Barang from "../models/BarangModel.js";
import Kategori from "../models/KategoriBarang.js";
import Lokasi from "../models/LokasiModel.js";
import Pemindahan from "../models/Pemindahan.js";
import User from "../models/UserModels.js";
import BarangController from "./BarangController.js";

class PemindahanController extends BarangController {
  // ADD
  createPemindahan = async (req, res) => {
    const { barangId, qty, desc, from, to, tgl_pindah, userId } = req.body;

    if (!barangId || !qty || !desc || !from || !to || !tgl_pindah || !userId) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }

    try {
      const barang = await Barang.findByPk(barangId, {
        include: { model: Kategori },
      });

      if (qty > barang.qty) {
        return res.status(400).json({ msg: "Input jumlah tidak valid!" });
      }

      await Barang.update(
        { qty: barang.qty - parseInt(qty) },
        { where: { id: barang.id } }
      );

      await Pemindahan.create({
        barangId,
        qty,
        desc,
        from,
        to,
        tgl_pindah,
        sisa_stok: barang.qty - parseInt(qty),
        umur_ekonomis: barang.umur_ekonomis,
        biaya_penyusutan: barang.biaya_penyusutan,
        penyusutan_berjalan: barang.penyusutan_berjalan,
        nilai_buku: barang.nilai_buku,
        userId,
        kondisi: barang.kondisi,
        riwayat_pemeliharaan: barang.riwayat_pemeliharaan,
      });

      res.status(201).json({ msg: "Berhasil menambah data pemindahan." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getPemindahan = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    let totalPage;
    let count;
    let pindah;
    const offset = limit * page;

    try {
      const barang = await Barang.findAll();

      if (req.role === "admin") {
        count = await Pemindahan.count({
          include: [
            {
              model: Barang,
              as: "nama_barang",
              where: { name: { [Op.like]: `%${search}%` } },
            },
          ],
        });

        totalPage = Math.ceil(count / limit);

        pindah = await Pemindahan.findAll({
          include: [
            { model: Lokasi, as: "pindah_from", attributes: ["name", "desc"] },
            { model: Lokasi, as: "pindah_to", attributes: ["name", "desc"] },
            {
              model: Barang,

              attributes: [
                "name",
                "desc",
                "qty",
                "kondisi",
                "riwayat_pemeliharaan",
                "kondisi",
              ],
              as: "nama_barang",
              where: { name: { [Op.like]: `%${search}%` } },
            },
            { model: User, attributes: ["id", "nip", "username", "role"] },
          ],
          attributes: [
            "id",
            "qty",
            "desc",
            "tgl_pindah",
            "sisa_stok",
            "umur_ekonomis",
            "biaya_penyusutan",
            "penyusutan_berjalan",
            "nilai_buku",
            "kondisi",
            "riwayat_pemeliharaan",
            "userId",
          ],
          limit,
          offset,
          order: [["createdAt", "ASC"]],
        });
      } else {
        count = await Pemindahan.count({
          include: [
            {
              model: Barang,
              as: "nama_barang",
              where: { name: { [Op.like]: `%${search}%` } },
            },
          ],
          where: { userId: req.uid },
        });

        totalPage = Math.ceil(count / limit);

        pindah = await Pemindahan.findAll({
          include: [
            { model: Lokasi, as: "pindah_from", attributes: ["name", "desc"] },
            { model: Lokasi, as: "pindah_to", attributes: ["name", "desc"] },
            {
              model: Barang,

              attributes: [
                "name",
                "desc",
                "qty",
                "kondisi",
                "riwayat_pemeliharaan",
              ],
              as: "nama_barang",
              where: { name: { [Op.like]: `%${search}%` } },
            },
            {
              model: User,
              attributes: ["id", "nip", "username", "role"],
            },
          ],
          attributes: [
            "id",
            "qty",
            "desc",
            "tgl_pindah",
            "sisa_stok",
            "umur_ekonomis",
            "kondisi",
            "riwayat_pemeliharaan",
            "userId",
          ],
          where: { userId: req.uid },
          limit,
          offset,
          order: [["createdAt", "ASC"]],
        });
      }
      res.status(200).json({ limit, page, totalPage, count, pindah });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getPemindahanById = async (req, res) => {
    try {
      const pindah = await Pemindahan.findByPk(req.params.id, {
        include: [
          { model: Lokasi, as: "pindah_from", attributes: ["name", "desc"] },
          { model: Lokasi, as: "pindah_to", attributes: ["name", "desc"] },
          {
            model: Barang,
            attributes: ["name", "desc", "qty"],
            as: "nama_barang",
          },
        ],
        attributes: ["id", "qty", "desc", "tgl_pindah"],
      });

      if (!pindah) {
        return res
          .status(404)
          .json({ msg: "Data pemindahan tidak ditemukan!" });
      }

      res.status(200).json(pindah);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getAllPemindahan = async (req, res) => {
    try {
      const pindah = await Pemindahan.findAll({
        include: [
          { model: Lokasi, as: "pindah_from", attributes: ["name", "desc"] },
          { model: Lokasi, as: "pindah_to", attributes: ["name", "desc"] },
          {
            model: Barang,
            attributes: ["name", "desc", "qty"],
            as: "nama_barang",
          },
        ],
        attributes: ["id", "qty", "desc", "tgl_pindah"],
      });

      res.status(200).json(pindah);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  updatePenyusutan = async (req, res) => {
    try {
      const brgPindah = await Pemindahan.findAll({
        include: {
          model: Barang,
          as: "nama_barang",
          include: [{ model: Kategori }],
        },
      });

      for (const item of brgPindah) {
        // Hitung selisih bulan

        const masaEkonomisKategori = item.nama_barang.umur_ekonomis;

        // Total penyusutan yang sudah terjadi ( max harga beli)

        // Nilai buku tidak boleh negatif
        const nilaiBuku = item.nama_barang.nilai_buku;

        // Update data barang
        await Pemindahan.update(
          {
            nilai_buku: nilaiBuku,
            umur_ekonomis: masaEkonomisKategori,
          },
          { where: { id: item.id } }
        );
      }

      res.status(200).json({ msg: "Berhasil update penyusutan semua barang." });
      // const brgPindah = await Pemindahan.findAll({
      //   include: {
      //     model: Barang,
      //     as: "nama_barang",
      //     include: [{ model: Kategori }],
      //   },
      // });

      // for (const item of brgPindah) {
      //   const tglBeli = new Date(item.nama_barang.tgl_beli);
      //   const now = new Date();

      //   // Hitung selisih bulan
      //   const selisihBulan =
      //     (now.getFullYear() - tglBeli.getFullYear()) * 12 +
      //     (now.getMonth() - tglBeli.getMonth());

      //   const masaEkonomisKategori =
      //     item.nama_barang.kategori_brg.masa_ekonomis * this.bulanPerTahun;
      //   const penyusutanPerBulan = item.biaya_penyusutan;

      //   // Total penyusutan yang sudah terjadi ( max harga beli)
      //   const totalPenyusutan = Math.min(
      //     selisihBulan * penyusutanPerBulan,
      //     item.nama_barang.harga
      //   );

      //   // Nilai buku tidak boleh negatif
      //   const nilaiBuku = Math.max(0, item.nama_barang.harga - totalPenyusutan);

      //   // Update data barang
      //   await Pemindahan.update(
      //     {
      //       penyusutan_berjalan: totalPenyusutan,
      //       nilai_buku: nilaiBuku,
      //       umur_ekonomis: parseFloat(
      //         (
      //           this.hitungSisaUmurBulan(tglBeli, masaEkonomisKategori) /
      //           this.bulanPerTahun
      //         ).toFixed(1)
      //       ),
      //     },
      //     { where: { id: item.id } }
      //   );
      // }

      // res.status(200).json({ msg: "Berhasil update penyusutan semua barang." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  updatePemindahan = async (req, res) => {
    const {
      barangId,
      qty,
      desc,
      from,
      to,
      tgl_pindah,
      kondisi,
      riwayat_pemeliharaan,
    } = req.body;
    try {
      const pindah = await Pemindahan.findByPk(req.params.id, {
        include: {
          model: Barang,
          as: "nama_barang",
        },
      });
      if (!pindah) {
        return res
          .status(404)
          .json({ msg: "Data pemindahan tidak ditemukan!" });
      }
      const qtyBarang = pindah.nama_barang.qty;
      const selisih = qty - pindah.qty;
      if (selisih > qtyBarang) {
        return res.status(400).json({ msg: "Input jumlah tidak valid!" });
      }
      await Pemindahan.update(
        {
          qty,
          barangId,
          desc,
          from,
          to,
          tgl_pindah,
          kondisi,
          riwayat_pemeliharaan,
        },
        { where: { id: pindah.id } }
      );
      if (qty) {
        await Barang.update(
          { qty: qtyBarang - selisih },
          { where: { id: pindah.nama_barang.id } }
        );
      }
      res.status(200).json({ msg: "Berhasil update data pindah." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  deletePemindahan = async (req, res) => {
    try {
      const pindah = await Pemindahan.findByPk(req.params.id);

      if (!pindah) {
        return res
          .status(404)
          .json({ msg: "Data pemindahan tidak ditemukan!" });
      }

      await Pemindahan.destroy({ where: { id: pindah.id } });
      res.status(200).json({ msg: "Berhasil menghapus data pindah." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };
}

export default PemindahanController;
