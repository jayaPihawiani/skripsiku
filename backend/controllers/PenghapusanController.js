import { Op, where } from "sequelize";
import supabase from "../config/supabase/supabaseClient.js";
import Barang from "../models/BarangModel.js";
import Kategori from "../models/KategoriBarang.js";
import MerkBrg from "../models/MerkModel.js";
import Penghapusan from "../models/PenghapusanModel.js";
import BarangUnitModel from "../models/BarangUnitModel.js";
import Lokasi from "../models/LokasiModel.js";

class PenghapusanController {
  createPenghapusan = async (req, res) => {
    const { barangUnitId, desc, tgl_hapus } = req.body;
    let url = "";
    let fileName = "";

    if (!barangUnitId || !desc || !tgl_hapus) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }

    try {
      const brgUnit = await BarangUnitModel.findByPk(barangUnitId);

      if (!brgUnit) {
        return res.status(404).json({ msg: "Barang unit tidak ditemukan!" });
      }

      const penghapusan = await Penghapusan.findOne({
        where: { barangUnitId },
      });

      if (penghapusan) {
        return res
          .status(400)
          .json({ msg: "Barang sudah masuk daftar penghapusan" });
      }

      if (!req.files || !req.files.file) {
        await Penghapusan.create({
          barangUnitId,
          desc,
          tgl_hapus,
          file: fileName,
          url,
        });
      } else {
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
          barangUnitId,
          desc,
          tgl_hapus,
          file: fileName,
          url,
        });
      }
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
      const count = await BarangUnitModel.count({
        where: {
          status_penghapusan: { [Op.or]: ["diusul", "disetujui", "ditolak"] },
        },
        include: {
          model: Barang,
          where: { name: { [Op.like]: `%${search}%` } },
        },
      });

      totalPage = Math.ceil(count / limit);

      const result = await BarangUnitModel.findAll({
        where: {
          status_penghapusan: { [Op.or]: ["diusul", "disetujui", "ditolak"] },
        },
        include: [
          {
            model: Lokasi,
            as: "loc_barang",
            attributes: ["name"],
          },
          {
            model: Kategori,
            attributes: ["name"],
          },
          {
            model: Barang,
            where: { name: { [Op.like]: `%${search}%` } },
          },
          {
            model: Penghapusan,
            // where: { name: { [Op.like]: `%${search}%` } },
          },
        ],
        limit,
        offset,
        order: [["createdAt", "ASC"]],
      });

      res.status(200).json({ page, limit, totalPage, count, result });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
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

  updateStatusPersetujuan = async (req, res) => {
    const { status } = req.body;
    try {
      const penghapusan = await Penghapusan.findByPk(req.params.id, {
        include: { model: BarangUnitModel, include: [{ model: Barang }] },
      });

      const idBarang = penghapusan.barang_unit.barang.id;

      if (!penghapusan) {
        return res
          .status(404)
          .json({ msg: "Data penghapusan tidak ditemukan!" });
      }

      await Penghapusan.update({ status }, { where: { id: penghapusan.id } });

      await BarangUnitModel.update(
        { status_penghapusan: status },
        { where: { id: penghapusan.barang_unit.id } }
      );

      await Barang.update(
        {
          qty: await BarangUnitModel.count({
            where: {
              status_penghapusan: { [Op.or]: ["diusul", "null", "ditolak"] },
            },
          }),
        },
        { where: { id: idBarang } }
      );

      res.status(200).json({ msg: "Berhasil ubah status penghapusan." });
    } catch (error) {
      res
        .status(500)
        .json({ msg: "ERROR: " + error.message, stack: error.stack });
    }
  };

  deletePenghapusan = async (req, res) => {
    try {
      const penghapusan = await Penghapusan.findByPk(req.params.id, {
        include: { model: BarangUnitModel, include: [{ model: Barang }] },
      });

      if (!penghapusan) {
        return res
          .status(200)
          .json({ msg: "Data penghapusan tidak ditemukan!" });
      }

      const idUnitBrg = penghapusan.barang_unit.id;

      await BarangUnitModel.destroy({ where: { id: idUnitBrg } });

      res.status(200).json({ msg: "Berhasil menghapus data penghapusan." });
    } catch (error) {
      res.status(400).json({ msg: "ERROR: " + error.message });
    }
  };
}

export default PenghapusanController;
