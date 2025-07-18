import express from "express";
import BarangMasukController from "../controllers/BarangMasukController.js";
import { isAdmin, verifyUser } from "../middleware/authMiddleware.js";

const brgMasukRoute = express.Router();
const brgMasuk = new BarangMasukController();

brgMasukRoute.get("/", verifyUser, brgMasuk.getBarangMasuk);
brgMasukRoute.get("/all", verifyUser, brgMasuk.getAllBrgMasuk);
brgMasukRoute.get("/:id", verifyUser, brgMasuk.getBarangMasukById);
brgMasukRoute.post("/create", verifyUser, isAdmin, brgMasuk.createBarangMasuk);
brgMasukRoute.delete(
  "/del/:id",
  verifyUser,
  isAdmin,
  brgMasuk.deleteBarangMasuk
);

export default brgMasukRoute;
