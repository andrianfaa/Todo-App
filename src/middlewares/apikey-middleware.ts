import type { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../helpers";

const ApiKeyMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const requestApikey = req.header("x-api-key") || null;
  const apikey = process.env.API_KEY || null;

  if (!apikey) throw new Error("API_KEY is not defined");

  if (!requestApikey) {
    return ApiResponse.error(res, 401, {
      message: "API key is missing",
    });
  }

  if (apikey !== requestApikey) {
    return ApiResponse.error(res, 401, {
      message: "Invalid API key",
    });
  }

  return next();
};

export default ApiKeyMiddleware;
