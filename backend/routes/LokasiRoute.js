import express from "express";
import LokasiController from "../controllers/LokasiController.js";
import { verifyUser, isAdmin } from "../middleware/authMiddleware.js";

const lokasiRoute = express.Router();
const lokasi = new LokasiController();

lokasiRoute.get("/", verifyUser, isAdmin, lokasi.getService);
lokasiRoute.get("/all", verifyUser, lokasi.getAllService);
lokasiRoute.get("/:id", verifyUser, isAdmin, lokasi.getServiceById);
lokasiRoute.post("/create", verifyUser, isAdmin, lokasi.createService);
lokasiRoute.delete("/del/:id", verifyUser, isAdmin, lokasi.deleteService);
lokasiRoute.patch("/update/:id", verifyUser, isAdmin, lokasi.updateService);

export default lokasiRoute;
