import { Op } from "sequelize";
import Barang from "../models/BarangModel.js";
import BrgRusak from "../models/BarangRusakModel.js";

class BrgRusakController {
  // ADD DAFTAR RUSAK
  createBrgRusak = async (req, res) => {
    const { desc, qty, barangId } = req.body;
    try {
      if (!barangId || !desc || !qty) {
        return res
          .status(400)
          .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
      }

      const checkBarang = await Barang.findByPk(barangId);

      if (qty > checkBarang.qty) {
        return res.status(400).json({ msg: "Input jumlah tidak valid!" });
      }

      await BrgRusak.create({ barangId, desc, qty: qty });
      await Barang.update(
        { qty: checkBarang.qty - qty },
        { where: { id: checkBarang.id } }
      );
      res.status(201).json({ msg: "Berhasil menambah daftar rusak." });
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
        attributes: ["id", "desc", "qty", "createdAt", "updatedAt"],
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

  updateBrgRusak = async (req, res) => {
    const { desc, qty } = req.body;
    try {
      const brg_rusak = await BrgRusak.findByPk(req.params.id, {
        include: { model: Barang },
      });

      if (!brg_rusak) {
        return res
          .status(404)
          .json({ msg: "Data inventaris barang rusak tidak ditemukan!" });
      }

      const qtyBarang = brg_rusak.barang.qty;
      const selisih = qty - brg_rusak.qty;

      if (selisih > qtyBarang) {
        return res.status(400).json({ msg: "Input jumlah tidak valid!" });
      }

      await BrgRusak.update({ desc, qty }, { where: { id: brg_rusak.id } });
      await Barang.update(
        { qty: qtyBarang - selisih },
        { where: { id: brg_rusak.barang.id } }
      );
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
