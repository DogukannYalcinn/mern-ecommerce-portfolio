import { Schema, model, Document } from "mongoose";

export interface IAdmin extends Document {
  username: string;
  password: string;
  role: string;
}

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const Admin = model("Admin", AdminSchema);

export default Admin;
