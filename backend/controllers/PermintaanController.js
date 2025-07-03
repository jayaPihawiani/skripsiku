import supabase from "../config/supabase/supabaseClient.js";
import Permintaan from "../models/Permintaan.js";
import User from "../models/UserModels.js";
import Divisi from "../models/DivisiModel.js";
import { Op } from "sequelize";

class PermintaanController {
  createPermintaan = async (req, res) => {
    const { name, desc, qty } = req.body;

    if (!name || !desc || !qty) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }

    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "File belum dipilih!" });
    }
    const fileUpload = req.files;

    const ext = `.${fileUpload.file.name.split(".").pop()}`;
    const fileName = `file_${Date.now()}${ext}`;
    const fileType = [".xlsx", ".docx", ".pdf"];

    if (!fileType.includes(ext.toLowerCase()))
      return res.status(400).json({ msg: "Format file tidak didukung!" });

    try {
      const supabaseUpload = await supabase.storage
        .from("product")
        .upload(fileName, fileUpload.file.data, {
          upsert: true,
          contentType: fileUpload.file.mimetype,
        });

      if (supabaseUpload.error) {
        return res.status(500).json({
          err: "ERROR: Gagal mengunggah dokumen!",
          stack: supabaseUpload.error.stack,
          msg: supabaseUpload.error.message,
        });
      }

      const url = supabase.storage.from("product").getPublicUrl(fileName)
        .data.publicUrl;

      await Permintaan.create({
        name,
        desc,
        qty,
        file: fileName,
        url,
        userId: req.uid,
      });

      res.status(201).json({ msg: "Berhasil membuat data permintaan!" });
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
    try {
      let permintaan;
      if (req.role === "user") {
        count = await Permintaan.count({
          where: { userId: req.uid, name: { [Op.like]: `%${search}%` } },
        });

        totalPage = Math.ceil(count / limit);

        permintaan = await Permintaan.findAll({
          include: {
            model: User,
            attributes: ["nip", "username", "id", "role"],
            include: [{ model: Divisi, attributes: ["name", "desc"] }],
          },
          attributes: [
            "id",
            "name",
            "desc",
            "qty",
            "file",
            "url",
            "userId",
            "createdAt",
            "updatedAt",
          ],
          where: { userId: req.uid, name: { [Op.like]: `%${search}%` } },
          limit,
          offset,
          order: [["createdAt", "ASC"]],
        });
      } else {
        count = await Permintaan.count({
          where: { name: { [Op.like]: `%${search}%` } },
        });

        totalPage = Math.ceil(count / limit);

        permintaan = await Permintaan.findAll({
          where: { name: { [Op.like]: `%${search}%` } },
          include: {
            model: User,
            attributes: ["nip", "username", "id", "role"],
            include: [{ model: Divisi, attributes: ["name", "desc"] }],
          },
          attributes: [
            "id",
            "name",
            "desc",
            "qty",
            "file",
            "url",
            "userId",
            "createdAt",
            "updatedAt",
          ],
          limit,
          offset,
          order: [["createdAt", "ASC"]],
        });
      }

      res.status(200).json({ limit, page, totalPage, count, permintaan });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getPermintaanById = async (req, res) => {
    let permintaan;
    try {
      if (req.role === "admin") {
        permintaan = await Permintaan.findByPk(req.params.id, {
          include: {
            model: User,
            attributes: ["nip", "username", "id", "role"],
          },
          attributes: [
            "id",
            "name",
            "desc",
            "qty",
            "file",
            "url",
            "userId",
            "createdAt",
            "updatedAt",
          ],
        });
      } else {
        permintaan = await Permintaan.findOne(
          { where: { id: req.params.id, userId: req.uid } },
          {
            include: {
              model: User,
              attributes: ["nip", "username", "id", "role"],
            },
            attributes: [
              "id",
              "name",
              "desc",
              "qty",
              "file",
              "url",
              "userId",
              "createdAt",
              "updatedAt",
            ],
          }
        );
      }

      if (!permintaan) {
        return res
          .status(404)
          .json({ msg: "Data permintaan tidak ditemukan!" });
      }
      res.status(200).json(permintaan);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  deletePermintaan = async (req, res) => {
    try {
      const permintaan = await Permintaan.findByPk(req.params.id);
      if (!permintaan) {
        return res
          .status(404)
          .json({ msg: "Data permintaan tidak ditemukan!" });
      }

      const supabaseDelete = await supabase.storage
        .from("product")
        .remove([`${permintaan.file}`]);

      if (supabaseDelete.error)
        return res.status(400).json({
          err: "ERROR: Gagal mengunggah dokumen!",
          stack: supabaseUpload.error.stack,
          msg: supabaseUpload.error.message,
        });

      await Permintaan.destroy({ where: { id: permintaan.id } });

      res.status(200).json({ msg: "Berhasil menghapus data permintaan!" });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };
}

export default PermintaanController;
