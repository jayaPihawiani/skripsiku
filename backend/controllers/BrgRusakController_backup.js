import { Op } from "sequelize";
import Barang from "../models/BarangModel.js";
import BrgRusak from "../models/BarangRusakModel.js";

class BrgRusakController {
  // ADD DAFTAR RUSAK
  // createBrgRusak = async (req, res) => {
  //   const {
  //     qty,
  //     desc,
  //     riwayat_pemeliharaan,
  //     sebab_kerusakan,
  //     status_perbaikan,
  //     barangUnitId,
  //     pengurang,
  //   } = req.body;

  //   try {
  //     if (
  //       !barangUnitId ||
  //       !qty ||
  //       !riwayat_pemeliharaan ||
  //       !sebab_kerusakan ||
  //       !status_perbaikan
  //     ) {
  //       return res
  //         .status(400)
  //         .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
  //     }

  //     const checkBarang = await Barang.findByPk(barangUnitId);

  //     if (qty > checkBarang.qty) {
  //       return res.status(400).json({ msg: "Input jumlah tidak valid!" });
  //     }

  //     await Barang.update(
  //       { qty: checkBarang.qty - parseInt(qty) },
  //       { where: { id: checkBarang.id } }
  //     );

  //     await BrgRusak.create({
  //       desc,
  //       barangUnitId,
  //       qty,
  //       riwayat_pemeliharaan,
  //       sebab_kerusakan,
  //       pengurang,
  //       status_perbaikan,
  //       sisa_stok: checkBarang.qty - parseInt(qty),
  //     });

  //     res.status(201).json({ msg: "Berhasil menambah daftar rusak." });
  //   } catch (error) {
  //     res.status(500).json({ msg: "ERROR: " + error.message });
  //   }
  // };

  createBrgRusak = async (req, res) => {
    const {
      barangUnitId,
      desc,
      riwayat_pemeliharaan,
      sebab_kerusakan,
      status_perbaikan,
      pengurang,
    } = req.body;

    if (
      !barangUnitId ||
      !desc ||
      !riwayat_pemeliharaan ||
      !sebab_kerusakan ||
      !status_perbaikan
    ) {
      return res.status(400).json({
        msg: "Data ada yang kosong! Harap isi semua data!",
      });
    }

    try {
      // Ambil data unit barang beserta barang dan kategori
      const unit = await BarangUnitModel.findByPk(barangUnitId, {
        include: [
          {
            model: Barang,
            include: [{ model: Kategori, as: "kategori_brg" }],
          },
        ],
      });

      if (!unit) {
        return res.status(404).json({ msg: "Barang unit tidak ditemukan!" });
      }

      // Update status/kondisi unit barang menjadi rusak
      await unit.update({ kondisi: "Rusak" });

      // Simpan riwayat barang rusak
      await BrgRusak.create({
        barangUnitId: unit.id,
        barangId: unit.barangId,
        kategoriId: unit.Barang.kategoriId,
        desc,
        qty: 1, // Karena per unit
        riwayat_pemeliharaan,
        sebab_kerusakan,
        pengurang,
        status_perbaikan,
        umur_ekonomis: unit.umur_ekonomis,
        biaya_penyusutan: unit.biaya_penyusutan,
        penyusutan_berjalan: unit.penyusutan_berjalan,
        nilai_buku: unit.nilai_buku,
        kondisi: "Rusak",
        lokasi_barang: unit.lokasi_barang,
      });

      res
        .status(201)
        .json({ msg: "Berhasil menandai unit barang sebagai rusak." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getBrgRusak = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    const offset = limit * page;
    let totalPage;

    try {
      const count = await BrgRusak.count({
        include: {
          model: Barang,
          where: { name: { [Op.like]: `%${search}%` } },
        },
      });

      totalPage = Math.ceil(count / limit);

      const brg_rusak = await BrgRusak.findAll({
        include: {
          model: Barang,
          attributes: [
            "id",
            "name",
            "desc",
            "qty",
            "image",
            "url",
            "createdAt",
            "updatedAt",
          ],
          where: { name: { [Op.like]: `%${search}%` } },
        },
        attributes: [
          "id",
          "desc",
          "qty",
          "riwayat_pemeliharaan",
          "sebab_kerusakan",
          "status_perbaikan",
          "sisa_stok",
          "createdAt",
          "updatedAt",
        ],
        limit,
        offset,
        order: [["createdAt", "ASC"]],
      });

      res.status(200).json({ page, limit, totalPage, count, brg_rusak });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getBrgRusakById = async (req, res) => {
    try {
      const brg_rusak = await BrgRusak.findByPk(req.params.id, {
        include: { model: Barang, attributes: ["name", "desc", "qty"] },
        attributes: ["id", "desc", "qty", "createdAt", "updatedAt"],
      });

      if (!brg_rusak) {
        return res
          .status(404)
          .json({ msg: "Data inventaris barang rusak tidak ditemukan!" });
      }
      res.status(200).json(brg_rusak);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getAllBrgRusak = async (req, res) => {
    try {
      const brg_rusak = await BrgRusak.findAll({
        include: { model: Barang, attributes: ["name", "desc", "qty"] },
        attributes: ["id", "desc", "qty", "createdAt", "updatedAt"],
      });

      res.status(200).json(brg_rusak);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getAllBrgRusakDiperbaiki = async (req, res) => {
    try {
      const brg_rusak = await BrgRusak.findAll({
        include: { model: Barang, attributes: ["name", "desc", "qty"] },
        // attributes: ["id", "desc", "qty", "createdAt", "updatedAt"],
        where: {
          status_perbaikan: "SEDANG DIPERBAIKI",
        },
      });

      res.status(200).json(brg_rusak);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  updateBrgRusak = async (req, res) => {
    const { status_perbaikan } = req.body;
    try {
      const brg_rusak = await BrgRusak.findByPk(req.params.id, {
        include: { model: Barang },
      });

      if (!brg_rusak) {
        return res
          .status(404)
          .json({ msg: "Data inventaris barang rusak tidak ditemukan!" });
      }

      await BrgRusak.update(
        { status_perbaikan },
        { where: { id: brg_rusak.id } }
      );
      // const qtyBarang = brg_rusak.barang.qty;
      // const selisih = qty - brg_rusak.qty;

      // if (selisih > qtyBarang) {
      //   return res.status(400).json({ msg: "Input jumlah tidak valid!" });
      // }

      // await BrgRusak.update(
      //   { desc, qty, status_perbaikan },
      //   { where: { id: brg_rusak.id } }
      // );
      // await Barang.update(
      //   { qty: qtyBarang - selisih },
      //   { where: { id: brg_rusak.barang.id } }
      // );
      res.status(200).json({ msg: "Berhasil update data barang rusak." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  deleteBrgRusak = async (req, res) => {
    try {
      const brg_rusak = await BrgRusak.findByPk(req.params.id);

      if (!brg_rusak) {
        return res
          .status(404)
          .json({ msg: "Data inventaris barang rusak tidak ditemukan!" });
      }

      await BrgRusak.destroy({ where: { id: brg_rusak.id } });
      res
        .status(200)
        .json({ msg: "Berhasil menghapus inventaris barang rusak." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };
}

export default BrgRusakController;
