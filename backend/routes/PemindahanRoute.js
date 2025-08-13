import express from "express";
import PemindahanController from "../controllers/PemindahanController.js";
import { isAdmin, verifyUser } from "../middleware/authMiddleware.js";

const pemindahanRoute = express.Router();
const pemindahan = new PemindahanController();

pemindahanRoute.post(
  "/create",
  verifyUser,
  isAdmin,
  pemindahan.createPemindahan
);
pemindahanRoute.get("/", verifyUser, pemindahan.getPemindahan);
pemindahanRoute.get("/all", verifyUser, pemindahan.getAllPemindahan);
pemindahanRoute.get("/:id", verifyUser, isAdmin, pemindahan.getPemindahanById);
pemindahanRoute.patch("/update/", verifyUser, pemindahan.updatePenyusutan);
pemindahanRoute.patch("/update/:id", verifyUser, pemindahan.updatePemindahan);
pemindahanRoute.delete(
  "/del/:id",
  verifyUser,
  isAdmin,
  pemindahan.deletePemindahan
);

export default pemindahanRoute;
