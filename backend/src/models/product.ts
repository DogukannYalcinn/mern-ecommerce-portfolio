import { Schema, model, Document } from "mongoose";
import { Types } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  title: string;
  price: number;
  description: string;
  slug: string;
  tags: string[];
  images: { _id?: Types.ObjectId; url: string }[];
  stock: number;
  discountedPrice: number;
  discountedRatio: number;
  categoryIds: string[];
  isBoosted: boolean;
  averageRating: number;
  totalReviews: number;
  brand: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, lowercase: true },
    price: { type: Number, required: true },
    description: { type: String, required: true, lowercase: true, trim: true },
    stock: { type: Number, required: true },
    brand: { type: String, required: true, lowercase: true },
    isBoosted: { type: Boolean, required: true, default: false },
    slug: { type: String, required: true, lowercase: true },
    tags: { type: [String], required: true, lowercase: true },
    images: [
      {
        url: { type: String, required: true, lowercase: true },
      },
    ],
    discountedPrice: { type: Number, default: 0 },
    discountedRatio: { type: Number, default: 0 },
    categoryIds: [
      { type: Schema.Types.ObjectId, ref: "Category", required: true },
    ],
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ProductSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  brand: "text",
});

ProductSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

const Product = model("Product", ProductSchema);

export default Product;
