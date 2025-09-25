"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendanceController_1 = require("../controllers/attendanceController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Employee logs in for the day
router.post("/attndlogin", authMiddleware_1.authenticate, attendanceController_1.loginAttendance);
// Employee logs out for the day
router.post("/attndlogout", authMiddleware_1.authenticate, attendanceController_1.logoutAttendance);
exports.default = router;
