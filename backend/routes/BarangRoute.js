import express from "express";
import BarangController from "../controllers/BarangController.js";
import { verifyUser, isAdmin } from "../middleware/authMiddleware.js";

const barangRoute = express.Router();
const barang = new BarangController();

barangRoute.post("/create", verifyUser, isAdmin, barang.createBarang);
barangRoute.get("/", verifyUser, barang.getBarang);
barangRoute.get("/all", verifyUser, barang.getAllBarang);
barangRoute.get("/:id", verifyUser, barang.getBarangById);
barangRoute.delete("/del/:id", verifyUser, isAdmin, barang.deleteBarang);
barangRoute.patch("/update/:id", verifyUser, isAdmin, barang.updateBarang);

export default barangRoute;
