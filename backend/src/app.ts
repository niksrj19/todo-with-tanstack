import express from "express";
import cors from "cors";

import { pool } from "./config/database";
import taskRoutes from "./modules/tasks/task.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow backend is running"
  });
});

// Database health check
app.get("/health/db", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS current_time"
    );

    res.status(200).json({
      success: true,
      message: "PostgreSQL connected successfully",
      databaseTime: result.rows[0].current_time
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

// Task APIs
app.use("/api/tasks", taskRoutes);

// Not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

// Global error handler (must be registered last)
app.use(errorMiddleware);

export default app;