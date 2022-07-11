import type { Request } from "express";

declare global {
  interface CustomRequest extends Request {
    user?: {
      uid: string;
    }
  }
}
