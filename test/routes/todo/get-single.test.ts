import Crypto from "crypto";
import request from "supertest";
import { server } from "../../../app";
import { UserSchema } from "../../../src/schemas";
import { activity, user as testUser } from "../../helpers/dummy_data";

describe("Test the /todo endpoint", () => {
  let token: string;
  let activityId: string;
  let todoId: string;

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
  it("should be successful create a todo", async () => {
    const response = await request(server)
      .post("/api/v1/todo")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        activityId,
        todoTitle: "Test todo",
      });

    todoId = response.body.data.todoId;

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Todo created");
  });

  it("should be successful fetching a todo", async () => {
    const response = await request(server)
      .get(`/api/v1/todo/single/${todoId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        activityId,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Fetched todo successfully");
    expect(response.body.data.todo).toBeDefined();
  });

  it("should be unsuccessful fetching a todo when the apikey is not defined", async () => {
    const response = await request(server)
      .get(`/api/v1/todo/single/${todoId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should be unsuccessful fetching a todo when the apikey is not correct", async () => {
    const response = await request(server)
      .get(`/api/v1/todo/single/${todoId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", "wrong-key")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should be unsuccessful fetching a todo when the token is not defined", async () => {
    const response = await request(server)
      .get(`/api/v1/todo/single/${todoId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should be unsuccessful fetching a todo when the token is not correct", async () => {
    const response = await request(server)
      .get(`/api/v1/todo/single/${todoId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}invalid`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should be unsuccessful fetching a todo when the activityId is not defined", async () => {
    const response = await request(server)
      .get(`/api/v1/todo/single/${todoId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required fields");
  });

  it("should be unsuccessful fetching a todo when the activityId is not correct", async () => {
    const response = await request(server)
      .get(`/api/v1/todo/single/${todoId}`)
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        activityId: "invalid",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Activity not found");
  });

  it("should be unsuccessful a todo when todoId is not defined", async () => {
    const response = await request(server)
      .get("/api/v1/todo/single/")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        activityId,
      });

    expect(response.status).toBe(404);
  });

  it("should be unsuccessful a todo when todoId is not correct", async () => {
    const response = await request(server)
      .get("/api/v1/todo/single/invalid")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        activityId,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Todo not found");
  });
});
