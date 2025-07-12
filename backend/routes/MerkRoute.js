import express from "express";
import MerkController from "../controllers/MerkController.js";
import { isAdmin, verifyUser } from "../middleware/authMiddleware.js";

const merkRoute = express.Router();
const merk = new MerkController();

merkRoute.get("/", verifyUser, isAdmin, merk.getService);
merkRoute.get("/all", verifyUser, isAdmin, merk.getAllService);
merkRoute.get("/:id", verifyUser, isAdmin, merk.getServiceById);
merkRoute.post("/create", verifyUser, isAdmin, merk.createService);
merkRoute.delete("/del/:id", verifyUser, isAdmin, merk.deleteService);
merkRoute.patch("/update/:id", verifyUser, isAdmin, merk.updateService);

export default merkRoute;
