import express from "express";

const router = express.Router();
import UserController from "../controllers/userControllers";
import { auth, authAdmin } from '../middlewares/auth'

router.put("/confirm/:id", auth, authAdmin, UserController.confirmAccount);
router.get('/teachers', auth, authAdmin, UserController.getTeachers)
router.put("/update_user", auth, UserController.updateUser);
router.put('/reset_password', auth, UserController.resetPassword)
export default router;
