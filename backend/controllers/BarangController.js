import Barang from "../models/BarangModel.js";
import SatuanBrg from "../models/SatuanModel.js";
import MerkBrg from "../models/MerkModel.js";
import Kategori from "../models/KategoriBarang.js";
import Pemindahan from "../models/Pemindahan.js";
import BrgRusak from "../models/BarangRusakModel.js";
import Lokasi from "../models/LokasiModel.js";
import Penghapusan from "../models/PenghapusanModel.js";
import supabase from "../config/supabase/supabaseClient.js";
import { Op } from "sequelize";
import BarangMasuk from "../models/BarangMasuk.js";

class BarangController {
  // ADD BARANG
  createBarang = async (req, res) => {
    // variabel
    const {
      name,
      desc,
      qty,
      tgl_beli,
      harga,
      kondisi,
      riwayat_pemeliharaan,
      penyebab_rsk,
      stts_perbaikan,
      tipe,
      satuan,
      merk,
      kategori,
      umur_ekonomis,
    } = req.body;

    const dateFormat = tgl_beli.split("T")[0];

    // validasi
    if (
      !name ||
      !desc ||
      !qty ||
      !tgl_beli ||
      !harga ||
      !kondisi ||
      !riwayat_pemeliharaan ||
      !satuan ||
      !merk ||
      !kategori
    ) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }

    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "File belum dipilih!" });
    }

    const file = req.files.file;

    if (file.size > 2 * 1024 * 1024) {
      return res.status(400).json({ msg: "Ukuran file maksimal 2MB!" });
    }

    const ext = `.${file.name.split(".").pop()}`;

    const fileName = `file_${Date.now()}${ext}`;
    const fileType = [".jpg", ".jpeg", ".png"];

    if (!fileType.includes(ext.toLowerCase()))
      return res.status(400).json({ msg: "Format file tidak didukung!" });

    try {
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

      const url = supabase.storage.from("product").getPublicUrl(fileName)
        .data.publicUrl;

      await Barang.create({
        name,
        desc,
        qty,
        tgl_beli: dateFormat,
        harga,
        kondisi,
        riwayat_pemeliharaan,
        penyebab_rsk,
        stts_perbaikan,
        tipe,
        satuan,
        merk,
        kategori,
        umur_ekonomis,
        image: fileName,
        url,
      });

      res.status(201).json({ msg: "Berhasil menambah data barang." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error });
    }
  };

  getBarang = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    const offset = limit * page;
    let totalPage;
    try {
      const count = await Barang.count({
        where: {
          name: { [Op.like]: `%${search}%` },
        },
      });

      totalPage = Math.ceil(count / limit);
      const barang = await Barang.findAll({
        where: { name: { [Op.like]: `%${search}%` } },
        include: [
          { model: SatuanBrg, attributes: ["name", "desc"] },
          { model: MerkBrg, attributes: ["name", "desc"] },
          { model: Kategori, attributes: ["name", "desc"] },
          {
            model: Penghapusan,
            attributes: ["desc", "qty", "tgl_hapus", "file", "url"],
          },
          {
            model: Pemindahan,
            attributes: ["qty", "desc", "tgl_pindah"],
            include: [
              {
                model: Lokasi,
                as: "pindah_from",
                attributes: ["name", "desc"],
              },
              { model: Lokasi, as: "pindah_to", attributes: ["name", "desc"] },
            ],
          },
          { model: BrgRusak, attributes: ["id", "qty", "desc"] },
          { model: BarangMasuk },
        ],
        attributes: [
          "id",
          "name",
          "desc",
          "qty",
          "tgl_beli",
          "harga",
          "kondisi",
          "riwayat_pemeliharaan",
          "penyebab_rsk",
          "stts_perbaikan",
          "tipe",
          "umur_ekonomis",
          "image",
          "url",
          "createdAt",
        ],
        limit,

        offset,
        order: [["createdAt", "ASC"]],
      });
      res.status(200).json({ page, limit, totalPage, count, barang });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getBarangById = async (req, res) => {
    try {
      const barang = await Barang.findByPk(req.params.id, {
        include: [
          { model: SatuanBrg, attributes: ["name", "desc"] },
          { model: MerkBrg, attributes: ["name", "desc"] },
          { model: Kategori, attributes: ["name", "desc"] },
          {
            model: Penghapusan,
            attributes: ["desc", "qty", "tgl_hapus", "file", "url"],
          },
          {
            model: Pemindahan,
            attributes: ["qty", "desc", "tgl_pindah"],
            include: [
              {
                model: Lokasi,
                as: "pindah_from",
                attributes: ["name", "desc"],
              },
              { model: Lokasi, as: "pindah_to", attributes: ["name", "desc"] },
            ],
          },
          { model: BrgRusak, attributes: ["qty", "desc"] },
        ],
        attributes: [
          "id",
          "name",
          "desc",
          "qty",
          "tgl_beli",
          "harga",
          "kondisi",
          "riwayat_pemeliharaan",
          "penyebab_rsk",
          "stts_perbaikan",
          "tipe",
          "umur_ekonomis",
          "image",
          "url",
        ],
      });
      if (!barang) {
        return res.status(404).json({ msg: "Data barang tidak ditemukan!" });
      }

      res.status(200).json(barang);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getAllBarang = async (req, res) => {
    try {
      const barang = await Barang.findAll({
        attributes: ["id", "name", "desc", "qty"],
      });
      res.status(200).json(barang);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  updateBarang = async (req, res) => {
    const {
      name,
      desc,
      qty,
      tgl_beli,
      harga,
      kondisi,
      riwayat_pemeliharaan,
      penyebab_rsk,
      stts_perbaikan,
      tipe,
      satuan,
      merk,
      kategori,
      umur_ekonomis,
    } = req.body;

    try {
      const barang = await Barang.findByPk(req.params.id);
      if (!barang) {
        return res.status(404).json({ msg: "Data barang tidak ditemukan!" });
      }

      await Barang.update(
        {
          name,
          desc,
          qty,
          tgl_beli,
          harga,
          kondisi,
          riwayat_pemeliharaan,
          penyebab_rsk,
          stts_perbaikan,
          tipe,
          satuan,
          merk,
          kategori,
          umur_ekonomis,
        },
        { where: { id: barang.id } }
      );

      res.status(200).json({ msg: "Berhasil mengupdate barang." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  deleteBarang = async (req, res) => {
    try {
      const barang = await Barang.findByPk(req.params.id);
      if (!barang) {
        return res.status(404).json({ msg: "Data barang tidak ditemukan!" });
      }

      const removeImage = await supabase.storage
        .from("product")
        .remove([barang.image]);

      if (removeImage.error) {
        return res.status(400).json({
          msg: " Gagal menghapus data gambar!",
          err: removeImage.error.message,
          stack: removeImage.error.stack,
        });
      }

      await Barang.destroy({ where: { id: barang.id } });

      res.status(200).json({ msg: "Berhasil menghapus data barang." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };
}

export default BarangController;
