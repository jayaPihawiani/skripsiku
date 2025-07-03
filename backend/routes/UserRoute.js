import express from "express";
import UserController from "../controllers/UserController.js";
import { verifyUser, isAdmin } from "../middleware/authMiddleware.js";

const userRoute = express.Router();
const user = new UserController();

userRoute.get("/", verifyUser, isAdmin, user.getUser);
userRoute.get("/all", verifyUser, isAdmin, user.getAllUser);
userRoute.post("/create", verifyUser, isAdmin, user.createUser);
userRoute.delete("/del/:id", verifyUser, isAdmin, user.deleteUser);
userRoute.patch("/update/:id", verifyUser, isAdmin, user.updateDataUser);

export default userRoute;
