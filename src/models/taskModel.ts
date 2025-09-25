import { Schema, model, Document, Types } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  assignees: Types.ObjectId[]; // users
  createdBy: Types.ObjectId;
  dueDate?: string;
  priority: 'low'|'medium'|'high';
  status: 'todo'|'inprogress'|'completed';
  attachments?: string[]; // file paths or ids
  comments?: { user: Types.ObjectId; text: string; createdAt: Date }[];
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: String,
  assignees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  dueDate: String,
  priority: { type: String, enum: ['low','medium','high'], default: 'medium' },
  status: { type: String, enum: ['todo','inprogress','completed'], default: 'todo' },
  attachments: [String],
  comments: [{ user: { type: Schema.Types.ObjectId, ref: 'User' }, text: String, createdAt: { type: Date, default: Date.now } }]
}, { timestamps: true });

export const TaskModel = model<ITask>('Task', TaskSchema);
