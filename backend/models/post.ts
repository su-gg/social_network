import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user"; 

interface IPost extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  content: string;
  createdAt: Date;
}

const PostSchema = new Schema<IPost>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },  
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPost>("Post", PostSchema);
