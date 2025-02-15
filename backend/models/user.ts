import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document { 
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  gender?: "homme" | "femme" | "autre";
  birthDate?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["homme", "femme", "autre"], default: "autre" },
  birthDate: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },  
  resetPasswordExpires: { type: Date, default: null },  
}, { timestamps: true });

export default mongoose.model<IUser>("User", UserSchema);
