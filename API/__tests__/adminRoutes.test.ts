import express from "express";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import adminRoutes from "../src/routes/admin";
import HiringManager from "../src/models/HiringManger";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Optionally clear the database between tests
  await HiringManager.deleteMany({});
});

const app = express();
app.use(express.json());
app.use("/api/manager", adminRoutes);

describe("Admin Routes", () => {
  const adminToken = jwt.sign({ role: "admin" }, "your_jwt_secret");
  const nonAdminToken = jwt.sign({ role: "user" }, "your_jwt_secret");

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/manager/hiring-managers");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Access denied. No token provided.");
  });

  it("should return 403 if the user is not an admin", async () => {
    const res = await request(app)
      .get("/api/manager/hiring-managers")
      .set("Authorization", `Bearer ${nonAdminToken}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Access denied. Not an admin.");
  });

  it("should return a list of hiring managers for an admin", async () => {
    const hiringManager = new HiringManager({
      name: "Test Manager",
      email: "test@example.com",
      username: "testmanager",
      password: "securepassword",
    });
    await hiringManager.save();
  
    const res = await request(app)
      .get("/api/manager/hiring-managers")
      .set("Authorization", `Bearer ${adminToken}`);
  
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].username).toBe("testmanager");
  });
  
  it("should approve a hiring manager", async () => {
    const hiringManager = new HiringManager({
      name: "Test Manager",
      email: "test@example.com",
      username: "testmanager",
      password: "securepassword",
      isApproved: false,
    });
    await hiringManager.save();
  
    const res = await request(app)
      .patch(`/api/manager/hiring-managers/${hiringManager._id}/approve`)
      .set("Authorization", `Bearer ${adminToken}`);
  
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Hiring manager approved successfully");
  
    const updatedManager = await HiringManager.findById(hiringManager._id);
    expect(updatedManager?.isApproved).toBe(true);
  });
  
  it("should deny and remove a hiring manager", async () => {
    const hiringManager = new HiringManager({
      name: "Test Manager",
      email: "test@example.com",
      username: "testmanager",
      password: "securepassword",
    });
    await hiringManager.save();
  
    const res = await request(app)
      .delete(`/api/manager/hiring-managers/${hiringManager._id}/deny`)
      .set("Authorization", `Bearer ${adminToken}`);
  
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Hiring manager denied and removed successfully");
  
    const deletedManager = await HiringManager.findById(hiringManager._id);
    expect(deletedManager).toBeNull();
  });
});
