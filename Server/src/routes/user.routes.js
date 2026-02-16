import { Router } from "express";
import userController from "../controllers/user.controllers.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router=Router();

router.post("/signup",userController.signUp);
router.post("/login",userController.login)

router.get("/getUsers",authenticate,userController.getUsers);
router.get("/me",authenticate,userController.getMe);
router.get("/logout",authenticate, userController.logout)

export default router;