import Crypto from "crypto";
import { model, Schema } from "mongoose";

export interface UserSchemaType {
  uid: string;
  accessToken: string;
  user: {
    name: string;
    email: string;
    password: string;
  };
  verified: boolean;
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
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

export default model<UserSchemaType>("User", UserSchema);
