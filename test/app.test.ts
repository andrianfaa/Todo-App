import request from "supertest";
// import mongoose from "mongoose";
import { server } from "../app";

describe("GET /", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  // Success scenario
  it("should return 200", async () => {
    const response = await request(server).get("/").timeout(500);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Server is running");
  });

  // Error scenarios
  it("should return 500", async () => {
    const response = await request(server).post("/").timeout(500);

    expect(response.status).toBe(404);
  });
});
