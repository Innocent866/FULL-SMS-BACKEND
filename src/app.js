import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import parentRoutes from "./routes/parent.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import studentRoutes from "./routes/student.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";

const app = express();

// Security
app.use(helmet());

// CORS
// app.use(
//   cors({
//     origin: [
//       "https://full-sms.vercel.app",
//       "http://localhost:5173"
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     credentials: true
//   })
// );
var corsOptions = {
  origin: 'https://full-sms.vercel.app',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

app.options("*", cors());


// Other middlewares
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Health route
app.get("/", (req, res) => {
  res.send("School Management System API is running");
});


// API routes
app.use("/api/auth", authRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/assignments", assignmentRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
