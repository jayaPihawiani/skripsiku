import { Op } from "sequelize";
import Barang from "../models/BarangModel.js";
import Lokasi from "../models/LokasiModel.js";
import Permintaan from "../models/Permintaan.js";
import User from "../models/UserModels.js";
import BarangUnitModel from "../models/BarangUnitModel.js";
import Pemindahan from "../models/Pemindahan.js";

class PermintaanController {
  createPermintaan = async (req, res) => {
    const { barangId, qty } = req.body;
    if (!barangId || !qty) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }

    try {
      const barang = await Barang.findByPk(barangId);

      if (qty > barang.qty) {
        return res.status(400).json({ msg: "Input jumlah tidak valid!" });
      }

      await Permintaan.create({
        barangId,
        userId: req.uid,
        qty,
        status: "belum disetujui",
      });

      res.status(201).json({ msg: "Berhasil membuat permintaan inventaris." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getPermintaan = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    const offset = limit * page;
    let totalPage;
    let count;
    let permintaan;
    let row;

    try {
      if (req.role === "user") {
        count = await Permintaan.count({
          where: { userId: req.uid },
          include: {
            model: Barang,
            where: { name: { [Op.like]: `%${search}%` } },
          },
        });

        totalPage = Math.ceil(count / limit);

        permintaan = await Permintaan.findAll({
          attributes: ["id", "qty", "userId", "status", "createdAt"],
          include: [
            { model: Barang, where: { name: { [Op.like]: `%${search}%` } } },
            {
              model: User,
              where: { id: req.uid },
              attributes: ["id", "nip", "username", "role"],
              include: [
                { model: Lokasi, as: "loc_user", attributes: ["name", "desc"] },
              ],
            },
          ],
          limit,
          offset,
          order: [["createdAt", "ASC"]],
        });

        row = permintaan.length;
      } else {
        count = await Permintaan.count({
          include: {
            model: Barang,
            where: { name: { [Op.like]: `%${search}%` } },
          },
        });

        totalPage = Math.ceil(count / limit);

        permintaan = await Permintaan.findAll({
          attributes: ["id", "qty", "status", "createdAt"],
          include: [
            { model: Barang, where: { name: { [Op.like]: `%${search}%` } } },
            {
              model: User,
              attributes: ["id", "nip", "username", "role"],
              include: [
                { model: Lokasi, as: "loc_user", attributes: ["name", "desc"] },
              ],
            },
          ],
          limit,
          offset,
          order: [["createdAt", "ASC"]],
        });
        row = permintaan.length;
      }
      res.status(200).json({ row, limit, page, totalPage, count, permintaan });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getPermintaanById = async (req, res) => {};

  deletePermintaan = async (req, res) => {
    try {
      const permintaan = await Permintaan.findByPk(req.params.id);
      if (!permintaan) {
        return res
          .status(404)
          .json({ msg: "Data permintaan tidak ditemukan!" });
      }

      await Permintaan.destroy({ where: { id: permintaan.id } });
      res.status(200).json({ msg: "Berhasil menghapus permintaan!" });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  updateStatusPermintaan = async (req, res) => {
    const { qty, status } = req.body;
    try {
      const permintaan = await Permintaan.findByPk(req.params.id, {
        include: [
          { model: Barang },
          { model: User, include: [{ model: Lokasi, as: "loc_user" }] },
        ],
      });

      const barangName = permintaan.barang.name;

      const lokasi = await Lokasi.findOne({
        where: { name: "ASET & PERLENGKAPAN" },
      });
      const lokasiId = lokasi.id;
      const locUser = permintaan.user.lokasiId;
      const userId = permintaan.user.id;

      const jumlahBarangUnit = await BarangUnitModel.count({
        include: {
          required: true,
          model: Barang,
          where: { name: barangName },
        },
        where: { lokasi_barang: lokasiId },
      });

      if (qty > jumlahBarangUnit) {
        return res.status(400).json({ msg: "Input jumlah tidak valid!" });
      }

      if (status === "disetujui") {
        await Permintaan.update(
          { qty, status },
          { where: { id: req.params.id } }
        );

        const brgUnit = await BarangUnitModel.findAll({
          include: {
            required: true,
            model: Barang,
            where: { name: barangName },
          },
          where: { lokasi_barang: lokasiId },
          limit: Number(qty),
        });

        for (let item of brgUnit) {
          await Pemindahan.create({
            barangUnitId: item.id,
            userId,
            from: lokasiId,
            to: locUser,
          });
          await BarangUnitModel.update(
            { lokasi_barang: locUser },
            { where: { id: item.id } }
          );
        }
      } else {
        await Permintaan.update(
          { qty, status },
          { where: { id: req.params.id } }
        );
      }

      // res.status(200).json({ locUser });
      res.status(200).json({ msg: "Berhasil ubah data permintaan." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };
}

export default PermintaanController;
