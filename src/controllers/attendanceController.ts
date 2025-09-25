import { Request, Response } from 'express';
import { AttendanceModel } from '../models/attendanceModel';
import { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

/**
 * Employee logs in for the day.
 */
export const loginAttendance = async (req: AuthRequest, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user!._id);
  const { shift } = req.body; // 'day'|'night'
  const today = new Date();
  const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let att = await AttendanceModel.findOne({ user: userId, date: dateOnly });
  if (!att) {
    att = await AttendanceModel.create({ user: userId, date: dateOnly, loginAt: new Date(), shift });
  } else {
    att.loginAt = new Date();
    att.shift = shift || att.shift;
    await att.save();
  }

  
  res.json(att);
};


export const logoutAttendance = async (req: AuthRequest, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user!._id);
  const today = new Date();
  const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const att = await AttendanceModel.findOne({ user: userId, date: dateOnly });
  if (!att) return res.status(400).json({ message: 'No login record for today' });

  att.logoutAt = new Date();

  // compute overtime if logout beyond shift end (example)
  // ... logic to compute overtimeMinutes
  await att.save();
  res.json(att);
};
