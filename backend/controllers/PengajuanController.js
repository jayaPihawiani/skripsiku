import { Op } from "sequelize";
import supabase from "../config/supabase/supabaseClient.js";
import Lokasi from "../models/LokasiModel.js";
import Pengajuan from "../models/Pengajuan.js";
import User from "../models/UserModels.js";

class PengajuanController {
  createPengajuan = async (req, res) => {
    const { name, desc, qty } = req.body;

    if (!name || !desc || !qty) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }

    if (!req.files || !req.files.file) {
      await Pengajuan.create({
        name,
        desc,
        qty,
        userId: req.uid,
      });
      res.status(201).json({ msg: "Berhasil membuat data pengajuan!" });
    } else {
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

        await Pengajuan.create({
          name,
          desc,
          qty,
          file: fileName,
          url,
          userId: req.uid,
        });

        res.status(201).json({ msg: "Berhasil membuat data pengajuan!" });
      } catch (error) {
        res.status(500).json({ msg: "ERROR: " + error.message });
      }
    }
  };

  getPengajuan = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    const offset = limit * page;
    let totalPage;
    let count;
    let pengajuan;
    try {
      if (req.role === "user") {
        count = await Pengajuan.count({
          where: { userId: req.uid, name: { [Op.like]: `%${search}%` } },
        });

        totalPage = Math.ceil(count / limit);

        pengajuan = await Pengajuan.findAll({
          include: {
            model: User,
            attributes: ["nip", "username", "id", "role"],
            include: [
              { model: Lokasi, as: "loc_user", attributes: ["name", "desc"] },
            ],
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
        count = await Pengajuan.count({
          where: { name: { [Op.like]: `%${search}%` } },
        });

        totalPage = Math.ceil(count / limit);

        pengajuan = await Pengajuan.findAll({
          where: { name: { [Op.like]: `%${search}%` } },
          include: {
            model: User,
            attributes: ["nip", "username", "id", "role"],
            include: [
              { model: Lokasi, as: "loc_user", attributes: ["name", "desc"] },
            ],
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

      res.status(200).json({ limit, page, totalPage, count, pengajuan });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getPengajuanById = async (req, res) => {
    let pengajuan;
    try {
      if (req.role === "admin") {
        pengajuan = await Pengajuan.findByPk(req.params.id, {
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
        pengajuan = await Pengajuan.findOne(
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

      if (!pengajuan) {
        return res.status(404).json({ msg: "Data pengajuan tidak ditemukan!" });
      }

      res.status(200).json(pengajuan);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getAllPengajuan = async (req, res) => {
    try {
      let pengajuan;
      if (req.role === "user") {
        pengajuan = await Pengajuan.findAll({
          include: {
            model: User,
            attributes: ["nip", "username", "id", "role"],
            include: [
              { model: Lokasi, as: "loc_user", attributes: ["name", "desc"] },
            ],
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
          where: { userId: req.uid },
        });
      } else {
        pengajuan = await Pengajuan.findAll({
          include: {
            model: User,
            attributes: ["nip", "username", "id", "role"],
            include: [
              { model: Lokasi, as: "loc_user", attributes: ["name", "desc"] },
            ],
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
      }

      res.status(200).json(pengajuan);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  deletePengajuan = async (req, res) => {
    try {
      const pengajuan = await Pengajuan.findByPk(req.params.id);
      if (!pengajuan) {
        return res.status(404).json({ msg: "Data pengajuan tidak ditemukan!" });
      }

      const supabaseDelete = await supabase.storage
        .from("product")
        .remove([`${Pengajuan.file}`]);

      if (supabaseDelete.error)
        return res.status(400).json({
          err: "ERROR: Gagal mengunggah dokumen!",
          stack: supabaseUpload.error.stack,
          msg: supabaseUpload.error.message,
        });

      await Pengajuan.destroy({ where: { id: pengajuan.id } });

      res.status(200).json({ msg: "Berhasil menghapus data Pengajuan!" });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };
}

export default PengajuanController;
