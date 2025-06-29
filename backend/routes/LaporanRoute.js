import express from "express";
import {
  LaporanBarang,
  LaporanKerusakan,
  LaporanPenghapusan,
} from "../controllers/LaporanController.js";

const laporanRouter = express.Router();
const laporanBarang = new LaporanBarang();
const laporanKerusakan = new LaporanKerusakan();
const laporanPenghapusan = new LaporanPenghapusan();

laporanRouter.get("/barang", laporanBarang.printLaporan);
laporanRouter.get("/rusak", laporanKerusakan.printLaporan);
laporanRouter.get("/hapus", laporanPenghapusan.printLaporan);

export default laporanRouter;
