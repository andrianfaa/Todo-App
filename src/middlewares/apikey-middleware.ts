import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../helpers";

const ApiKeyMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const requestApikey = req.header("x-api-key") || null;
  const apikey = process.env.API_KEY || null;

  if (!apikey) throw new Error("API_KEY is not defined");

  if (!requestApikey) {
    return ApiResponse.error(res, 401, {
      message: "Unauthorized",
    });
  }

  if (apikey !== requestApikey) {
    return ApiResponse.error(res, 401, {
      message: "Unauthorized",
    });
  }

  return next();
};

export default ApiKeyMiddleware;
