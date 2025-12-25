import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.ts";
import logger from "./utils/logger.ts";
import routes from "./routes/index.ts";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  try {
    // Test database connection on startup
    const connection = await db.getConnection();
    logger.info(`Server running on http://localhost:${PORT}`);
    connection.release();
  } catch (error: any) {
    logger.error(`Server startup failed: ${error.message}`);
  }
});