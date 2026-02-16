import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import taskController from "../controllers/task.controllers.js";
const router=Router();

router.get("/",authenticate,taskController.getTasks);
router.get("/:id",authenticate,taskController.getTask);
router.post("/",authenticate,taskController.createTask);
router.patch("/:id",authenticate,taskController.updateTask);
router.delete("/:id",authenticate,taskController.deleteTask);




export default router;

