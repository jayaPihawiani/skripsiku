import { Op } from "sequelize";
import supabase from "../config/supabase/supabaseClient.js";
import Barang from "../models/BarangModel.js";
import BarangUnitModel from "../models/BarangUnitModel.js";
import Kategori from "../models/KategoriBarang.js";
import Lokasi from "../models/LokasiModel.js";
import MerkBrg from "../models/MerkModel.js";
import Penghapusan from "../models/PenghapusanModel.js";

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
      merk,
      kategori,
      lokasi_bkarang,
    } = req.body;

    if (
      !name ||
      !desc ||
      !qty ||
      !tgl_beli ||
      !harga ||
      !kondisi ||
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

      const newBarang = await Barang.create({
        name,
        desc,
        qty,
        tgl_beli,
        harga,
        kondisi,
        merk,
        kategori,
        umur_ekonomis: masaEkonomisBarang,
        biaya_penyusutan: biayaPenyusutan,
        penyusutan_berjalan: 0,
        nilai_buku: harga * qty,
        image: fileName,
        url,
        lokasi_barang,
      });

      // 👇 Hanya untuk barang yang baru dibuat
      for (let i = 0; i < newBarang.qty; i++) {
        await BarangUnitModel.create({
          barangId: newBarang.id,
          kode_unit: `${newBarang.name}-${i + 1}`,
          desc: newBarang.desc,
          tgl_beli: newBarang.tgl_beli,
          harga: newBarang.harga,
          kategori: newBarang.kategori,
          kondisi: newBarang.kondisi,
          umur_ekonomis: newBarang.umur_ekonomis,
          biaya_penyusutan: newBarang.biaya_penyusutan,
          penyusutan_berjalan: newBarang.penyusutan_berjalan,
          nilai_buku: newBarang.nilai_buku / newBarang.qty,
          lokasi_barang: newBarang.lokasi_barang,
          lokasi_asal: newBarang.lokasi_barang,
        });
      }

      res.status(201).json({ msg: "Berhasil menambah data barang." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error });
    }
  };

  getDetailBarang = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    const offset = limit * page;
    let totalPage;
    try {
      const count = await BarangUnitModel.count({
        include: {
          model: Barang,
          where: {
            name: { [Op.like]: `%${search}%` },
          },
        },
      });

      totalPage = Math.ceil(count / limit);

      const result = await BarangUnitModel.findAll({
        include: [
          { model: Lokasi, as: "loc_asal" },
          { model: Lokasi, as: "loc_barang" },
          {
            model: Kategori,
            attributes: ["name", "desc", "masa_ekonomis"],
          },
          {
            model: Barang,
            where: {
              name: { [Op.like]: `%${search}%` },
            },
            include: [{ model: MerkBrg, attributes: ["name", "desc"] }],
            attributes: [
              "id",
              "name",
              "desc",
              "qty",
              "tgl_beli",
              "harga",
              "kondisi",
              "image",
              "url",
            ],
          },
        ],

        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({ page, limit, totalPage, count, result });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error });
    }
  };

  getDetailBarangByLokasi = async (req, res) => {
    const search = req.query.search || "";
    try {
      const barangUnit = await BarangUnitModel.findAll({
        where: { lokasi_barang: { [Op.like]: `%${search}%` } },
        include: { model: Barang },
        order: [["createdAt", "ASC"]],
      });

      res.status(200).json(barangUnit);
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
          { model: MerkBrg, attributes: ["name", "desc"] },
          { model: Kategori, attributes: ["name", "desc", "masa_ekonomis"] },
          { model: Lokasi, attributes: ["name", "desc"] },
          {
            model: Penghapusan,
            attributes: ["desc", "qty", "tgl_hapus", "file", "url"],
          },
        ],
        attributes: [
          "id",
          "name",
          "desc",
          "qty",
          "tgl_beli",
          "harga",
          "kondisi",
          "biaya_penyusutan",
          "penyusutan_berjalan",
          "nilai_buku",
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
          { model: MerkBrg, attributes: ["name", "desc"] },
          { model: Kategori, attributes: ["name", "desc"] },
          { model: Lokasi, attributes: ["name", "desc"] },
          {
            model: Penghapusan,
            attributes: ["desc", "qty", "tgl_hapus", "file", "url"],
          },
        ],
        attributes: [
          "id",
          "name",
          "desc",
          "qty",
          "tgl_beli",
          "harga",
          "kondisi",
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
        include: [
          { model: MerkBrg, attributes: ["name", "desc"] },
          { model: Kategori, attributes: ["name", "desc", "masa_ekonomis"] },
          {
            model: Penghapusan,
            attributes: ["desc", "qty", "tgl_hapus", "file", "url"],
          },
        ],
        attributes: [
          "id",
          "name",
          "desc",
          "qty",
          "tgl_beli",
          "harga",
          "kondisi",
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

  // updatePenyusutan = async (req, res) => {
  //   try {
  //     // Ambil semua unit barang, include kategori untuk ambil masa ekonomis
  //     const unitList = await BarangUnitModel.findAll({
  //       include: [
  //         {
  //           model: Kategori,
  //           as: "kategori_brg",
  //           attributes: ["masa_ekonomis"],
  //         },
  //       ],
  //     });

  //     const bulanPerTahun = 12;

  //     for (const unit of unitList) {
  //       const tglBeli = new Date(unit.tgl_beli);
  //       const now = new Date();

  //       // Hitung selisih bulan dari pembelian sampai sekarang
  //       const selisihBulan =
  //         (now.getFullYear() - tglBeli.getFullYear()) * 12 +
  //         (now.getMonth() - tglBeli.getMonth());

  //       // Ambil masa ekonomis (tahun → bulan)
  //       const masaEkonomisBulan =
  //         unit.kategori_brg.masa_ekonomis * bulanPerTahun;

  //       // Penyusutan per bulan
  //       const penyusutanPerBulan = unit.harga / masaEkonomisBulan;

  //       // Total penyusutan (tidak boleh lebih dari harga)
  //       const totalPenyusutan = Math.min(
  //         selisihBulan * penyusutanPerBulan,
  //         unit.harga
  //       );

  //       // Nilai buku minimal 0
  //       const nilaiBuku = Math.max(0, unit.harga - totalPenyusutan);

  //       // Hitung umur ekonomis tersisa (dalam tahun, 1 desimal)
  //       const umurEkonomisTersisa = parseFloat(
  //         (
  //           Math.max(masaEkonomisBulan - selisihBulan, 0) / bulanPerTahun
  //         ).toFixed(1)
  //       );

  //       // Update data unit
  //       await BarangUnitModel.update(
  //         {
  //           penyusutan_berjalan: totalPenyusutan,
  //           nilai_buku: nilaiBuku,
  //           umur_ekonomis: umurEkonomisTersisa,
  //         },
  //         { where: { id: unit.id } }
  //       );
  //     }

  //     res.status(200).json({
  //       msg: "Berhasil update penyusutan semua unit barang.",
  //     });
  //   } catch (error) {
  //     res.status(500).json({ msg: "ERROR: " + error.message });
  //   }
  // };

  updatePenyusutan = async (req, res) => {
    try {
      const unitList = await BarangUnitModel.findAll({
        include: [
          {
            model: Kategori,
            as: "kategori_brg",
            attributes: ["masa_ekonomis"],
          },
        ],
      });

      const bulanPerTahun = 12;
      const now = new Date();

      for (const unit of unitList) {
        // Jika status perbaikan / status rusak permanen → langsung nol
        if (
          unit.status_perbaikan === "SELESAI DIPERBAIKI TIDAK BISA DIGUNAKAN" ||
          unit.status_perbaikan === "TIDAK BISA DIPERBAIKI"
        ) {
          await unit.update({
            penyusutan_berjalan: unit.harga,
            nilai_buku: 0,
            umur_ekonomis: 0,
          });
          continue; // skip hitung normal
        }

        // Hitung selisih bulan sejak pembelian
        const tglBeli = new Date(unit.tgl_beli);
        const selisihBulan =
          (now.getFullYear() - tglBeli.getFullYear()) * 12 +
          (now.getMonth() - tglBeli.getMonth());

        const masaEkonomisBulan =
          unit.kategori_brg.masa_ekonomis * bulanPerTahun;

        const penyusutanPerBulan = unit.harga / masaEkonomisBulan;

        const totalPenyusutan = Math.min(
          selisihBulan * penyusutanPerBulan,
          unit.harga
        );

        const nilaiBuku = Math.max(0, unit.harga - totalPenyusutan);

        const umurEkonomisTersisa = parseFloat(
          (
            Math.max(masaEkonomisBulan - selisihBulan, 0) / bulanPerTahun
          ).toFixed(1)
        );

        await unit.update({
          penyusutan_berjalan: totalPenyusutan,
          nilai_buku: nilaiBuku,
          umur_ekonomis: umurEkonomisTersisa,
        });
      }

      res.status(200).json({
        msg: "Berhasil update penyusutan semua unit barang (dengan mempertahankan kerusakan).",
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
