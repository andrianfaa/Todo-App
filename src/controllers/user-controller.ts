import Crypto from "crypto";
import type { Request, Response } from "express";
import { UserSchema } from "../schemas";
import { ApiResponse } from "../helpers";
import { CustomError } from "../utils";

type SignupRequestBody = {
  name: string;
  email: string;
  password: string;
}

const UserControllers = {
  // Function to handle user signup request
  signup: async (req: Request & { body: SignupRequestBody }, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return ApiResponse.error(res, 400, {
        message: "Missing required fields",
      });
    }

    try {
      const checkUser = await UserSchema.findOne({ "user.email": email });

      if (checkUser) throw new CustomError("User already exists", 400);

      const user = new UserSchema({
        user: {
          name,
          email,
          password: Crypto.createHash("sha512").update(password).digest("base64url"),
        },
      });
      const savedUser = await user.save();

      if (!savedUser) throw new CustomError("Error saving user", 500);

      return ApiResponse.success(res, 201, {
        message: "User created successfully",
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return ApiResponse.error(res, error.statusCode, error.getMessage());
      }

      return ApiResponse.error(res, 500, {
        message: "Internal server error",
      });
    }
  },
};

export default UserControllers;
