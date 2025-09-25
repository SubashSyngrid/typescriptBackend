import { Request, Response } from 'express';
import { TaskModel } from '../models/taskModel';
import { AuthRequest } from '../middleware/authMiddleware';
import { NotificationService } from '../services/notificationServices';

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, assignees, dueDate, priority } = req.body;
  console.log('req.body', req.body)
  const task = await TaskModel.create({
    title, description, assignees, dueDate, priority, createdBy: req.user!._id
  });

  // notify assignees (socket + email)
  NotificationService.notifyTaskAssigned(task, assignees);

  res.status(201).json(task);
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const task = await TaskModel.findByIdAndUpdate(id, { status }, { new: true }).populate('assignees', 'email name');
  if (!task) return res.status(404).json({ message: 'Task not found' });

  // notify assignees about status change
  NotificationService.notifyTaskStatusChanged(task);

  res.json(task);
};

export const addComment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;
  const comment = { user: req.user!._id, text, createdAt: new Date() };
  const task = await TaskModel.findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true });
  res.json(task);
};
