import Crypto from "crypto";
import request from "supertest";
import { server } from "../../../app";
import { UserSchema } from "../../../src/schemas";
import { user as testUser } from "../../helpers/dummy_data";

describe("Test the /user/login endpoint", () => {
  const apiKey = process.env.API_KEY as string;

  afterAll(async () => {
    await UserSchema.deleteOne({ "user.email": testUser.email });
  });

  // Success scenario
  it("shoud be successful when all fields are valid and response contains user token", async () => {
    await UserSchema.create({
      user: {
        ...testUser,
        password: Crypto.createHash("sha512").update(testUser.password).digest("hex"),
      },
      verified: true,
    });

    const response = await request(server)
      .post("/api/v1/user/login")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .send(testUser);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User logged in successfully");
    expect(response.body.data.token).toBeDefined();
  });

  // Error scenarios
  it("should return 400 when missing required fields", async () => {
    const response = await request(server)
      .post("/api/v1/user/login")
      .set("x-api-key", apiKey)
      .send({
        name: "Test User",
        email: "",
        pass: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required fields");
  });

  it("should return 400 when email is invalid", async () => {
    const response = await request(server)
      .post("/api/v1/user/login")
      .set("x-api-key", apiKey)
      .send({
        ...testUser,
        email: "invalid email",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email");
  });

  it("should return 400 when user does not exist", async () => {
    const response = await request(server)
      .post("/api/v1/user/login")
      .set("x-api-key", apiKey)
      .send({
        ...testUser,
        email: "test@andriann.co",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should return 400 when password is invalid", async () => {
    const response = await request(server)
      .post("/api/v1/user/login")
      .set("x-api-key", apiKey)
      .send({
        ...testUser,
        password: "test",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid password");
  });

  it("should return 400 when user is not verified", async () => {
    await UserSchema.updateOne({
      "user.email": testUser.email,
    }, {
      $set: {
        verified: false,
      },
    });

    const response = await request(server)
      .post("/api/v1/user/login")
      .set("x-api-key", apiKey)
      .send({
        ...testUser,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("User not verified");
  });
});
