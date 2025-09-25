import { Router } from "express";
import { createTask, updateTaskStatus, addComment } from "../controllers/taskController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();


router.post("/createTask", authenticate, createTask);


router.patch("/updateTask/:id", authenticate, updateTaskStatus);


router.post("/addComment/:id", authenticate, addComment);

export default router;
