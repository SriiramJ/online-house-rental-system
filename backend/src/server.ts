import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import db from "./config/db.ts"
import logger from "./utils/logger.ts"
import routes from "./routes/index.ts"

dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}))
app.use(express.json())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Routes
app.use("/api", (req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
}, routes)



const PORT = process.env.PORT || 3001
app.listen(PORT, async () => {
  try {
    await db.getConnection();
    logger.info(`Server running on port ${PORT}`);
  } catch (error: any) {
    logger.error(`Server startup failed: ${error.message}`);
  }
});