import express from "express";
import PengajuanController from "../controllers/PengajuanController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const pengajuanRoute = express.Router();
const pengajuan = new PengajuanController();

pengajuanRoute.get("/", verifyUser, pengajuan.getPengajuan);
pengajuanRoute.get("/all", verifyUser, pengajuan.getAllPengajuan);
pengajuanRoute.get("/:id", verifyUser, pengajuan.getPengajuanById);
pengajuanRoute.post("/create", verifyUser, pengajuan.createPengajuan);
pengajuanRoute.delete("/del/:id", verifyUser, pengajuan.deletePengajuan);

export default pengajuanRoute;
