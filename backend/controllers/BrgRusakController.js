import { Op, where } from "sequelize";
import Barang from "../models/BarangModel.js";
import BrgRusak from "../models/BarangRusakModel.js";
import BarangUnitModel from "../models/BarangUnitModel.js";
import Lokasi from "../models/LokasiModel.js";
import Kategori from "../models/KategoriBarang.js";

class BrgRusakController {
  // ADD DAFTAR RUSAK
  createBrgRusak = async (req, res) => {
    const {
      desc,
      riwayat_pemeliharaan,
      sebab_kerusakan,
      status_perbaikan,
      barangUnitId,
    } = req.body;

    try {
      // Validasi input
      if (
        !desc ||
        !barangUnitId ||
        !riwayat_pemeliharaan ||
        !sebab_kerusakan ||
        !status_perbaikan
      ) {
        return res
          .status(400)
          .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
      }

      const unitBrg = await BarangUnitModel.findOne({
        where: {
          id: barangUnitId,
          status: "baik",
        },
      });

      if (!unitBrg) {
        return res
          .status(404)
          .json({ msg: "Data unit barang tidak ditemukan!" });
      }

      await BarangUnitModel.update(
        { status: "rusak" },
        { where: { id: barangUnitId } }
      );

      await BrgRusak.create({
        desc,
        riwayat_pemeliharaan,
        sebab_kerusakan,
        status_perbaikan,
        barangUnitId,
        sisa_stok: await BarangUnitModel.count({ where: { status: "baik" } }),
      });

      res.status(201).json({ msg: "Berhasil menandai barang sebagai rusak." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getBrgRusak = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    const offset = limit * page;
    const lokasi = req.query.lokasi || "";
    const status_perbaikan = req.query.status_perbaikan || "";
    let totalPage;

    try {
      const count = await BrgRusak.count({
        include: {
          model: BarangUnitModel,
          required: true,
          include: [
            {
              model: Barang,
              required: true,
              where: { name: { [Op.like]: `%${search}%` } },
            },
            {
              model: Lokasi,
              as: "loc_barang",
              required: true,
              where: { name: { [Op.like]: `%${lokasi}%` } },
            },
          ],
        },
        where: {
          status_perbaikan: { [Op.like]: `%${status_perbaikan}%` },
        },
      });

      totalPage = Math.ceil(count / limit);

      const result = await BrgRusak.findAll({
        include: {
          model: BarangUnitModel,
          required: true,
          attributes: [
            "kode_barang",
            "tgl_beli",
            "harga",
            "umur_ekonomis",
            "biaya_penyusutan",
            "penyusutan_berjalan",
            "nilai_buku",
          ],
          include: [
            {
              model: Barang,
              required: true,
              attributes: ["name", "desc"],
              where: { name: { [Op.like]: `%${search}%` } },
            },
            {
              model: Lokasi,
              as: "loc_barang",
              required: true,
              attributes: ["name", "desc"],
              where: { name: { [Op.like]: `%${lokasi}%` } },
            },
          ],
        },
        where: {
          status_perbaikan: { [Op.like]: `%${status_perbaikan}%` },
        },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({ page, limit, totalPage, count, result });
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
        include: { model: BarangUnitModel },
      });

      if (!brg_rusak) {
        return res
          .status(404)
          .json({ msg: "Data inventaris barang rusak tidak ditemukan!" });
      }

      const pengurangPersen = brg_rusak.riwayat_pemeliharaan || 0;

      // Update status perbaikan di tabel BrgRusak
      await BrgRusak.update(
        { status_perbaikan },
        { where: { id: brg_rusak.id } }
      );

      let umurBaru = brg_rusak.barang_unit.umur_ekonomis;
      let nilaiBaru = brg_rusak.barang_unit.nilai_buku;

      // Hitung penyusutan
      umurBaru = Math.max(umurBaru - (umurBaru * pengurangPersen) / 100, 0);
      nilaiBaru = Math.max(nilaiBaru - (nilaiBaru * pengurangPersen) / 100, 0);

      // Kalau status tertentu, langsung nol
      if (
        status_perbaikan === "SELESAI DIPERBAIKI TIDAK BISA DIGUNAKAN" ||
        status_perbaikan === "TIDAK BISA DIPERBAIKI"
      ) {
        umurBaru = 0;
        nilaiBaru = 0;
      }

      // Update hanya unit ini saja
      await BarangUnitModel.update(
        {
          umur_ekonomis: umurBaru,
          nilai_buku: nilaiBaru,
          status_perbaikan,
          status:
            status_perbaikan === "SELESAI DIPERBAIKI BISA DIGUNAKAN"
              ? "baik"
              : "rusak",
        },
        { where: { id: brg_rusak.barang_unit.id } }
      );

      res.status(200).json({
        msg: "Berhasil update data barang rusak.",
      });
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
