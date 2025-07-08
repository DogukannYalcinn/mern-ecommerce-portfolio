import mongoose, { Schema, model, Document } from "mongoose";
interface ICategory extends Document {
  _id: string;
  name: string;
  parentId: string | null;
  imageUrl: string;
  slug: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, lowercase: true, trim: true },
    parentId: { type: mongoose.Types.ObjectId, ref: "Category", default: null },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true },
);

const Category = model("Category", CategorySchema);

export default Category;
