import type { Response, NextFunction } from "express";
import { JSONWebToken } from "../utils";
import { ApiResponse } from "../helpers";

const JWTMiddleware = async (req: CustomRequest, res: Response, next:NextFunction): Promise<Response | void> => {
  const token = req.headers.authorization?.split(" ")[1] || req.header("Authorization")?.split(" ")[1] || null;

  if (!token) {
    return ApiResponse.error(res, 401, {
      message: "Unauthorized",
    });
  }

  // Decode the token
  const decoded: { uid: string, accessToken: string } | null = await JSONWebToken.verify(token);

  if (!decoded) {
    return ApiResponse.error(res, 401, {
      message: "Unauthorized",
    });
  }

  req.user = decoded;

  return next();
};

export default JWTMiddleware;
