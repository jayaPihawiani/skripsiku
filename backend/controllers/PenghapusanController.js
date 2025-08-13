import { Op } from "sequelize";
import supabase from "../config/supabase/supabaseClient.js";
import Barang from "../models/BarangModel.js";
import Kategori from "../models/KategoriBarang.js";
import MerkBrg from "../models/MerkModel.js";
import Penghapusan from "../models/PenghapusanModel.js";
import SatuanBrg from "../models/SatuanModel.js";

class PenghapusanController {
  createPenghapusan = async (req, res) => {
    const { barangId, desc, qty, tgl_hapus } = req.body;
    let url = "";
    let fileName = "";

    if (!barangId || !desc || !qty || !tgl_hapus) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }

    try {
      const barang = await Barang.findByPk(barangId);

      if (qty > barang.qty) {
        return res.status(400).json({ msg: "Input jumlah tidak valid!" });
      }

      if (!req.files || !req.files.file) {
        await Barang.update(
          { qty: barang.qty - parseInt(qty) },
          { where: { id: barangId } }
        );

        await Penghapusan.create({
          barangId,
          desc,
          qty,
          tgl_hapus,
          file: fileName,
          url,
          sisa_stok: barang.qty - parseInt(qty),
        });

        return res
          .status(201)
          .json({ msg: "Berhasil menambah data penghapusan." });
      }

      const file = req.files.file;
      const ext = `.${file.name.split(".").pop()}`;
      fileName = `file_${Date.now()}${ext}`;
      const fileType = [".xlsx", ".docx", ".pdf"];

      if (!fileType.includes(ext.toLowerCase())) {
        return res.status(400).json({ msg: "Format file tidak didukung!" });
      }

      const supabaseUpload = await supabase.storage
        .from("product")
        .upload(fileName, file.data, {
          upsert: true,
          contentType: file.mimetype,
        });

      if (supabaseUpload.error) {
        return res.status(500).json({
          err: "ERROR: Gagal mengunggah dokumen!",
          stack: supabaseUpload.error.stack,
          msg: supabaseUpload.error.message,
        });
      }

      url = supabase.storage.from("product").getPublicUrl(fileName)
        .data.publicUrl;

      await Penghapusan.create({
        barangId,
        desc,
        qty,
        tgl_hapus,
        file: fileName,
        url,
        sisa_stok: barang.qty - parseInt(qty),
      });

      await Barang.update(
        { qty: barang.qty - parseInt(qty) },
        { where: { id: barangId } }
      );

      res.status(201).json({ msg: "Berhasil menambah data penghapusan." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getPenghapusan = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    const offset = limit * page;
    let totalPage;
    try {
      const count = await Penghapusan.count({
        include: {
          model: Barang,
          where: {
            name: { [Op.like]: `%${search}%` },
          },
        },
      });

      totalPage = Math.ceil(count / limit);

      const penghapusan = await Penghapusan.findAll({
        include: {
          model: Barang,
          where: {
            name: { [Op.like]: `%${search}%` },
          },
          attributes: [
            "name",
            "desc",
            "qty",
            "tgl_beli",
            "kondisi",
            "riwayat_pemeliharaan",
            "createdAt",
          ],
          include: [
            { model: SatuanBrg, attributes: ["name", "desc"] },
            { model: MerkBrg, attributes: ["name", "desc"] },
            { model: Kategori, attributes: ["name", "desc"] },
          ],
        },
        limit,
        offset,
        order: [["createdAt", "ASC"]],
      });
      res.status(200).json({ page, limit, totalPage, count, penghapusan });
    } catch (error) {
      res.status(400).json({ msg: "ERROR: " + error.message });
    }
  };

  getPenghapusanById = async (req, res) => {
    try {
      const penghapusan = await Penghapusan.findByPk(req.params.id, {
        include: {
          model: Barang,
          attributes: [
            "name",
            "desc",
            "qty",
            "tgl_beli",
            "kondisi",
            "riwayat_pemeliharaan",
          ],
          include: [
            { model: SatuanBrg, attributes: ["name", "desc"] },
            { model: MerkBrg, attributes: ["name", "desc"] },
            { model: Kategori, attributes: ["name", "desc"] },
          ],
        },
      });

      if (!penghapusan) {
        return res
          .status(200)
          .json({ msg: "Data penghapusan tidak ditemukan!" });
      }
      res.status(200).json(penghapusan);
    } catch (error) {
      res.status(400).json({ msg: "ERROR: " + error.message });
    }
  };

  getAllPenghapusan = async (req, res) => {
    try {
      const penghapusan = await Penghapusan.findAll({
        include: {
          model: Barang,
          attributes: [
            "name",
            "desc",
            "qty",
            "tgl_beli",
            "kondisi",
            "riwayat_pemeliharaan",
          ],
          include: [
            { model: SatuanBrg, attributes: ["name", "desc"] },
            { model: MerkBrg, attributes: ["name", "desc"] },
            { model: Kategori, attributes: ["name", "desc"] },
          ],
        },
      });

      res.status(200).json(penghapusan);
    } catch (error) {
      res.status(400).json({ msg: "ERROR: " + error.message });
    }
  };

  deletePenghapusan = async (req, res) => {
    try {
      const penghapusan = await Penghapusan.findByPk(req.params.id);
      if (!penghapusan) {
        return res
          .status(200)
          .json({ msg: "Data penghapusan tidak ditemukan!" });
      }

      await Penghapusan.destroy({ where: { id: penghapusan.id } });

      res.status(200).json({ msg: "Berhasil menghapus data penghapusan." });
    } catch (error) {
      res.status(400).json({ msg: "ERROR: " + error.message });
    }
  };

  // createPenghapusan = async(req, res)=>{}
}

export default PenghapusanController;
