import mongoose, { Document, Schema } from 'mongoose';

export interface IHiringManager extends Document {
  username: string;
  password: string;
  companyName: string; 
  isApproved: boolean;
}

const HiringManagerSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  Name: { type: String }, 
  isApproved: { type: Boolean, default: false },
  jobIds: [{ type: Schema.Types.ObjectId, ref: 'Job' }]
});

const HiringManager = mongoose.model<IHiringManager>('HiringManager', HiringManagerSchema);

export default HiringManager;
