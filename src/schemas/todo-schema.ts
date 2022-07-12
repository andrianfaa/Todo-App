import { Schema, model } from "mongoose";
import Crypto from "crypto";

export interface TodoSchemaType {
  uid: string;
  activityId: string;
  todoId: string;
  todoTitle: string;
  todoDescription: string;
  isCompleted: boolean;
  priority: number;
  createdAt: number;
  updatedAt: number;
}

const TodoSchema = new Schema<TodoSchemaType>({
  uid: {
    type: String,
    required: true,
  },
  activityId: {
    type: String,
    required: true,
  },
  todoId: {
    type: String,
    default: () => Crypto.randomBytes(32).toString("base64url"),
  },
  todoTitle: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: Number,
    default: 0, // 0: low, 1: super low, 2: medium, 3: high, 4: super high
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
  updatedAt: {
    type: Number,
    default: Date.now,
  },
});

export default model<TodoSchemaType>("Todo", TodoSchema);
