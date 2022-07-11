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
  });

  // Success scenario
  it("should be successful fetching all activities", async () => {
    const response = await request(server)
      .get("/api/v1/activity")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Fetched activities successfully");
  });

  it("should be successful fetching a single activity", async () => {
    const createActivity = await request(server)
      .post("/api/v1/activity")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send(activity);

    activityId = createActivity.body.data.activityId;

    const response = await request(server)
      .get("/api/v1/activity")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Fetched activities successfully");
    expect(response.body.data.activity).toBeDefined();

    await ActivitySchema.deleteOne({ activityId });
  });

  // Error scenarios
  it("should return 401 when missing required fields", async () => {
    const response = await request(server)
      .get("/api/v1/activity")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should return 401 when user is not logged in", async () => {
    const response = await request(server)
      .get("/api/v1/activity")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});
