import { Op } from "sequelize";
import supabase from "../config/supabase/supabaseClient.js";
import BarangMasuk from "../models/BarangMasuk.js";
import Barang from "../models/BarangModel.js";
import BrgRusak from "../models/BarangRusakModel.js";
import Kategori from "../models/KategoriBarang.js";
import Lokasi from "../models/LokasiModel.js";
import MerkBrg from "../models/MerkModel.js";
import Pemindahan from "../models/Pemindahan.js";
import Penghapusan from "../models/PenghapusanModel.js";
import SatuanBrg from "../models/SatuanModel.js";

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

  createBarang = async (req, res) => {
    const {
      name,
      desc,
      qty,
      tgl_beli,
      harga,
      kondisi,
      riwayat_pemeliharaan,
      satuan,
      merk,
      kategori,
      lokasi_barang,
    } = req.body;

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
      if (!dataKategori) {
        return res.status(404).json({ msg: "Kategori tidak ditemukan!" });
      }

      const masaEkonomisKategori =
        dataKategori.masa_ekonomis * this.bulanPerTahun;

      const masaEkonomisBarang = parseFloat(
        (
          this.hitungSisaUmurBulan(tgl_beli, masaEkonomisKategori) /
          this.bulanPerTahun
        ).toFixed(1)
      );

      const biayaPenyusutan = parseFloat(
        (harga / masaEkonomisKategori).toFixed(2)
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
        satuan,
        merk,
        kategori,
        umur_ekonomis: masaEkonomisBarang,
        biaya_penyusutan: biayaPenyusutan,
        penyusutan_berjalan: 0, // default
        nilai_buku: harga, // default = harga beli
        image: fileName,
        url,
        lokasi_barang,
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
          { model: Lokasi, attributes: ["name", "desc"] },
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
          "biaya_penyusutan",
          "penyusutan_berjalan",
          "nilai_buku",
          "umur_ekonomis",
          "image",
          "url",
          "update_masa_ekonomis",
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
          { model: Lokasi, attributes: ["name", "desc"] },
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
          "umur_ekonomis",
          "image",
          "url",
          "update_masa_ekonomis",
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
          "biaya_penyusutan",
          "penyusutan_berjalan",
          "nilai_buku",
          "umur_ekonomis",
          "image",
          "url",
          "createdAt",
        ],
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

  updatePenyusutan = async (req, res) => {
    try {
      const barangList = await Barang.findAll({
        include: { model: Kategori, as: "kategori_brg" },
      });

      for (const item of barangList) {
        const tglBeli = new Date(item.tgl_beli);
        const now = new Date();

        // Hitung selisih bulan
        const selisihBulan =
          (now.getFullYear() - tglBeli.getFullYear()) * 12 +
          (now.getMonth() - tglBeli.getMonth());

        const masaEkonomisKategori =
          item.kategori_brg.masa_ekonomis * this.bulanPerTahun;
        const penyusutanPerBulan = item.biaya_penyusutan;

        // Total penyusutan yang sudah terjadi ( max harga beli)
        const totalPenyusutan = Math.min(
          selisihBulan * penyusutanPerBulan,
          item.harga
        );

        // Nilai buku tidak boleh negatif
        const nilaiBuku = Math.max(0, item.harga - totalPenyusutan);

        // Update data barang
        await Barang.update(
          {
            penyusutan_berjalan: totalPenyusutan,
            nilai_buku: nilaiBuku,
            umur_ekonomis: parseFloat(
              (
                this.hitungSisaUmurBulan(tglBeli, masaEkonomisKategori) /
                this.bulanPerTahun
              ).toFixed(1)
            ),
          },
          { where: { id: item.id } }
        );
      }

      res.status(200).json({ msg: "Berhasil update penyusutan semua barang." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  updatePenyusutanByAdmin = async (req, res) => {
    const { masa_ekonomis_baru, nilai_buku_manual } = req.body;

    if (!masa_ekonomis_baru || isNaN(masa_ekonomis_baru)) {
      return res.status(400).json({ msg: "Masa ekonomis baru tidak valid!" });
    }

    try {
      const barang = await Barang.findByPk(req.params.id);

      if (!barang) {
        return res.status(404).json({ msg: "Barang tidak ditemukan!" });
      }

      const tglBeli = new Date(barang.tgl_beli);
      const sekarang = new Date();

      const selisihBulan =
        (sekarang.getFullYear() - tglBeli.getFullYear()) * 12 +
        (sekarang.getMonth() - tglBeli.getMonth());

      const totalBulanEkonomis = masa_ekonomis_baru * this.bulanPerTahun;
      const biayaPenyusutanBaru = parseFloat(
        (barang.harga / totalBulanEkonomis).toFixed(2)
      );

      const totalPenyusutan = Math.min(
        selisihBulan * biayaPenyusutanBaru,
        barang.harga
      );

      // Logika nilai buku: pakai manual jika valid, jika tidak hitung otomatis
      let nilaiBuku = Math.max(0, barang.harga - totalPenyusutan);

      if (
        nilai_buku_manual !== undefined &&
        !isNaN(nilai_buku_manual) &&
        Number(nilai_buku_manual) >= 0 &&
        Number(nilai_buku_manual) <= barang.harga
      ) {
        nilaiBuku = Number(nilai_buku_manual);
      }

      await Barang.update(
        {
          umur_ekonomis: masa_ekonomis_baru,
          biaya_penyusutan: biayaPenyusutanBaru,
          penyusutan_berjalan: totalPenyusutan,
          nilai_buku: nilaiBuku,
          update_masa_ekonomis: true,
        },
        { where: { id: barang.id } }
      );

      res.status(200).json({
        msg: "Masa ekonomis dan nilai buku berhasil diperbarui.",
      });
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
