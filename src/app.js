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

/* ----------------------------------
   Security & Basic Middlewares
---------------------------------- */
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(morgan("dev"));

/* ----------------------------------
   CORS CONFIG (FIXED)
---------------------------------- */

// Allow your frontend
const allowedOrigins = [
  "https://full-sms.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow mobile apps, tools, and server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

/* ----------------------------------
   Body Parser
---------------------------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ----------------------------------
   Health Check
---------------------------------- */
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

/* ----------------------------------
   API Routes
---------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/assignments", assignmentRoutes);

/* ----------------------------------
   Error Handlers
---------------------------------- */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
