import type { Response } from "express";
import escapeHTML from "escape-html";
import type { TodoSchemaType } from "../schemas";
import { TodoSchema, ActivitySchema } from "../schemas";
import { ApiResponse } from "../helpers";
import { CustomError } from "../utils";

const TodoController = {
  // Create a todo
  createTodo: async (req: CustomRequest & {
    body: {
      activityId: string;
      todoTitle: string;
      priority: number;
      isCompleted: boolean;
    }
  }, res: Response) => {
    const {
      activityId, todoTitle, priority, isCompleted,
    } = req.body;
    const { uid } = req.user as { uid: string };

    if (!activityId || !todoTitle) {
      return ApiResponse.error(res, 400, {
        message: "Missing required fields",
      });
    }

    try {
      // Check if activity exists
      const activity = await ActivitySchema.findOne({ activityId });
      if (!activity) throw new CustomError("Activity not found", 404);

      if (activity.uid !== uid) throw new CustomError("You are not authorized to create todo for this activity", 403);

      // Create todo
      const todo = new TodoSchema({
        uid,
        activityId,
        todoTitle,
        priority,
        isCompleted,
      });
      const savedTodo = await todo.save();

      if (!savedTodo) throw new CustomError("Todo not created", 500);

      return ApiResponse.success<{ todoId: string }>(res, 201, {
        message: "Todo created",
        data: {
          todoId: savedTodo.todoId,
        },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return ApiResponse.error(res, error.statusCode, {
          message: error.message,
        });
      }

      return ApiResponse.error(res, 500, {
        message: "Internal server error",
      });
    }
  },

  // Get all todos
  getAllTodos: async (req: CustomRequest & {
    body: {
      activityId: string;
    }
  }, res: Response) => {
    const { activityId } = req.body;
    const { uid } = req.user as { uid: string };

    if (!activityId || !uid) {
      return ApiResponse.error(res, 400, {
        message: "Missing required fields",
      });
    }

    try {
      // Check if activity exists
      const activity = await ActivitySchema.findOne({ activityId });
      if (!activity) throw new CustomError("Activity not found", 404);

      // Check if user is the owner of the activity
      if (activity.uid !== uid) {
        return ApiResponse.error(res, 403, {
          message: "You are not the owner of this activity",
        });
      }

      // Get all todos
      const todos = await TodoSchema.find({ activityId, uid }).select("-_id -__v -uid -updateAt");

      return ApiResponse.success<{ todos: Pick<TodoSchemaType, "todoId" | "todoTitle" | "todoDescription" | "isCompleted" | "createdAt" | "priority">[] }>(res, 200, {
        message: "Fetched todos successfully",
        data: {
          todos,
        },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return ApiResponse.error(res, error.statusCode, {
          message: error.message,
        });
      }

      return ApiResponse.error(res, 500, {
        message: "Internal server error",
      });
    }
  },

  // Get a todo
  getTodo: async (req: CustomRequest & {
    body: { uid: string; activityId: string },
  }, res: Response) => {
    const { uid } = req.user as { uid: string };
    const { activityId } = req.body;
    const { id } = req.params as { id: string };

    if (!uid || !activityId || !id) {
      return ApiResponse.error(res, 400, {
        message: "Missing required fields",
      });
    }

    const todoId = escapeHTML(id);

    try {
      // Check if activity exists
      const activity = await ActivitySchema.findOne({ activityId });
      if (!activity) throw new CustomError("Activity not found", 404);

      // Check if user is the owner of the activity
      if (activity.uid !== uid) {
        return ApiResponse.error(res, 403, {
          message: "You are not the owner of this activity",
        });
      }

      // Check if todo exists
      const todo = await TodoSchema.findOne({ activityId, uid, todoId }).select("-_id -__v -uid -updatedAt");
      if (!todo) throw new CustomError("Todo not found", 404);

      return ApiResponse.success<{ todo: Pick<TodoSchemaType, "todoId" | "todoTitle" | "todoDescription" | "isCompleted" | "createdAt" | "priority"> }>(res, 200, {
        message: "Fetched todo successfully",
        data: {
          todo,
        },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return ApiResponse.error(res, error.statusCode, {
          message: error.message,
        });
      }

      return ApiResponse.error(res, 500, {
        message: "Internal server error",
      });
    }
  },

  // Update a todo
  updateTodo: async (req: CustomRequest & {
    body: {
      activityId: string;
      todoTitle: string;
      priority: number;
      isCompleted: boolean;
    }
  }, res: Response) => {
    const {
      activityId, todoTitle, priority, isCompleted,
    } = req.body;
    const { uid } = req.user as { uid: string };
    const { id } = req.params as { id: string };

    if (!activityId || !id || !uid) {
      return ApiResponse.error(res, 400, {
        message: "Missing required fields",
      });
    }

    const todoId = escapeHTML(id);

    try {
      // Check if activity exists
      const activity = await ActivitySchema.findOne({ activityId });
      if (!activity) throw new CustomError("Activity not found", 404);

      // Check if user is the owner of the activity
      if (activity.uid !== uid) {
        return ApiResponse.error(res, 403, {
          message: "You are not the owner of this activity",
        });
      }

      // Check if todo exists
      const todo = await TodoSchema.findOne({
        activityId,
        uid,
        todoId,
      });
      if (!todo) throw new CustomError("Todo not found", 404);

      if (priority && priority > 4) throw new CustomError("Invalid priority", 400);

      // Update todo
      const updatedTodo = await TodoSchema.findOneAndUpdate({ activityId, uid, todoId }, {
        todoTitle: todoTitle || todo.todoTitle,
        priority: parseInt(priority, 10) || todo.priority,
        isCompleted: isCompleted || todo.isCompleted,
        updatedAt: Date.now(),
      });
      if (!updatedTodo) throw new CustomError("Todo not updated", 500);

      return ApiResponse.success(res, 200, {
        message: "Todo updated",
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return ApiResponse.error(res, error.statusCode, {
          message: error.message,
        });
      }

      return ApiResponse.error(res, 500, {
        message: "Internal server error",
      });
    }
  },

  // Delete a todo
  deleteTodo: async (req: CustomRequest & {
    body: {
      activityId: string;
    }
  }, res: Response) => {
    const { activityId } = req.body;
    const { uid } = req.user as { uid: string };
    const { id } = req.params as { id: string };

    if (!activityId || !id || !uid) {
      return ApiResponse.error(res, 400, {
        message: "Missing required fields",
      });
    }

    const todoId = escapeHTML(id);

    try {
      // Check if activity exists
      const activity = await ActivitySchema.findOne({ activityId });
      if (!activity) throw new CustomError("Activity not found", 404);

      // Check if user is the owner of the activity
      if (activity.uid !== uid) {
        return ApiResponse.error(res, 403, {
          message: "You are not the owner of this activity",
        });
      }

      // Check if todo exists
      const todo = await TodoSchema.findOne({ activityId, uid, todoId });
      if (!todo) throw new CustomError("Todo not found", 404);

      // Delete todo
      const deletedTodo = await TodoSchema.findOneAndDelete({ activityId, uid, todoId });
      if (!deletedTodo) throw new CustomError("Todo not deleted", 500);

      return ApiResponse.success(res, 200, {
        message: "Todo deleted",
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return ApiResponse.error(res, error.statusCode, {
          message: error.message,
        });
      }

      return ApiResponse.error(res, 500, {
        message: "Internal server error",
      });
    }
  },
};

export default TodoController;
