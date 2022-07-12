import Crypto from "crypto";
import request from "supertest";
import { server } from "../../../app";
import { UserSchema } from "../../../src/schemas";
import { activity, user as testUser } from "../../helpers/dummy_data";

describe("Test the /todo endpoint", () => {
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

    const createActivity = await request(server)
      .post("/api/v1/activity")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send(activity);

    activityId = createActivity.body.data.activityId;
  });

  afterAll(async () => {
    await UserSchema.deleteOne({ "user.email": testUser.email });
    await request(server)
      .delete(`/api/v1/activity/${activityId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`);
  });

  // Success scenario
  it("should be successful fetching all todos", async () => {
    const response = await request(server)
      .get("/api/v1/todo")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        activityId,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Fetched todos successfully");
    expect(response.body.data.todos).toBeDefined();
  });

  // Error scenario
  it("should be unsuccessful fetching all todos when the apikey is not defined", async () => {
    const response = await request(server)
      .get("/api/v1/todo")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should be successful fetching all todos when the token is not provided", async () => {
    const resposne = await request(server)
      .get("/api/v1/todo")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey);

    expect(resposne.status).toBe(401);
    expect(resposne.body.message).toBe("Unauthorized");
  });

  it("should be successful fetching all todos when the token is invalid", async () => {
    const resposne = await request(server)
      .get("/api/v1/todo")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}invalid`);

    expect(resposne.status).toBe(401);
    expect(resposne.body.message).toBe("Unauthorized");
  });

  it("should be unsuccessful fetching all todos when the token and apikey are not provided", async () => {
    const resposne = await request(server)
      .get("/api/v1/todo")
      .set("Content-Type", "application/json");

    expect(resposne.status).toBe(401);
    expect(resposne.body.message).toBe("Unauthorized");
  });
});
