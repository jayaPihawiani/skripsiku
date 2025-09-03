import { Op } from "sequelize";
import Barang from "../models/BarangModel.js";
import Kategori from "../models/KategoriBarang.js";
import Lokasi from "../models/LokasiModel.js";
import Pemindahan from "../models/Pemindahan.js";
import User from "../models/UserModels.js";
import BarangController from "./BarangController.js";
import BarangUnitModel from "../models/BarangUnitModel.js";

class PemindahanController extends BarangController {
  // ADD
  createPemindahan = async (req, res) => {
    const { barangUnitId, desc, from, to, tgl_pindah, userId } = req.body;

    if (!barangUnitId || !desc || !from || !to || !tgl_pindah || !userId) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }

    try {
      const brgUnit = await BarangUnitModel.findByPk(barangUnitId);
      if (!brgUnit) {
        return res.status(404).json({ msg: "Barang unit tidak ditemukan!" });
      }

      await Pemindahan.create({
        barangUnitId,
        desc,
        from,
        to,
        tgl_pindah,
        userId,
      });

      await BarangUnitModel.update(
        { lokasi_barang: to },
        { where: { id: barangUnitId } }
      );

      res.status(201).json({ msg: "Berhasil memindahkan unit barang." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getPemindahan = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    let totalPage;
    let count;
    let pindah;
    const offset = limit * page;

    try {
      if (req.role === "admin") {
        count = await Pemindahan.count({
          include: [
            {
              model: BarangUnitModel,
              include: [
                {
                  model: Barang,
                  where: { name: { [Op.like]: `%${search}%` } },
                },
              ],
            },
          ],
        });

        totalPage = Math.ceil(count / limit);

        pindah = await Pemindahan.findAll({
          include: [
            { model: Lokasi, as: "pindah_from", attributes: ["name", "desc"] },
            { model: Lokasi, as: "pindah_to", attributes: ["name", "desc"] },
            {
              model: BarangUnitModel,
              include: [
                {
                  model: Barang,

                  attributes: ["name", "desc", "kondisi", "kondisi"],
                  where: { name: { [Op.like]: `%${search}%` } },
                },
              ],
            },
            { model: User, attributes: ["id", "nip", "username", "role"] },
          ],
          attributes: ["id", "desc", "tgl_pindah", "createdAt"],
          limit,
          offset,
          order: [["createdAt", "ASC"]],
        });
      } else {
        count = await Pemindahan.count({
          include: [
            {
              required: true,
              model: BarangUnitModel,
              include: [
                {
                  required: true,
                  model: Barang,
                  where: { name: { [Op.like]: `%${search}%` } },
                },
              ],
              where: { status: "baik" },
            },
          ],
          where: { userId: req.uid },
        });

        totalPage = Math.ceil(count / limit);

        pindah = await Pemindahan.findAll({
          include: [
            { model: Lokasi, as: "pindah_from", attributes: ["name", "desc"] },
            { model: Lokasi, as: "pindah_to", attributes: ["name", "desc"] },
            {
              required: true,
              model: BarangUnitModel,
              include: [
                {
                  model: Barang,
                  attributes: ["name", "desc", "kondisi"],
                  where: { name: { [Op.like]: `%${search}%` } },
                },
              ],
              where: { status: "baik" },
            },
            {
              model: User,
              attributes: ["id", "nip", "username", "role"],
            },
          ],
          attributes: ["id", "desc", "tgl_pindah", "createdAt"],
          where: { userId: req.uid },
          limit,
          offset,
          order: [["createdAt", "ASC"]],
        });
      }
      res.status(200).json({ limit, page, totalPage, count, pindah });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getPemindahanById = async (req, res) => {
    try {
      const pindah = await Pemindahan.findByPk(req.params.id, {
        include: [
          { model: Lokasi, as: "pindah_from", attributes: ["name", "desc"] },
          { model: Lokasi, as: "pindah_to", attributes: ["name", "desc"] },
          {
            model: Barang,
            attributes: ["name", "desc", "qty"],
            as: "nama_barang",
          },
        ],
        attributes: ["id", "qty", "desc", "tgl_pindah"],
      });

      if (!pindah) {
        return res
          .status(404)
          .json({ msg: "Data pemindahan tidak ditemukan!" });
      }

      res.status(200).json(pindah);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getAllPemindahan = async (req, res) => {
    try {
      const pindah = await Pemindahan.findAll({
        include: [
          { model: Lokasi, as: "pindah_from", attributes: ["name", "desc"] },
          { model: Lokasi, as: "pindah_to", attributes: ["name", "desc"] },
          {
            model: Barang,
            attributes: ["name", "desc", "qty"],
            as: "nama_barang",
          },
        ],
        attributes: ["id", "qty", "desc", "tgl_pindah"],
      });

      res.status(200).json(pindah);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  updatePenyusutan = async (req, res) => {
    try {
      const brgPindah = await Pemindahan.findAll({
        include: {
          model: Barang,
          as: "nama_barang",
          include: [{ model: Kategori }],
        },
      });

      for (const item of brgPindah) {
        // Hitung selisih bulan

        const masaEkonomisKategori = item.nama_barang.umur_ekonomis;

        // Total penyusutan yang sudah terjadi ( max harga beli)

        // Nilai buku tidak boleh negatif
        const nilaiBuku = item.nama_barang.nilai_buku;

        // Update data barang
        await Pemindahan.update(
          {
            nilai_buku: nilaiBuku,
            umur_ekonomis: masaEkonomisKategori,
          },
          { where: { id: item.id } }
        );
      }

      res.status(200).json({ msg: "Berhasil update penyusutan semua barang." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  updatePemindahan = async (req, res) => {
    const { barangId, qty, desc, from, to, tgl_pindah, kondisi } = req.body;
    try {
      const pindah = await Pemindahan.findByPk(req.params.id, {
        include: {
          model: Barang,
          as: "nama_barang",
        },
      });
      if (!pindah) {
        return res
          .status(404)
          .json({ msg: "Data pemindahan tidak ditemukan!" });
      }
      const qtyBarang = pindah.nama_barang.qty;
      const selisih = qty - pindah.qty;
      if (selisih > qtyBarang) {
        return res.status(400).json({ msg: "Input jumlah tidak valid!" });
      }
      await Pemindahan.update(
        {
          qty,
          barangId,
          desc,
          from,
          to,
          tgl_pindah,
          kondisi,
        },
        { where: { id: pindah.id } }
      );
      if (qty) {
        await Barang.update(
          { qty: qtyBarang - selisih },
          { where: { id: pindah.nama_barang.id } }
        );
      }
      res.status(200).json({ msg: "Berhasil update data pindah." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  deletePemindahan = async (req, res) => {
    try {
      const pindah = await Pemindahan.findByPk(req.params.id);

      if (!pindah) {
        return res
          .status(404)
          .json({ msg: "Data pemindahan tidak ditemukan!" });
      }

      await Pemindahan.destroy({ where: { id: pindah.id } });
      res.status(200).json({ msg: "Berhasil menghapus data pindah." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };
}

export default PemindahanController;
