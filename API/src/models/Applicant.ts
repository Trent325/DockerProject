import mongoose, { Document, Schema } from 'mongoose';

export interface IApplicant extends Document {
  username: string;
  password: string;
  resume: {
    data: Buffer;
    contentType: string;
  };
  name?: string;  // Optional field for the applicant's name
  school?: string;  // Optional field for the applicant's educational institution
  degrees?: string[];  // Optional array to store multiple degrees
  appliedJobs?: mongoose.Schema.Types.ObjectId[];
}

const ApplicantSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Path or URL to the resume file
  name: { type: String },  // Optional field for the applicant's name
  school: { type: String },  // Optional field for the applicant's educational institution
  degrees: [{ type: String }],
  resume: {
         data: Buffer,
         contentType: String
        },
  appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }]   
});

const Applicant = mongoose.model<IApplicant>('Applicant', ApplicantSchema);

export default Applicant;
