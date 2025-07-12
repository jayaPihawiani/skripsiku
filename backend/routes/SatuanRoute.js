import express from "express";
import SatuanController from "../controllers/SatuanController.js";
import { isAdmin, verifyUser } from "../middleware/authMiddleware.js";

const satuanRoute = express.Router();
const satuan = new SatuanController();

satuanRoute.get("/", verifyUser, isAdmin, satuan.getService);
satuanRoute.get("/all", verifyUser, isAdmin, satuan.getAllService);
satuanRoute.get("/:id", verifyUser, isAdmin, satuan.getServiceById);
satuanRoute.post("/create", verifyUser, isAdmin, satuan.createService);
satuanRoute.delete("/del/:id", verifyUser, isAdmin, satuan.deleteService);
satuanRoute.patch("/update/:id", verifyUser, isAdmin, satuan.updateService);

export default satuanRoute;
