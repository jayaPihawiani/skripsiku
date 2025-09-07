import express from "express";
import {
  DetailKerusakanController,
  KategoriKerusakanController,
} from "../controllers/KategoriKerusakan.js";
import { isAdmin, verifyUser } from "../middleware/authMiddleware.js";

const kategoriRusakRoute = express.Router();
const kategoriKerusakan = new KategoriKerusakanController();

const detailRusakRoute = express.Router();
const detailKerusakan = new DetailKerusakanController();

kategoriRusakRoute.post(
  "/create",
  verifyUser,
  isAdmin,
  kategoriKerusakan.createKategoriKerusakan
);
kategoriRusakRoute.get(
  "/",
  verifyUser,
  isAdmin,
  kategoriKerusakan.getKategoriKerusakan
);
kategoriRusakRoute.get(
  "/all",
  verifyUser,
  isAdmin,
  kategoriKerusakan.getAllKategoriKerusakan
);
kategoriRusakRoute.get(
  "/c",
  verifyUser,
  isAdmin,
  kategoriKerusakan.getKategoriKerusakanyJenis
);
kategoriRusakRoute.patch(
  "/update/:id",
  verifyUser,
  isAdmin,
  kategoriKerusakan.updateKategoriKerusakan
);
kategoriRusakRoute.delete(
  "/del/:id",
  verifyUser,
  isAdmin,
  kategoriKerusakan.deleteKategoriKerusakan
);

detailRusakRoute.post(
  "/create",
  verifyUser,
  isAdmin,
  detailKerusakan.createDetailKerusakan
);
detailRusakRoute.get(
  "/",
  verifyUser,
  isAdmin,
  detailKerusakan.getDetailKerusakan
);
detailRusakRoute.delete(
  "/del/:id",
  verifyUser,
  isAdmin,
  detailKerusakan.deleteDetailKerusakan
);

export { kategoriRusakRoute, detailRusakRoute };
