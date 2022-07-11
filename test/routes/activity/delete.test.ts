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

  it("should be successful deleting an activity", async () => {
    const response = await request(server)
      .delete(`/api/v1/activity/${activityId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Activity deleted successfully");
  });

  // Error scenario
  it("should be unsuccessful deleting an activity", async () => {
    const response = await request(server)
      .delete(`/api/v1/activity/${activityId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Activity does not exist");
  });

  it("should be unsuccessful deleting an activity with invalid id", async () => {
    const response = await request(server)
      .delete("/api/v1/activity/invalid-id")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Activity does not exist");
  });

  it("should be error when deleting an aciivity with invalid token", async () => {
    const response = await request(server)
      .delete(`/api/v1/activity/${activityId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should be error when deleting an aciivity with invalid api key", async () => {
    const response = await request(server)
      .delete(`/api/v1/activity/${activityId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", "invalid-api-key")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should be error when deleting an activity with invalid token and api key", async () => {
    const response = await request(server)
      .delete(`/api/v1/activity/${activityId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", "invalid-api-key")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should be error when deleting an activity with undefined id", async () => {
    const response = await request(server)
      .delete("/api/v1/activity/")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(undefined);
  });
});
