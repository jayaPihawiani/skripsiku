import express from "express";
import AuthController from "../controllers/AuthController.js";

const authRoute = express.Router();
const auth = new AuthController();

authRoute.post("/login", auth.loginUser);
authRoute.delete("/logout", auth.logoutUser);
authRoute.get("/uInfo", auth.userInfo);

export default authRoute;
