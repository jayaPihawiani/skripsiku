import express from "express";
import BarangMasukController from "../controllers/BarangMasukController.js";
import { isAdmin, verifyUser } from "../middleware/authMiddleware.js";

const brgMasukRoute = express.Router();
const brgMasuk = new BarangMasukController();

brgMasukRoute.post("/create", verifyUser, isAdmin, brgMasuk.createBarangMasuk);
brgMasukRoute.get("/", verifyUser, brgMasuk.getBarangMasuk);
brgMasukRoute.delete(
  "/del/:id",
  verifyUser,
  isAdmin,
  brgMasuk.deleteBarangMasuk
);
brgMasukRoute.patch(
  "/update/:id",
  verifyUser,
  isAdmin,
  brgMasuk.updateBarangMasuk
);

export default brgMasukRoute;
