import { Schema, model } from "mongoose";
import Crypto from "crypto";

export interface UserSchemaType {
  uid: string;
  accessToken: string;
  user: {
    name: string;
    email: string;
    password: string;
  };
  createdAt: number;
}

const UserSchema = new Schema<UserSchemaType>({
  uid: {
    type: String,
    default: Crypto.randomUUID(),
  },
  accessToken: {
    type: String,
    default: Crypto.randomBytes(64).toString("base64url"),
  },
  user: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

export default model<UserSchemaType>("User", UserSchema);
