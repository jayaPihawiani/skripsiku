import express from "express";
import DistribusiController from "../controllers/DistribusiController.js";
import { isAdmin, verifyUser } from "../middleware/authMiddleware.js";

const distribusiRoute = express.Router();
const distribusi = new DistribusiController();

distribusiRoute.post(
  "/create",
  verifyUser,
  isAdmin,
  distribusi.createDistribusi
);
distribusiRoute.get("/", verifyUser, distribusi.getDistribusi);
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
