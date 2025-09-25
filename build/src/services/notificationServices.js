"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.NotificationService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const socket_1 = require("../socket/socket");
class NotificationServiceClass {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: config_1.default.smtp.host,
            port: config_1.default.smtp.port,
            auth: { user: config_1.default.smtp.user, pass: config_1.default.smtp.pass }
        });
        // shift reminders, deadline alerts etc can be scheduled in jobs/
    }
    sendEmail(to, subject, html) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transporter.sendMail({ from: config_1.default.smtp.user, to, subject, html });
        });
    }
    // called when a task is assigned
    notifyTaskAssigned(task, assigneeIds) {
        return __awaiter(this, void 0, void 0, function* () {
            // fetch assignee emails
            const users = yield (yield Promise.resolve().then(() => __importStar(require('../models/userModel')))).UserModel.find({ _id: { $in: assigneeIds } });
            const emails = users.map(u => u.email);
            // email
            yield this.sendEmail(emails.join(','), `Task assigned: ${task.title}`, `<p>You have been assigned task: ${task.title}</p>`);
            // socket push to each user room (assumes clients join `user:<userId>` rooms)
            assigneeIds.forEach((id) => socket_1.io.to(`user:${id}`).emit('taskAssigned', task));
        });
    }
    notifyTaskStatusChanged(task) {
        return __awaiter(this, void 0, void 0, function* () {
            // notify assignees
            task.assignees.forEach((id) => socket_1.io.to(`user:${id}`).emit('taskStatusChanged', task));
            // optionally email
        });
    }
}
exports.NotificationService = new NotificationServiceClass();
