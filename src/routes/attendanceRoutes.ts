import { Router } from "express";
import { loginAttendance, logoutAttendance } from "../controllers/attendanceController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Employee logs in for the day
router.post("/attndlogin", authenticate, loginAttendance);

// Employee logs out for the day
router.post("/attndlogout", authenticate, logoutAttendance);

export default router;
