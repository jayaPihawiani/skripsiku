import express from "express";
import PermintaanController from "../controllers/PermintaanController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const permintaanRoute = express.Router();
const permintaan = new PermintaanController();

permintaanRoute.get("/", verifyUser, permintaan.getPermintaan);
permintaanRoute.get("/:id", verifyUser, permintaan.getPermintaanById);
permintaanRoute.post("/create", verifyUser, permintaan.createPermintaan);
permintaanRoute.delete("/del/:id", verifyUser, permintaan.deletePermintaan);
permintaanRoute.patch(
  "/update/:id",
  verifyUser,
  permintaan.updateStatusPermintaan
);

export default permintaanRoute;
