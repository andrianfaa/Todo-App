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
  it("should be successful creating a todo", async () => {
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
    expect(response.body.data.todoId).toBeDefined();
  });

  it("should be successful getting a todo", async () => {
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

  it("should be successful getting all todos", async () => {
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
  it("should be unsuccessful creating a todo", async () => {
    const response = await request(server)
      .post("/api/v1/todo")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        activityId,
        todoTitle: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required fields");
  });

  it("should be unsuccessful creating a todo with invalid activityId", async () => {
    const response = await request(server)
      .post("/api/v1/todo")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        activityId: "invalid",
        todoTitle: "Test todo",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Activity not found");
  });

  it("should be unsuccessful creating a todo with invalid token", async () => {
    const response = await request(server)
      .post("/api/v1/todo")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", "Bearer invalid")
      .send({
        activityId,
        todoTitle: "Test todo",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should be unsuccessful creating a todo with invalid api key", async () => {
    const response = await request(server)
      .post("/api/v1/todo")
      .set("Content-Type", "application/json")
      .set("x-api-key", "invalid")
      .set("Authorization", `Bearer ${token}`)
      .send({
        activityId,
        todoTitle: "Test todo",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should be error when creating a todo with undefined activityId", async () => {
    const response = await request(server)
      .post("/api/v1/todo")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        todoTitle: "Test todo",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required fields");
  });

  it("should be error when creating a todo with undefined todoTitle", async () => {
    const response = await request(server)
      .post("/api/v1/todo")
      .set("Content-Type", "application/json")
      .set("x-api-key", apiKey)
      .set("Authorization", `Bearer ${token}`)
      .send({
        activityId,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required fields");
  });
});
