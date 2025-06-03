import express from "express";
import PermintaanController from "../controllers/PermintaanController.js";
import { isAdmin, verifyUser } from "../middleware/authMiddleware.js";

const permintaanRoute = express.Router();
const permintaan = new PermintaanController();

permintaanRoute.post("/create", verifyUser, permintaan.createPermintaan);
permintaanRoute.get("/", verifyUser, permintaan.getPermintaan);
permintaanRoute.get("/:id", verifyUser, permintaan.getPermintaanById);
permintaanRoute.delete("/del/:id", verifyUser, permintaan.deletePermintaan);

export default permintaanRoute;
