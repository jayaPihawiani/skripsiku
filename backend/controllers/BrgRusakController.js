import { Op } from "sequelize";
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
      locBarang,
    } = req.body;

    try {
      // Validasi input
      if (
        !barangUnitId ||
        !riwayat_pemeliharaan ||
        !sebab_kerusakan ||
        !status_perbaikan ||
        !locBarang
      ) {
        return res
          .status(400)
          .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
      }

      // Ambil unit barang di lokasi tersebut yg masih kondisi "baik"
      const checkBarang = await BarangUnitModel.findAll({
        where: {
          id: barangUnitId,
          lokasi_barang: locBarang,
          status: "baik",
        },
      });

      // Tandai unit sebagai "rusak"
      for (const unit of checkBarang) {
        await unit.update({
          status: "rusak",
          desc,
          riwayat_pemeliharaan,
          sebab_kerusakan,
          status_perbaikan,
        });
      }

      // Hitung sisa stok di lokasi tersebut setelah rusak
      const sisaStok = await BarangUnitModel.count({
        where: {
          id: barangUnitId,
          lokasi_barang: locBarang,
          status: "baik",
        },
      });

      // Simpan riwayat ke tabel BrgRusak
      await BrgRusak.create({
        desc,
        barangUnitId,
        riwayat_pemeliharaan,
        sebab_kerusakan,
        status_perbaikan,
        sisa_stok: sisaStok,
      });

      res.status(201).json({ msg: "Berhasil menandai barang sebagai rusak." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  // getBrgRusak = async (req, res) => {
  //   const limit = parseInt(req.query.limit) || 10;
  //   const page = parseInt(req.query.page) || 0;
  //   const search = req.query.search || "";
  //   const offset = limit * page;
  //   const lokasi = req.query.lokasi || "";
  //   const status_perbaikan = req.query.status_perbaikan || "";

  //   try {
  //     // Hitung total item yang cocok dengan pencarian
  //     const count = await BarangUnitModel.count({
  //       include: [
  //         {
  //           model: Barang,
  //           where: { name: { [Op.like]: `%${search}%` } },
  //         },
  //       ],
  //       where: { status: "rusak" },
  //     });

  //     const totalPage = Math.ceil(count / limit);

  //     // Ambil data
  //     const brg_rusak = await BarangUnitModel.findAll({
  //       where: { status: "rusak" },
  //       include: [
  //         {
  //           model: Barang,
  //           attributes: [
  //             "id",
  //             "name",
  //             "desc",
  //             "umur_ekonomis",
  //             "image",
  //             "url",
  //             "createdAt",
  //             "updatedAt",
  //           ],
  //           where: { name: { [Op.like]: `%${search}%` } },
  //           include: [{ model: BrgRusak }],
  //         },
  //         { model: Lokasi, as: "loc_asal" },
  //         { model: Lokasi, as: "loc_barang" },
  //       ],
  //       limit,
  //       offset,
  //       order: [["createdAt", "DESC"]],
  //     });

  //     res.status(200).json({ page, limit, totalPage, count, brg_rusak });
  //   } catch (error) {
  //     res.status(500).json({ msg: "ERROR: " + error.message });
  //   }
  // };

  getBrgRusak = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    const offset = limit * page;
    const lokasi = req.query.lokasi || ""; // bisa berupa id lokasi
    const status_perbaikan = req.query.status_perbaikan || "";

    try {
      // Buat where dinamis untuk BarangUnitModel
      let whereUnit = { status: "rusak" };
      if (status_perbaikan) whereUnit.status_perbaikan = status_perbaikan;

      // Buat include untuk Barang
      let whereBarang = {};
      if (search) whereBarang.name = { [Op.like]: `%${search}%` };

      // Buat include untuk Lokasi
      let includeLokasi = [
        { model: Lokasi, as: "loc_asal" },
        { model: Lokasi, as: "loc_barang" },
      ];
      if (lokasi) {
        includeLokasi = [
          { model: Lokasi, as: "loc_asal" },
          { model: Lokasi, as: "loc_barang", where: { id: lokasi } },
        ];
      }

      // Hitung total item
      const count = await BarangUnitModel.count({
        where: whereUnit,
        include: [{ model: Barang, where: whereBarang }, ...includeLokasi],
      });

      const totalPage = Math.ceil(count / limit);

      // Ambil data
      const brg_rusak = await BarangUnitModel.findAll({
        where: whereUnit,
        include: [
          {
            model: Barang,
            attributes: [
              "id",
              "name",
              "desc",
              "umur_ekonomis",
              "image",
              "url",
              "createdAt",
              "updatedAt",
            ],
            where: whereBarang,
            include: [{ model: BrgRusak }],
          },
          ...includeLokasi,
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
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

  // updateBrgRusak = async (req, res) => {
  //   const { status_perbaikan } = req.body;
  //   try {
  //     const brg_rusak = await BrgRusak.findByPk(req.params.id, {
  //       include: { model: Barang },
  //     });

  //     if (!brg_rusak) {
  //       return res
  //         .status(404)
  //         .json({ msg: "Data inventaris barang rusak tidak ditemukan!" });
  //     }

  //     const idBarang = brg_rusak.barang.id;

  //     await BrgRusak.update(
  //       { status_perbaikan },
  //       { where: { id: brg_rusak.id } }
  //     );
  //     res.status(200).json({ msg: "Berhasil update data barang rusak." });
  //   } catch (error) {
  //     res.status(500).json({ msg: "ERROR: " + error.message });
  //   }
  // };

  // updateBrgRusak = async (req, res) => {
  //   const { status_perbaikan } = req.body;

  //   try {
  //     const brg_rusak = await BarangUnitModel.findByPk(req.params.id, {
  //       include: { model: Barang },
  //     });

  //     if (!brg_rusak) {
  //       return res
  //         .status(404)
  //         .json({ msg: "Data inventaris barang rusak tidak ditemukan!" });
  //     }

  //     const barangId = brg_rusak.barangId;
  //     const pengurangPersen = brg_rusak.riwayat_pemeliharaan || 0;

  //     // Update status perbaikan di tabel BrgRusak
  //     await BrgRusak.update(
  //       { status_perbaikan },
  //       { where: { id: brg_rusak.id } }
  //     );

  //     // Ambil semua unit rusak dari barang ini
  //     const unitRusak = await BarangUnitModel.findAll({
  //       where: {
  //         barangId,
  //         status: "rusak",
  //       },
  //     });

  //     for (const unit of unitRusak) {
  //       if (status_perbaikan === "SELESAI DIPERBAIKI BISA DIGUNAKAN") {
  //         const umurBaru = Math.max(
  //           unit.umur_ekonomis - (unit.umur_ekonomis * pengurangPersen) / 100,
  //           0
  //         );
  //         const nilaiBaru = Math.max(
  //           unit.nilai_buku - (unit.nilai_buku * pengurangPersen) / 100,
  //           0
  //         );

  //         await unit.update({
  //           // status: "baik",
  //           umur_ekonomis: umurBaru,
  //           nilai_buku: nilaiBaru,
  //           status_perbaikan,
  //         });
  //       } else if (
  //         status_perbaikan === "SELESAI DIPERBAIKI TIDAK BISA DIGUNAKAN" ||
  //         status_perbaikan === "TIDAK BISA DIPERBAIKI"
  //       ) {
  //         await unit.update({
  //           umur_ekonomis: 0,
  //           nilai_buku: 0,
  //           status_perbaikan,
  //         });
  //       }
  //     }

  //     res
  //       .status(200)
  //       .json({ msg: "Berhasil update data barang rusak & unit." });
  //   } catch (error) {
  //     res.status(500).json({ msg: "ERROR: " + error.message });
  //   }
  // };

  updateBrgRusak = async (req, res) => {
    const { status_perbaikan } = req.body;

    try {
      // Ambil unit rusak yang dimaksud
      const brg_rusak = await BarangUnitModel.findByPk(req.params.id, {
        include: { model: Barang },
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

      let umurBaru = brg_rusak.umur_ekonomis;
      let nilaiBaru = brg_rusak.nilai_buku;

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
      await brg_rusak.update({
        umur_ekonomis: umurBaru,
        nilai_buku: nilaiBaru,
        status_perbaikan,
      });

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
