import express from "express";
import PemindahanController from "../controllers/PemindahanController.js";
import { isAdmin, verifyUser } from "../middleware/authMiddleware.js";

const pemindahanRoute = express.Router();
const pemindahan = new PemindahanController();

pemindahanRoute.get("/", verifyUser, pemindahan.getPemindahan);
pemindahanRoute.get("/all", verifyUser, pemindahan.getAllPemindahan);
pemindahanRoute.get("/:id", verifyUser, isAdmin, pemindahan.getPemindahanById);
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

export default pemindahanRoute;
