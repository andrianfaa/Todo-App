import request from "supertest";
import { server } from "../../../app";
import { UserSchema } from "../../../src/schemas";
import { user as testUser } from "../../helpers/dummy_data";

jest.setTimeout(10000);

describe("Test the /user/signup endpoint", () => {
  const apiKey = process.env.API_KEY as string;

  afterAll(async () => {
    await UserSchema.deleteOne({ "user.email": testUser.email });
  });

  // Success scenario
  it("shoud be successful when all fields are valid and user is created", async () => {
    const response = await request(server)
      .post("/api/v1/user/signup")
      .set("x-api-key", apiKey)
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
  });

  // Error scenarios
  it("should return 400 when missing required fields", async () => {
    const response = await request(server)
      .post("/api/v1/user/signup")
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
      .post("/api/v1/user/signup")
      .set("x-api-key", apiKey)
      .send({
        ...testUser,
        email: "invalid email",
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email");
  });

  it("should return 400 when user already exists", async () => {
    const response = await request(server)
      .post("/api/v1/user/signup")
      .set("x-api-key", apiKey)
      .send(testUser);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already exists");
  });
});
