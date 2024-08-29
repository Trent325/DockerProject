import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  isHiringManager: boolean; // Add this field
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isHiringManager: { type: Boolean, default: false } // Default to false for regular users
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;