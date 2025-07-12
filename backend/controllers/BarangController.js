import { Op } from "sequelize";
import supabase from "../config/supabase/supabaseClient.js";
import BarangMasuk from "../models/BarangMasuk.js";
import Barang from "../models/BarangModel.js";
import BrgRusak from "../models/BarangRusakModel.js";
import Distribusi from "../models/DistribusiBrgModel.js";
import Kategori from "../models/KategoriBarang.js";
import Lokasi from "../models/LokasiModel.js";
import MerkBrg from "../models/MerkModel.js";
import Pemindahan from "../models/Pemindahan.js";
import Penghapusan from "../models/PenghapusanModel.js";
import SatuanBrg from "../models/SatuanModel.js";
import User from "../models/UserModels.js";

class BarangController {
  bulanPerTahun = 12;
  // fungsi hitung masa ekonomis
  hitungSisaUmurBulan = (tglBeliStr, umurEkonomisBulan) => {
    const tglBeli = new Date(tglBeliStr);
    const hariIni = new Date();

    // Hitung total bulan yang telah berlalu
    const tahunSelisih = hariIni.getFullYear() - tglBeli.getFullYear();
    const bulanSelisih = hariIni.getMonth() - tglBeli.getMonth();

    const totalBulanBerlalu = tahunSelisih * 12 + bulanSelisih;

    // Hitung sisa umur dalam bulan
    const sisaBulan = Math.max(umurEkonomisBulan - totalBulanBerlalu, 0);

    return sisaBulan; // dalam bulan
  };

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
    } = req.body;

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
      const dataKategori = await Kategori.findByPk(kategori);

      const masaEkonomisKategori =
        dataKategori.masa_ekonomis * this.bulanPerTahun;

      const masaEkonomisBarang = parseFloat(
        (
          this.hitungSisaUmurBulan(tgl_beli, masaEkonomisKategori) /
          this.bulanPerTahun
        ).toFixed(1)
      );

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
        umur_ekonomis: masaEkonomisBarang,
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
          { model: Kategori, attributes: ["name", "desc", "masa_ekonomis"] },
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
          {
            model: Distribusi,
            include: [
              {
                model: Lokasi,
                as: "lokasi_ruang",
                attributes: ["name", "desc"],
              },
              { model: User, attributes: ["id", "nip", "username"] },
            ],
            attributes: ["id", "qty"],
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
          { model: Distribusi },
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
        attributes: ["id", "name", "desc", "tgl_beli", "umur_ekonomis", "qty"],
        include: { model: Kategori },
      });

      for (const item of barang) {
        const tglBeliBrg = item.tgl_beli;
        const masaEkonomisKategori =
          item.kategori_brg.masa_ekonomis * this.bulanPerTahun;
        console.log(masaEkonomisKategori);

        const masaEkonomisBrg = parseFloat(
          (
            this.hitungSisaUmurBulan(tglBeliBrg, masaEkonomisKategori) /
            this.bulanPerTahun
          ).toFixed(1)
        );

        await Barang.update(
          { umur_ekonomis: masaEkonomisBrg },
          { where: { id: item.id } }
        );
      }

      // Ambil ulang data setelah update selesai
      const barangSetelahUpdate = await Barang.findAll({
        attributes: ["id", "name", "desc", "tgl_beli", "umur_ekonomis", "qty"],
        include: { model: Kategori },
      });

      res.status(200).json(barangSetelahUpdate);
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
