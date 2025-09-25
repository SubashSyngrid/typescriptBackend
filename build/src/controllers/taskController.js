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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComment = exports.updateTaskStatus = exports.createTask = void 0;
const taskModel_1 = require("../models/taskModel");
const notificationServices_1 = require("../services/notificationServices");
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, assignees, dueDate, priority } = req.body;
    console.log('req.body', req.body);
    const task = yield taskModel_1.TaskModel.create({
        title, description, assignees, dueDate, priority, createdBy: req.user._id
    });
    // notify assignees (socket + email)
    notificationServices_1.NotificationService.notifyTaskAssigned(task, assignees);
    res.status(201).json(task);
});
exports.createTask = createTask;
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const task = yield taskModel_1.TaskModel.findByIdAndUpdate(id, { status }, { new: true }).populate('assignees', 'email name');
    if (!task)
        return res.status(404).json({ message: 'Task not found' });
    // notify assignees about status change
    notificationServices_1.NotificationService.notifyTaskStatusChanged(task);
    res.json(task);
});
exports.updateTaskStatus = updateTaskStatus;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { text } = req.body;
    const comment = { user: req.user._id, text, createdAt: new Date() };
    const task = yield taskModel_1.TaskModel.findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true });
    res.json(task);
});
exports.addComment = addComment;
