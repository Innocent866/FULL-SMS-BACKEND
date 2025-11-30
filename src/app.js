import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

// import config from './config/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import parentRoutes from './routes/parent.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import studentRoutes from './routes/student.routes.js';
import adminRoutes from './routes/admin.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import assignmentRoutes from './routes/assignment.routes.js';

const app = express();

app.use(helmet());
// const allowedOrigins = config.clientUrl
//   .split(',')
//   .map((origin) => origin.trim())
//   .filter(Boolean);

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
//     return callback(new Error(`Origin ${origin} not allowed by CORS`));
//   },
//   credentials: true
// };

// app.use(cors(corsOptions));
app.use(cors());
// app.options('*', cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/assignments', assignmentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
