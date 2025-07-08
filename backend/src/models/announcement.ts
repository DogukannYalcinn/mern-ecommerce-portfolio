import { Schema, model, Document } from "mongoose";

export interface IAnnouncement extends Document {
  message: string;
  backgroundImage: string;
  isActive: boolean;
  createdAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>({
  message: { type: String, required: true, lowercase: true },
  backgroundImage: { type: String, required: true },
  isActive: { type: Boolean, default: true },
},{ versionKey: false });

const Announcement = model<IAnnouncement>("Announcement", AnnouncementSchema);
export default Announcement;
