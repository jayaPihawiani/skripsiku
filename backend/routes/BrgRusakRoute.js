import express from "express";
import BrgRusakController from "../controllers/BrgRusakController.js";
import { isAdmin, verifyUser } from "../middleware/authMiddleware.js";

const brgRusakRoute = express.Router();
const brgRusak = new BrgRusakController();

brgRusakRoute.post("/create", verifyUser, isAdmin, brgRusak.createBrgRusak);
brgRusakRoute.get("/", verifyUser, isAdmin, brgRusak.getBrgRusak);
brgRusakRoute.get("/:id", verifyUser, isAdmin, brgRusak.getBrgRusakById);
brgRusakRoute.delete("/del/:id", verifyUser, isAdmin, brgRusak.deleteBrgRusak);
brgRusakRoute.patch(
  "/update/:id",
  verifyUser,
  isAdmin,
  brgRusak.updateBrgRusak
);

export default brgRusakRoute;
