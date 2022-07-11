import type { Response } from "express";

export interface ApiResponseType<T> {
  status?: "success" | "error";
  statusCode?: number;
  message: string;
  data?: T;
}

const ApiResponse = {
  /**
   *
   * @param res - express response object
   * @param code - status code
   * @param options - options to be returned
   * @example
   * ```ts
   * ApiResponse.success<{ name: string }>(res, 200, {
   *  message: "Success",
   *  data: { name: "John" },
   * });
   * ```
   */
  success: <T = null>(res: Response, code: number, options: ApiResponseType<T>): Response => res.status(code).json({
    status: "success",
    statusCode: code,
    ...options,
  }),

  /**
   * Function to send an error response to the client
   * @param res - express response object
   * @param code - status code
   * @param options - message and data
   * @example
   * ```ts
   * ApiResponse.error(res, 400, {
   *  message: "Bad Request",
   * });
   * ```
   */
  error: <T = null>(res: Response, code: number, options: ApiResponseType<T>): Response => res.status(code).json({
    status: "error",
    statusCode: code,
    ...options,
  }),
};

export default ApiResponse;
