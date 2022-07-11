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
  it("should be successful creating an activity", async () => {
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

  it("should be successful updating an activity", async () => {
    const updateActivity = await request(server)
      .put(`/api/v1/activity/${activityId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...activity,
        activityName: "Updated activity",
      });

    expect(updateActivity.status).toBe(200);
    expect(updateActivity.body.message).toBe("Activity updated successfully");
  });

  it("should be success when updating activity with some description", async () => {
    const response = await request(server)
      .put(`/api/v1/activity/${activityId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...activity,
        activityDescription: "Updated activity description",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Activity updated successfully");
  });

  it("should be success when updating an activity with missing required fields", async () => {
    const updateActivity = await request(server)
      .put(`/api/v1/activity/${activityId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        activityDescription: "",
        activityName: "",
      });

    expect(updateActivity.status).toBe(200);
    expect(updateActivity.body.message).toBe("Activity updated successfully");
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

  it("should be error when activity id is invalid", async () => {
    const response = await request(server)
      .put("/api/v1/activity/invalid")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...activity,
        activityName: "Updated activity",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Activity does not exist");
  });

  it("should be error when activity does not exist", async () => {
    const response = await request(server)
      .put("/api/v1/activity/5e8f8f8f8f8f8f8f8f8f8f8f")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...activity,
        activityName: "Updated activity",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Activity does not exist");
  });

  it("should be error when user is not authorized", async () => {
    const response = await request(server)
      .put(`/api/v1/activity/${activityId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .send({
        ...activity,
        activityName: "Updated activity",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});
