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
pemindahanRoute.delete(
  "/del/:id",
  verifyUser,
  isAdmin,
  pemindahan.deletePemindahan
);
pemindahanRoute.patch(
  "/update/:id",
  verifyUser,
  isAdmin,
  pemindahan.updatePemindahan
);
pemindahanRoute.get("/:id", verifyUser, isAdmin, pemindahan.getPemindahanById);
pemindahanRoute.get("/", verifyUser, isAdmin, pemindahan.getPemindahan);

export default pemindahanRoute;
