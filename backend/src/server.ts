import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import db from "./config/db.ts"
import logger from "./utils/logger.ts"
import healthRoutes from "./routes/health.routes.ts";







dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())


// test route
app.use("/api", healthRoutes);



const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
  try {
    await db.getConnection();
    logger.info(`Server running on port ${PORT}`);
  } catch (error: any) {
    logger.error(`Server startup failed: ${error.message}`);
  }
});