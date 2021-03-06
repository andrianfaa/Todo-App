import Crypto from "crypto";
import type { Request, Response } from "express";
import mailChecker from "mailchecker";
import EscapeHTML from "escape-html";
import { UserSchema } from "../schemas";
import { ApiResponse } from "../helpers";
import { CustomError, JSONWebToken, Mailer } from "../utils";

type SignupRequestBody = {
  name: string;
  email: string;
  password: string;
  projectUrl: string;
}

const UserControllers = {
  // Function to handle user signup request
  signup: async (req: Request & { body: SignupRequestBody }, res: Response) => {
    const {
      name, email, password, projectUrl,
    } = req.body;

    if (!name || !email || !password || !projectUrl) {
      return ApiResponse.error(res, 400, {
        message: "Missing required fields",
      });
    }

    try {
      const checkUser = await UserSchema.findOne({ "user.email": email });

      if (checkUser) throw new CustomError("User already exists", 400);
      if (!mailChecker.isValid(email)) throw new CustomError("Invalid email", 400);

      const user = new UserSchema({
        user: {
          name,
          email,
          password: Crypto.createHash("sha512").update(password).digest("hex"),
        },
      });
      const savedUser = await user.save();

      if (!savedUser) throw new CustomError("Error saving user", 500);

      const verificationToken = Crypto.createHash("sha256").update(savedUser.accessToken).digest("base64url");

      await Mailer<{ name: string, link: string }>({
        from: process.env.MAILER_FROM as string || "noreply@mail.andriann.co",
        to: email,
        template: "verification-email",
        subject: "Verify your email address",
        data: {
          name,
          link: `${projectUrl}/verify-email?email=${savedUser.user.email}&token=${verificationToken}`,
        },
      })
        .catch(async (err) => {
          await UserSchema.deleteOne({ uid: savedUser.uid });
          throw new CustomError(err.message, 500);
        });

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

  // Function to handle user login request
  login: async (req: Request & { body: Pick<SignupRequestBody, "email" | "password"> }, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.error(res, 400, {
        message: "Missing required fields",
      });
    }

    try {
      if (!mailChecker.isValid(email)) throw new CustomError("Invalid email", 400);

      const user = await UserSchema.findOne({ "user.email": email });
      const hashedPassword = Crypto.createHash("sha512").update(password).digest("hex");

      if (!user) throw new CustomError("User not found", 404);
      if (!user.verified) throw new CustomError("User not verified", 401);
      if (user.user.password !== hashedPassword) throw new CustomError("Invalid password", 400);

      const token = JSONWebToken.sign({
        uid: user.uid,
        accessToken: user.accessToken,
      });

      if (!token) throw new CustomError("Error generating token", 500);

      return ApiResponse.success(res, 200, {
        message: "User logged in successfully",
        data: {
          token,
          uid: user.uid,
        },
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

  // Function to handle user verification request
  verify: async (req: Request, res: Response) => {
    // Get token and email from query params
    // t is the token, e is the email
    // this is only to get the token and email from the query params
    const { t, e } = req.query as { t: string, e: string };

    if (!t || !e) {
      return ApiResponse.error(res, 400, {
        message: "Missing required fields",
      });
    }

    // Sanitize email and token to prevent XSS
    const token = EscapeHTML(t);
    const email = EscapeHTML(e);

    try {
      const user = await UserSchema.findOne({ "user.email": email });

      if (!user) throw new CustomError("User not found", 404);

      const hashedAccessToken = Crypto.createHash("sha256").update(user.accessToken).digest("base64url");

      if (hashedAccessToken !== token) throw new CustomError("Invalid token", 400);
      if (user.verified) throw new CustomError("User already verified", 400);

      const updatedUser = await UserSchema.findOneAndUpdate({ "user.email": email }, { $set: { verified: true } });

      if (!updatedUser) throw new CustomError("Error updating user", 500);

      return ApiResponse.success(res, 200, {
        message: "User verified successfully",
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

  getUser: async (req: CustomRequest, res: Response) => {
    const { uid } = req.user as { uid: string };

    if (!uid) {
      return ApiResponse.error(res, 400, {
        message: "Missing required fields",
      });
    }

    try {
      const user = await UserSchema.findOne({ uid }).select("-user.password -_id -__v -accessToken -uid -verified -createdAt");

      if (!user) throw new CustomError("User not found", 404);

      return ApiResponse.success(res, 200, {
        message: "User found successfully",
        data: user,
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
