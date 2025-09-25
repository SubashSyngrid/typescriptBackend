"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'ProjectHead', 'ReportingManager', 'TeamLead', 'Member'], default: 'Member' },
    branch: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)('User', UserSchema);
