import express from "express";
import DistribusiController from "../controllers/DistribusiController.js";
import { isAdmin, verifyUser } from "../middleware/authMiddleware.js";

const distribusiRoute = express.Router();
const distribusi = new DistribusiController();

distribusiRoute.get("/", verifyUser, distribusi.getDistribusi);
distribusiRoute.get("/all", verifyUser, distribusi.getAllDistribusi);
distribusiRoute.post(
  "/create",
  verifyUser,
  isAdmin,
  distribusi.createDistribusi
);
distribusiRoute.delete(
  "/del/:id",
  verifyUser,
  isAdmin,
  distribusi.deleteDistribusi
);
distribusiRoute.patch(
  "/update/:id",
  verifyUser,
  isAdmin,
  distribusi.updateDistribusi
);

export default distribusiRoute;
