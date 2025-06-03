import Pemindahan from "../models/Pemindahan.js";
import Lokasi from "../models/LokasiModel.js";
import Barang from "../models/BarangModel.js";
import { where } from "sequelize";

class PemindahanController {
  // ADD
  createPemindahan = async (req, res) => {
    const { barangId, qty, desc, from, to, tgl_pindah } = req.body;

    if (!barangId || !qty || !desc || !from || !to || !tgl_pindah) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }

    try {
      const barang = await Barang.findByPk(barangId);
      if (qty > barang.qty) {
        return res.status(400).json({ msg: "Input jumlah tidak valid!" });
      }

      await Pemindahan.create({ barangId, qty, desc, from, to, tgl_pindah });
      await Barang.update(
        { qty: barang.qty - qty },
        { where: { id: barang.id } }
      );

      res.status(201).json({ msg: "Berhasil menambah data pemindahan." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getPemindahan = async (req, res) => {
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

  updatePemindahan = async (req, res) => {
    const { barangId, qty, desc, from, to, tgl_pindah } = req.body;
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
        { qty, barangId, desc, from, to, tgl_pindah },
        { where: { id: pindah.id } }
      );

      await Barang.update(
        { qty: qtyBarang - selisih },
        { where: { id: pindah.nama_barang.id } }
      );

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
