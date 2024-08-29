import mongoose, { Document, Schema } from "mongoose";

export interface IApplicantStatus {
  applicantId: mongoose.Schema.Types.ObjectId;
  status: "pending" | "accepted" | "declined";
}

export interface IJob extends Document {
  title: string;
  description: string;
  location: string;
  category: string;
  applicants: mongoose.Schema.Types.ObjectId[];
  hiringManagerId: mongoose.Schema.Types.ObjectId; 
  applicantStatuses: IApplicantStatus[];
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  hiringManagerId: {
    type: Schema.Types.ObjectId,
    ref: "HiringManager",
    required: true,
  },
  salary: { type: String, requried: true },
  postDate: { type: String, required: true },
  applicants: [{ type: Schema.Types.ObjectId, ref: "Applicant" }],
  applicantStatuses: [
    {
      applicantId: { type: Schema.Types.ObjectId, ref: "Applicant" },
      status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending",
      },
    },
  ],
});

const Job = mongoose.model<IJob>("Job", JobSchema);

export default Job;
