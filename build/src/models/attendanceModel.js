"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceModel = void 0;
const mongoose_1 = require("mongoose");
const AttendanceSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    loginAt: Date,
    logoutAt: Date,
    shift: { type: String, enum: ['day', 'night'], default: 'day' },
    breaks: [{ start: Date, end: Date }],
    overtimeMinutes: Number
}, { timestamps: true });
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });
exports.AttendanceModel = (0, mongoose_1.model)('Attendance', AttendanceSchema);
