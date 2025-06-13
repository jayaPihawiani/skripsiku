import express from "express";
import PenghapusanController from "../controllers/PenghapusanController.js";
import { isAdmin, verifyUser } from "../middleware/authMiddleware.js";

const penghapusanRoute = express.Router();
const penghapusan = new PenghapusanController();

penghapusanRoute.post(
  "/create",
  verifyUser,
  isAdmin,
  penghapusan.createPenghapusan
);
penghapusanRoute.delete(
  "/del/:id",
  verifyUser,
  isAdmin,
  penghapusan.deletePenghapusan
);
// penghapusanRoute.patch(
//   "/update/:id",
//   verifyUser,
//   isAdmin,
//   penghapusan.
// );
penghapusanRoute.get("/:id", verifyUser, penghapusan.getPenghapusanById);
penghapusanRoute.get("/", verifyUser, penghapusan.getPenghapusan);

export default penghapusanRoute;
