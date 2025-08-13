import express from "express";
import BrgRusakController from "../controllers/BrgRusakController.js";
import { isAdmin, verifyUser } from "../middleware/authMiddleware.js";

const brgRusakRoute = express.Router();
const brgRusak = new BrgRusakController();

brgRusakRoute.get("/", verifyUser, brgRusak.getBrgRusak);
brgRusakRoute.get("/all", verifyUser, brgRusak.getAllBrgRusak);
brgRusakRoute.get(
  "/get_by_status",
  verifyUser,
  isAdmin,
  brgRusak.getAllBrgRusakDiperbaiki
);
brgRusakRoute.get("/:id", verifyUser, isAdmin, brgRusak.getBrgRusakById);
brgRusakRoute.post("/create", verifyUser, isAdmin, brgRusak.createBrgRusak);
brgRusakRoute.delete("/del/:id", verifyUser, isAdmin, brgRusak.deleteBrgRusak);
brgRusakRoute.patch(
  "/update/:id",
  verifyUser,
  isAdmin,
  brgRusak.updateBrgRusak
);

export default brgRusakRoute;
