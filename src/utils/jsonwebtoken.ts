import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;
if (!jwtSecret) throw new Error("JWT_SECRET is not set");

const JSONWebToken = {
  /**
   * Generates a JWT token for the given user.
   * @param payload - payload to be encoded in the token
   * @param exp - expiration time in seconds
   * @example JSONWebToken.encode({ userId: "123" }, "1d");
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sign: (payload: any, exp = "1d"): string => jwt.sign(payload, jwtSecret, {
    expiresIn: exp,
  }),

  /**
   * Decodes a JWT token and returns the payload.
   * @param token - JWT token to be decoded
   * @example JSONWebToken.verify(__token__);
   */
  verify: <T>(token: string): T => jwt.verify(token, jwtSecret) as T,
};

export default JSONWebToken;
