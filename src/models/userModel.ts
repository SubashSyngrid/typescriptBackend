import { Schema, model, Document } from 'mongoose';

export type Role = 'Admin'|'ProjectHead'|'ReportingManager'|'TeamLead'|'Member';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  branch?: string; // e.g. madurai, chennai
  isActive: boolean;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin','ProjectHead','ReportingManager','TeamLead','Member'], default: 'Member' },
  branch: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const UserModel = model<IUser>('User', UserSchema);
