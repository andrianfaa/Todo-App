/// <reference types="./express-env" />

import ApiCache from "apicache";
import bodyParser from "body-parser";
// import type { CorsOptions, CorsOptionsDelegate } from "cors";
import cors from "cors";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";
import helmet from "helmet";
import http from "http";
import type { ConnectOptions } from "mongoose";
import mongoose from "mongoose";
import morgan from "morgan";
import Routes from "./src/routes";

const isDevelopment = process.env.NODE_ENV === "development";

dotenv.config({
  path: `${process.cwd()}/config/${isDevelopment ? ".env.development" : ".env"}`,
});

// Initialize express
const app = express();
const server = http.createServer(app);
const cache = ApiCache.middleware("1 minute");
const { PORT } = process.env as { PORT: string };
const MONGODB_URI: string = process.env.MONGODB_URI as string;
// const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) ?? [];
// const CORS_OPTIONS: CorsOptionsDelegate<Request> = (req, callback) => {
//   const origin: CorsOptions = {
//     origin: false,
//   };
//   const requestOrigin = req.headers.origin || req.header("Origin") || null;

//   if (!requestOrigin) return callback(null, origin);

//   if (ALLOWED_ORIGINS.find(
//     (allowedOrigin) => allowedOrigin.toLowerCase() === requestOrigin.toLowerCase(),
//   )) {
//     origin.origin = requestOrigin;
//   }

//   return callback(null, origin);
// };

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions).catch((err) => {
  console.error(err);
});

// Setup express middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors(CORS_OPTIONS));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Setup express routes
app.get("/", cache, (req: Request, res: Response): Response => res.status(200).send("Server is running"));
app.use("/api/v1", Routes);

export {
  server,
  PORT,
  app,
};
