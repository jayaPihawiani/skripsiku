import { Op } from "sequelize";
import Barang from "../models/BarangModel.js";
import Distribusi from "../models/DistribusiBrgModel.js";
import Divisi from "../models/DivisiModel.js";
import Lokasi from "../models/LokasiModel.js";
import User from "../models/UserModels.js";

class DistribusiController {
  createDistribusi = async (req, res) => {
    const { barangId, lokasiId, userId, qty } = req.body;

    if (!barangId || !userId || !lokasiId || !qty) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }

    try {
      const barang = await Barang.findByPk(barangId);

      if (qty > barang.qty) {
        return res.status(400).json({ msg: "Input jumlah tidak valid!" });
      }

      await Barang.update(
        { qty: barang.qty - qty },
        {
          where: {
            id: barang.id,
          },
        }
      );

      await Distribusi.create({ barangId, lokasiId, userId, qty });

      res.status(201).json({ msg: "Berhasil menambah data distribusi" });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error });
    }
  };

  getDistribusi = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    const offset = limit * page;
    let totalPage;
    let count;

    try {
      let distribusi;

      if (req.role === "user") {
        count = await Distribusi.count({
          include: [
            { model: Barang, where: { name: { [Op.like]: `%${search}%` } } },
          ],
          where: { userId: req.uid },
        });

        totalPage = Math.ceil(count / limit);

        distribusi = await Distribusi.findAll({
          include: [
            {
              model: User,
              include: [{ model: Divisi, attributes: ["name", "desc"] }],
              attributes: ["id", "nip", "username", "role"],
              where: { id: req.uid },
            },
            { model: Lokasi, attributes: ["name", "desc"] },
            { model: Barang, where: { name: { [Op.like]: `%${search}%` } } },
          ],
          attributes: ["id", "qty", "createdAt", "updatedAt"],
          limit,
          offset,
          order: [["createdAt", "ASC"]],
        });
      } else {
        count = await Distribusi.count({
          include: [
            { model: Barang, where: { name: { [Op.like]: `%${search}%` } } },
          ],
        });

        totalPage = Math.ceil(count / limit);

        distribusi = await Distribusi.findAll({
          include: [
            {
              model: User,
              include: [{ model: Divisi, attributes: ["name", "desc"] }],
              attributes: ["id", "nip", "username", "role"],
            },
            { model: Lokasi, attributes: ["name", "desc"] },
            { model: Barang, where: { name: { [Op.like]: `%${search}%` } } },
          ],
          attributes: ["id", "qty", "createdAt", "updatedAt"],
          limit,
          offset,
          order: [["createdAt", "ASC"]],
        });
      }

      res.status(200).json({ limit, page, totalPage, count, distribusi });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error });
    }
  };

  updateDistribusi = async (req, res) => {};

  deleteDistribusi = async (req, res) => {
    try {
      const distribusi = await Distribusi.findByPk(req.params.id);

      if (!distribusi) {
        return res
          .status(404)
          .json({ msg: "Data distribusi barang tidak ditemukan!" });
      }

      await Distribusi.destroy({ where: { id: distribusi.id } });

      res.status(200).json({ msg: "Berhasil menghapus data distribusi!" });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error });
    }
  };
}

export default DistribusiController;
