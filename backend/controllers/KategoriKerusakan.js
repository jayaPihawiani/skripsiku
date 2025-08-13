import { Op } from "sequelize";
import {
  KategoriKerusakan,
  DetailKerusakan,
} from "../models/KategoriKerusakanModel.js";

class KategoriKerusakanController {
  createKategoriKerusakan = async (req, res) => {
    const { jenis } = req.body;

    try {
      const detail = await KategoriKerusakan.findOne({ where: { jenis } });

      if (detail) {
        return res
          .status(400)
          .json({ msg: "Data Kategori Kerusakan sudah ada!" });
      }

      await KategoriKerusakan.create({ jenis });

      res
        .status(201)
        .json({ msg: "Berhasil menambah data kategori kerusakan!" });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error });
    }
  };

  getKategoriKerusakan = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = limit * page;
    let totalPage;
    try {
      const count = await KategoriKerusakan.count({
        where: { jenis: { [Op.like]: `%${search}%` } },
      });

      totalPage = Math.ceil(count / limit);

      const response = await KategoriKerusakan.findAll({
        where: { jenis: { [Op.like]: `%${search}%` } },
        include: { model: DetailKerusakan, order: [["createdAt", "ASC"]] },
        limit,
        offset,
        order: [["createdAt", "ASC"]],
      });

      res.status(200).json({ page, limit, totalPage, count, response });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error });
    }
  };

  getAllKategoriKerusakan = async (req, res) => {
    try {
      const response = await KategoriKerusakan.findAll({
        include: { model: DetailKerusakan, order: [["createdAt", "ASC"]] },
        order: [["createdAt", "ASC"]],
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error });
    }
  };

  getKategoriKerusakanyJenis = async (req, res) => {
    const search = req.query.search || "";
    try {
      const response = await KategoriKerusakan.findAll({
        where: {
          jenis: { [Op.like]: `%${search}%` },
        },
        include: { model: DetailKerusakan },
      });

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error });
    }
  };

  updateKategoriKerusakan = async (req, res) => {};

  deleteKategoriKerusakan = async (req, res) => {
    try {
      const response = await KategoriKerusakan.findByPk(req.params.id);
      if (!response) {
        return res.status(404).json({ msg: "Data tidak ditemukan!" });
      }

      await KategoriKerusakan.destroy({ where: { id: response.id } });
      res
        .status(200)
        .json({ msg: "Berhasil menghapus data kategori kerusakan!" });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error });
    }
  };
}

class DetailKerusakanController {
  createDetailKerusakan = async (req, res) => {
    const { desc, pengurang, kategoriKerusakanId } = req.body;

    try {
      if (!desc || !pengurang || !kategoriKerusakanId) {
        return res
          .status(400)
          .json({ msg: "Data detail kerusakan tidak boleh kosong!" });
      }

      await DetailKerusakan.create({ desc, pengurang, kategoriKerusakanId });

      res.status(201).json({ msg: "Berhasil menambah data detail kerusakan!" });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error });
    }
  };

  getDetailKerusakan = async (req, res) => {
    try {
      const response = await DetailKerusakan.findAll({
        include: { model: KategoriKerusakan },
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error });
    }
  };

  updateDetailKerusakan = async (req, res) => {};

  deleteDetailKerusakan = async (req, res) => {
    try {
      const response = await DetailKerusakan.findByPk(req.params.id);
      if (!response) {
        return res.status(404).json({ msg: "Data tidak ditemukan!" });
      }

      await DetailKerusakan.destroy({ where: { id: response.id } });
      res
        .status(200)
        .json({ msg: "Berhasil menghapus data kategori kerusakan!" });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error });
    }
  };
}

export { KategoriKerusakanController, DetailKerusakanController };
