import ApiCache from "apicache";
import bodyParser from "body-parser";
import type { CorsOptions, CorsOptionsDelegate } from "cors";
import cors from "cors";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";
import helmet from "helmet";
import http from "http";
import type { ConnectOptions } from "mongoose";
import mongoose from "mongoose";
import morgan from "morgan";

const isDev = process.env.NODE_ENV === "development";

dotenv.config({
  path: `${process.cwd()}/config/${isDev ? ".env.development" : ".env"}`,
});

// Initialize express
const app = express();
const server = http.createServer(app);
const cache = ApiCache.middleware("1 minute");
const PORT = process.env.PORT || isDev ? 5000 : 3000;
const MONGODB_URI: string | null = process.env.MONGODB_URI || null;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) ?? [];
const CORS_OPTIONS: CorsOptionsDelegate<Request> = (req, callback) => {
  const origin: CorsOptions = {
    origin: false,
  };
  const requestOrigin = req.headers.origin || req.header("Origin") || null;

  if (!requestOrigin) return callback(null, origin);

  if (ALLOWED_ORIGINS.find(
    (allowedOrigin) => allowedOrigin.toLowerCase() === requestOrigin.toLowerCase(),
  )) {
    origin.origin = requestOrigin;
  }

  return callback(null, origin);
};

if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions, (err) => {
  if (err) {
    throw new Error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.info("Connected to MongoDB");
});

// Setup express middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(CORS_OPTIONS));
app.use(helmet());
app.use(morgan("dev"));

// Setup express routes
app.get("/", cache, (req: Request, res: Response): Response => res.status(200).send("Server is running"));

export {
  server,
  PORT,
};
