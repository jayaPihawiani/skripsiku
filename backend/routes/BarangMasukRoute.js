import express from "express";
import BarangMasukController from "../controllers/BarangMasukController.js";
import { isAdmin, verifyUser } from "../middleware/authMiddleware.js";

const brgMasukRoute = express.Router();
const brgMasuk = new BarangMasukController();

brgMasukRoute.post("/create", verifyUser, isAdmin, brgMasuk.createBarangMasuk);
brgMasukRoute.get("/", verifyUser, brgMasuk.getBarangMasuk);
brgMasukRoute.get("/:id", verifyUser, brgMasuk.getBarangMasukById);
brgMasukRoute.delete(
  "/del/:id",
  verifyUser,
  isAdmin,
  brgMasuk.deleteBarangMasuk
);

export default brgMasukRoute;
