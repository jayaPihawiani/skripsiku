import express from "express";
import BarangController from "../controllers/BarangController.js";
import { verifyUser, isAdmin } from "../middleware/authMiddleware.js";

const barangRoute = express.Router();
const barang = new BarangController();

barangRoute.post("/create", verifyUser, isAdmin, barang.createBarang);
barangRoute.get("/", verifyUser, barang.getBarang);
barangRoute.get("/c/barang_unit", verifyUser, barang.getDetailBarang);
barangRoute.get("/all", verifyUser, barang.getAllBarang);
barangRoute.get("/:id", verifyUser, barang.getBarangById);
barangRoute.get("/c/loc", verifyUser, barang.getDetailBarangByLokasi);
barangRoute.patch("/update", verifyUser, isAdmin, barang.updatePenyusutan);
barangRoute.patch("/update/:id", verifyUser, isAdmin, barang.updateBarang);
barangRoute.delete("/del/:id", verifyUser, isAdmin, barang.deleteBarang);

export default barangRoute;
