import express from 'express';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import config from './config/index';
import authRoutes from './routes/authRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
// import documentRoutes from './routes/document.routes';
import taskRoutes from './routes/taskRoutes';


const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.use('/', authRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/tasks', taskRoutes);
// app.use('/documents', documentRoutes);

mongoose.connect(config.mongoUri).then(() => {
  console.log('Mongo connected');
  const server = http.createServer(app);
//   initSockets(server);
//   scheduleJobs();
  server.listen(config.port, () => console.log('Server listening on', config.port));
}).catch(err => console.error(err));

export default app;
