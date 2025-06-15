import express from "express";
import DivisiController from "../controllers/DivisiController.js";
import { verifyUser, isAdmin } from "../middleware/authMiddleware.js";

const divisiRoute = express.Router();
const divisi = new DivisiController();

divisiRoute.post("/create", verifyUser, isAdmin, divisi.createService);
divisiRoute.get("/", verifyUser, isAdmin, divisi.getService);
divisiRoute.get("/all", verifyUser, isAdmin, divisi.getAllService);
divisiRoute.get("/:id", verifyUser, isAdmin, divisi.getServiceById);
divisiRoute.delete("/del/:id", verifyUser, isAdmin, divisi.deleteService);
divisiRoute.patch("/update/:id", verifyUser, isAdmin, divisi.updateService);

export default divisiRoute;
