import Crypto from "crypto";
import request from "supertest";
import { server } from "../../../app";
import { UserSchema, ActivitySchema } from "../../../src/schemas";
import { user as testUser, activity } from "../../helpers/dummy_data";

describe("Test the /activity endpoint", () => {
  let token: string;
  let activityId: string;

  const apiKey = process.env.API_KEY as string;

  beforeAll(async () => {
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

    token = response.body.data.token || "";
  });

  afterAll(async () => {
    await UserSchema.deleteOne({ "user.email": testUser.email });
    await ActivitySchema.deleteOne({ activityId });
  });

  // Success scenario
  it("should be successful when all fields are valid", async () => {
    const response = await request(server)
      .post("/api/v1/activity")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send(activity);

    activityId = response.body.data.activityId;

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Activity created successfully");
  });

  // Error scenarios
  it("should return 400 when missing required fields", async () => {
    const response = await request(server)
      .post("/api/v1/activity")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        activityDescription: "",
        activityName: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required fields");
  });

  it("should return 400 when activity name is invalid", async () => {
    const response = await request(server)
      .post("/api/v1/activity")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...activity,
        activityName: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required fields");
  });

  it("should return 400 when activity description is invalid", async () => {
    const response = await request(server)
      .post("/api/v1/activity")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...activity,
        activityDescription: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required fields");
  });

  it("should return 401 when user is not logged in", async () => {
    const response = await request(server)
      .post("/api/v1/activity")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .send(activity);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});
