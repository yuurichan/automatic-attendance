import express from "express";

const router = express.Router();
import AuthController from "../controllers/authControllers";
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/refresh_token", AuthController.refreshToken);
router.get("/logout", AuthController.logout);

export default router;

