import express from "express";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import routes from "../src/routes/hiringManager"; // Replace with your actual routes file
import Job from "../src/models/Jobs";
import HiringManager from "../src/models/HiringManger";
import Applicant from "../src/models/Applicant";

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
  await Job.deleteMany({});
  await HiringManager.deleteMany({});
  await Applicant.deleteMany({});
});

const app = express();
app.use(express.json());
app.use("/api", routes);

describe("Job Routes", () => {
  const hiringManagerToken = jwt.sign({ role: "hiringManager" }, "your_jwt_secret");
  const nonHiringManagerToken = jwt.sign({ role: "user" }, "your_jwt_secret");

  it("should return 401 if no token is provided when creating a job", async () => {
    const res = await request(app).post("/api/jobs").send({
      title: "Software Engineer",
      description: "Job description",
      location: "Remote",
      salary: 100000,
      userId: "60c72b2f9b1e8e1e88d3d78b",
      category: "Engineering",
      postDate: new Date(),
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Access denied. No token provided.");
  });

  it("should return 403 if the user is not a hiring manager when creating a job", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${nonHiringManagerToken}`)
      .send({
        title: "Software Engineer",
        description: "Job description",
        location: "Remote",
        salary: 100000,
        userId: "60c72b2f9b1e8e1e88d3d78b",
        category: "Engineering",
        postDate: new Date(),
      });
    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Access denied. Not an admin.");
  });

  it("should create a new job if the user is a hiring manager", async () => {
    const hiringManager = new HiringManager({
      username: "johndoe",
      password: "securepassword",
      companyName: "TechCorp",
      isApproved: true,
    });
    await hiringManager.save();

    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${hiringManagerToken}`)
      .send({
        title: "Software Engineer",
        description: "Job description",
        location: "Remote",
        salary: 100000,
        userId: hiringManager._id,
        category: "Engineering",
        postDate: new Date(),
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Software Engineer");
  });

  it("should get all jobs for a hiring manager", async () => {
    const hiringManager = new HiringManager({
      username: "johndoe",
      password: "securepassword",
      companyName: "TechCorp",
      isApproved: true,
    });
    await hiringManager.save();

    const job = new Job({
      title: "Software Engineer",
      description: "Job description",
      location: "Remote",
      hiringManagerId: hiringManager._id,
      salary: 100000,
      category: "Engineering",
      postDate: new Date(),
    });
    await job.save();

    const res = await request(app)
      .get(`/api/jobs?userId=${hiringManager._id}`)
      .set("Authorization", `Bearer ${hiringManagerToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Software Engineer");
  });

  it("should update a job", async () => {
    const hiringManager = new HiringManager({
      username: "johndoe",
      password: "securepassword",
      companyName: "TechCorp",
      isApproved: true,
    });
    await hiringManager.save();

    const job = new Job({
      title: "Software Engineer",
      description: "Job description",
      location: "Remote",
      hiringManagerId: hiringManager._id,
      salary: 100000,
      category: "Engineering",
      postDate: new Date(),
    });
    await job.save();

    const res = await request(app)
      .put(`/api/jobs/${job._id}`)
      .set("Authorization", `Bearer ${hiringManagerToken}`)
      .send({
        title: "Senior Software Engineer",
        description: "Updated job description",
        location: "Remote",
        salary: 120000,
        category: "Engineering",
        postDate: new Date(),
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Senior Software Engineer");
  });

  it("should delete a job", async () => {
    const hiringManager = new HiringManager({
      username: "johndoe",
      password: "securepassword",
      companyName: "TechCorp",
      isApproved: true,
    });
    await hiringManager.save();

    const job = new Job({
      title: "Software Engineer",
      description: "Job description",
      location: "Remote",
      hiringManagerId: hiringManager._id,
      salary: 100000,
      category: "Engineering",
      postDate: new Date(),
    });
    await job.save();

    const res = await request(app)
      .delete(`/api/jobs/${job._id}`)
      .set("Authorization", `Bearer ${hiringManagerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Job deleted successfully");

    const deletedJob = await Job.findById(job._id);
    expect(deletedJob).toBeNull();
  });

  it("should return a specific job by ID", async () => {
    const hiringManager = new HiringManager({
      username: "johndoe",
      password: "securepassword",
      companyName: "TechCorp",
      isApproved: true,
    });
    await hiringManager.save();

    const job = new Job({
      title: "Software Engineer",
      description: "Job description",
      location: "Remote",
      hiringManagerId: hiringManager._id,
      salary: 100000,
      category: "Engineering",
      postDate: new Date(),
    });
    await job.save();

    const res = await request(app)
      .get(`/api/jobs/${job._id}`)
      .set("Authorization", `Bearer ${hiringManagerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Software Engineer");
  });

  it("should accept an applicant for a job", async () => {
    const hiringManager = new HiringManager({
      username: "johndoe",
      password: "securepassword",
      companyName: "TechCorp",
      isApproved: true,
    });
    await hiringManager.save();

    const applicant = new Applicant({
      username: "janedoe",
      password: "applicantpassword",
      resume: {
        data: Buffer.from("resume data"),
        contentType: "application/pdf",
      },
    });
    await applicant.save();

    const job = new Job({
      title: "Software Engineer",
      description: "Job description",
      location: "Remote",
      hiringManagerId: hiringManager._id,
      salary: 100000,
      category: "Engineering",
      postDate: new Date(),
      applicantStatuses: [{ applicantId: applicant._id, status: "pending" }],
    });
    await job.save();

    const res = await request(app)
      .put(`/api/jobs/${job._id}/applicants/${applicant._id}/accept`)
      .set("Authorization", `Bearer ${hiringManagerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Applicant accepted");
    expect(res.body.job.applicantStatuses[0].status).toBe("accepted");
  });

  it("should decline an applicant for a job", async () => {
    const hiringManager = new HiringManager({
      username: "johndoe",
      password: "securepassword",
      companyName: "TechCorp",
      isApproved: true,
    });
    await hiringManager.save();

    const applicant = new Applicant({
      username: "janedoe",
      password: "applicantpassword",
      resume: {
        data: Buffer.from("resume data"),
        contentType: "application/pdf",
      },
    });
    await applicant.save();

    const job = new Job({
      title: "Software Engineer",
      description: "Job description",
      location: "Remote",
      hiringManagerId: hiringManager._id,
      salary: 100000,
      category: "Engineering",
      postDate: new Date(),
      applicantStatuses: [{ applicantId: applicant._id, status: "pending" }],
    });
    await job.save();

    const res = await request(app)
      .put(`/api/jobs/${job._id}/applicants/${applicant._id}/decline`)
      .set("Authorization", `Bearer ${hiringManagerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Applicant declined");
    expect(res.body.job.applicantStatuses[0].status).toBe("declined");
  });
});
