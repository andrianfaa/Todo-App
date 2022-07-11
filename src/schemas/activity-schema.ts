import { Schema, model } from "mongoose";
import Crypto from "crypto";

export interface ActivitySchema {
  uid: string;
  activityId: string;
  activityName: string;
  activityDescription: string;
  createdAt: number;
  updatedAt: number;
}

const ActivitySchema = new Schema<ActivitySchema>({
  uid: {
    type: String,
    required: true,
  },
  activityId: {
    type: String,
    default: Crypto.randomUUID(),
  },
  activityName: {
    type: String,
    required: true,
  },
  activityDescription: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
  updatedAt: {
    type: Number,
    default: Date.now(),
  },
});

export default model<ActivitySchema>("Activity", ActivitySchema);
