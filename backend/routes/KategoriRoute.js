import express from "express";
import KategoriController from "../controllers/KategoriController.js";
import { verifyUser, isAdmin } from "../middleware/authMiddleware.js";

const kategoriRoute = express.Router();
const kategori = new KategoriController();

kategoriRoute.post("/create", verifyUser, isAdmin, kategori.createService);
kategoriRoute.get("/", verifyUser, isAdmin, kategori.getService);
kategoriRoute.get("/all", verifyUser, isAdmin, kategori.getAllService);
kategoriRoute.get("/:id", verifyUser, isAdmin, kategori.getServiceById);
kategoriRoute.delete("/del/:id", verifyUser, isAdmin, kategori.deleteService);
kategoriRoute.patch("/update/:id", verifyUser, isAdmin, kategori.updateService);

export default kategoriRoute;
