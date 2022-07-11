import jwt from "jsonwebtoken";

const JSONWebToken = {
  /**
   * Generates a JWT token for the given user.
   * @param payload - payload to be encoded in the token
   * @param exp - expiration time in seconds
   * @example JSONWebToken.encode({ userId: "123" }, "1d");
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sign: (payload: any, exp = "1d"): string => {
    const jwtSecret = process.env.JWT_SECRET as string;

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: exp,
    });

    return token;
  },

  /**
   * Decodes a JWT token and returns the payload.
   * @param token - JWT token to be decoded
   * @example JSONWebToken.verify(__token__);
   */
  verify: async <T>(token: string): Promise<null | T> => {
    const jwtSecret = process.env.JWT_SECRET as string;

    try {
      const payload = await jwt.verify(token, jwtSecret);
      return payload as T;
    } catch (error) {
      return null;
    }
  },
};

export default JSONWebToken;
