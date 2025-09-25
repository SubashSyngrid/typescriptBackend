import { Schema, model, Document, Types } from 'mongoose';

export interface IAttendance extends Document {
  user: Types.ObjectId;
  date: Date;
  loginAt?: Date;
  logoutAt?: Date;
  shift: 'day'|'night'|string;
  breaks: { start: Date; end?: Date }[];
  overtimeMinutes?: number;
}

const AttendanceSchema = new Schema<IAttendance>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  loginAt: Date,
  logoutAt: Date,
  shift: { type: String, enum: ['day','night'], default: 'day' },
  breaks: [{ start: Date, end: Date }],
  overtimeMinutes: Number
}, { timestamps: true });

AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export const AttendanceModel = model<IAttendance>('Attendance', AttendanceSchema);
