import { Schema } from "mongoose";
import { IProduct } from "./product";

export type CartItemPopulated = {
  product: IProduct;
  quantity: number;
};

const CartSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);
export default CartSchema;
