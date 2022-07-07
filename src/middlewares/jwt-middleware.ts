import type { Request, Response, NextFunction } from "express";
import { JSONWebToken } from "../utils";
import { ApiResponse } from "../helpers";

export interface RequestWithUser extends Request {
  user?: {
    uid: string;
    accessToken: string;
  }
}

const JWTMiddleware = async (req: RequestWithUser, res: Response, next:NextFunction): Promise<Response | void> => {
  const token = req.headers.authorization || req.header("Authorization") || null;

  if (!token) {
    return ApiResponse.error(res, 401, {
      message: "No token provided",
    });
  }

  // Decode the token
  const decoded: {
    uid: string;
    accessToken: string;
  } = await JSONWebToken.verify(token);

  if (!decoded) {
    return ApiResponse.error(res, 401, {
      message: "Invalid token",
    });
  }

  req.user = decoded;

  return next();
};

export default JWTMiddleware;
