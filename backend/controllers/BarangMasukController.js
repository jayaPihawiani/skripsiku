import { Op } from "sequelize";
import BarangMasuk from "../models/BarangMasuk.js";
import Barang from "../models/BarangModel.js";

class BarangMasukController {
  createBarangMasuk = async (req, res) => {
    const { barangId, qty, desc, tgl_masuk } = req.body;

    try {
      const barang = await Barang.findByPk(barangId);

      if (!barangId || !qty || !desc || !tgl_masuk) {
        return res
          .status(400)
          .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
      }

      await Barang.update(
        { qty: barang.qty + parseInt(qty) },
        { where: { id: barangId } }
      );

      await BarangMasuk.create({
        barangId,
        qty,
        desc,
        tgl_masuk,
        sisa_stok: barang.qty + parseInt(qty),
      });

      res.status(201).json({ msg: "Berhasil menambah data barang masuk." });
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
