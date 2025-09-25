import { TaskModel } from '../models/taskModel';
import nodemailer from 'nodemailer';
import config from '../config';
import { io } from '../socket/socket'; 

class NotificationServiceClass {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    auth: { user: config.smtp.user, pass: config.smtp.pass }
  });

  async sendEmail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({ from: config.smtp.user, to, subject, html });
  }

  // called when a task is assigned
  async notifyTaskAssigned(task: any, assigneeIds: string[]) {
    // fetch assignee emails
    const users = await (await import('../models/userModel')).UserModel.find({ _id: { $in: assigneeIds } });
    const emails = users.map(u => u.email);
    // email
    await this.sendEmail(emails.join(','), `Task assigned: ${task.title}`, `<p>You have been assigned task: ${task.title}</p>`);
    // socket push to each user room (assumes clients join `user:<userId>` rooms)
    assigneeIds.forEach((id: string) => io.to(`user:${id}`).emit('taskAssigned', task));
  }

  async notifyTaskStatusChanged(task: any) {
    // notify assignees
    task.assignees.forEach((id: string) => io.to(`user:${id}`).emit('taskStatusChanged', task));
    // optionally email
  }

  // shift reminders, deadline alerts etc can be scheduled in jobs/
}

export const NotificationService = new NotificationServiceClass();
