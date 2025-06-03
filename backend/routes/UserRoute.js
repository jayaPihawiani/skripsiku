import express from "express";
import UserController from "../controllers/UserController.js";
import { verifyUser, isAdmin } from "../middleware/authMiddleware.js";

const userRoute = express.Router();
const user = new UserController();

userRoute.post("/create", verifyUser, isAdmin, user.createUser);
userRoute.get("/", verifyUser, isAdmin, user.getUser);

export default userRoute;
