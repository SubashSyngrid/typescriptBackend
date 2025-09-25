"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutAttendance = exports.loginAttendance = void 0;
const attendanceModel_1 = require("../models/attendanceModel");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Employee logs in for the day.
 */
const loginAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
    const { shift } = req.body; // 'day'|'night'
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let att = yield attendanceModel_1.AttendanceModel.findOne({ user: userId, date: dateOnly });
    if (!att) {
        att = yield attendanceModel_1.AttendanceModel.create({ user: userId, date: dateOnly, loginAt: new Date(), shift });
    }
    else {
        att.loginAt = new Date();
        att.shift = shift || att.shift;
        yield att.save();
    }
    res.json(att);
});
exports.loginAttendance = loginAttendance;
const logoutAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const att = yield attendanceModel_1.AttendanceModel.findOne({ user: userId, date: dateOnly });
    if (!att)
        return res.status(400).json({ message: 'No login record for today' });
    att.logoutAt = new Date();
    // compute overtime if logout beyond shift end (example)
    // ... logic to compute overtimeMinutes
    yield att.save();
    res.json(att);
});
exports.logoutAttendance = logoutAttendance;
