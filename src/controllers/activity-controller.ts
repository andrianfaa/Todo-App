import type { Response } from "express";
import Crypto from "crypto";
import EscapeHTML from "escape-html";
import { CustomError } from "../utils";
import { ActivitySchema, UserSchema } from "../schemas";
import { ApiResponse } from "../helpers";

interface CreateActivityRequestBody {
  uid: string;
  activityName: string;
  activityDescription: string;
}

interface ActivityType {
  uid: string;
  activityId: string;
  activityName: string;
  activityDescription: string;
  createdAt: number;
  updatedAt?: number;
}

const ActivityControllers = {
  // Function to handle create new activity
  create: async (req: CustomRequest & { body: CreateActivityRequestBody }, res: Response) => {
    const { activityName, activityDescription } = req.body;
    const { uid } = req.user as { uid: string };

    if (!activityName || !activityDescription) {
      return ApiResponse.error(res, 400, {
        message: "Missing required fields",
      });
    }

    try {
      // Check if user exists
      const user = await UserSchema.findOne({ uid });
      if (!user) throw new CustomError("Unauthorized", 401);

      const activity = new ActivitySchema({
        uid,
        activityId: Crypto.randomUUID(),
        activityName,
        activityDescription,
      });
      const savedActivity = await activity.save();

      if (!savedActivity) throw new CustomError("Error saving activity", 500);

      return ApiResponse.success(res, 201, {
        message: "Activity created successfully",
        data: {
          activityId: savedActivity.activityId,
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

  // Function to handle get all activities
  getAll: async (req: CustomRequest, res: Response) => {
    const { uid } = req.user as { uid: string };

    if (!uid) {
      return ApiResponse.error(res, 400, {
        message: "Missing required fields",
      });
    }

    try {
      // Check if user exists
      const user = await UserSchema.findOne({ uid });
      if (!user) throw new CustomError("Unauthorized", 401);

      const activities = await ActivitySchema.find({ uid }).select("-__v -uid -_id");

      return ApiResponse.success<{ activity: ActivityType[] }>(res, 200, {
        message: "Fetched activities successfully",
        data: {
          activity: activities,
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

  // Function to handle delete activity
  delete: async (req: CustomRequest & { body: Pick<ActivityType, "activityId"> }, res: Response) => {
    const { id } = req.params as { id: string };
    const { uid } = req.user as { uid: string };

    const activityId = EscapeHTML(id);

    if (!uid || !activityId) {
      return ApiResponse.error(res, 400, {
        message: "Missing required fields",
      });
    }

    try {
      // Check if user exists
      const user = await UserSchema.findOne({ uid });
      if (!user) throw new CustomError("Unauthorized", 401);

      // check if activity exists
      const activity = await ActivitySchema.findOne({ uid, activityId });
      if (!activity) throw new CustomError("Activity does not exist", 404);

      const deletedActivity = await activity.remove();

      if (!deletedActivity) throw new CustomError("Error deleting activity", 500);

      return ApiResponse.success(res, 200, {
        message: "Activity deleted successfully",
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

  // Function to handle update activity
  update: async (req: CustomRequest & { body: Pick<ActivityType, "activityName" | "activityDescription"> }, res: Response) => {
    const { id } = req.params as { id: string };
    const {
      activityName, activityDescription,
    } = req.body;
    const { uid } = req.user as { uid: string };

    const activityId = EscapeHTML(id);

    if (!uid || !activityId) {
      return ApiResponse.error(res, 400, {
        message: "Missing required fields",
      });
    }

    try {
      // Check if user exists
      const user = await UserSchema.findOne({ uid, activityId });
      if (!user) throw new CustomError("Unauthorized", 401);

      // check if activity exists
      const activity = await ActivitySchema.findOne({ uid, activityId });
      if (!activity) throw new CustomError("Activity does not exist", 404);

      // update activity
      const updatedActivity = await activity.updateOne({
        activityName: activityName || activity.activityName,
        activityDescription: activityDescription || activity.activityDescription,
      });

      if (!updatedActivity) throw new CustomError("Error updating activity", 500);

      return ApiResponse.success(res, 200, {
        message: "Activity updated successfully",
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

export default ActivityControllers;
