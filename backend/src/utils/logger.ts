import winston from "winston";
import path from "path";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    ({ timestamp, level, message }) =>
      `${timestamp} [${level.toUpperCase()}]: ${message}`
  )
);

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
    }),

    // All logs
    new winston.transports.File({
      filename: path.join("logs", "combined.log"),
    }),

    // Console logs (for development)
    new winston.transports.Console(),
  ],
});

export default logger;
