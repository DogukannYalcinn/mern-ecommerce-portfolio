import { Schema, model, Document, Types } from "mongoose";
import CartSchema from "./cart";
import { AddressType, AddressSchema } from "./address";

export interface IPaymentMethod {
  paymentMethod: "credit-card" | "paypal";
  cardHolderName?: string;
  cardMaskNumber?: string;
  paypalEmail?: string;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    paymentMethod: {
      type: String,
      enum: ["credit-card", "paypal"],
      required: true,
    },
    cardHolderName: { type: String },
    cardMaskNumber: { type: String },
    paypalEmail: { type: String },
  },
  { timestamps: true },
);

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  refreshTokens: string[];
  homeAddress: AddressType;
  deliveryAddress: AddressType;
  phoneNumber: string;
  cart: { product: Types.ObjectId; quantity: number }[];
  favorites: Types.ObjectId[];
  paymentMethods: IPaymentMethod[];
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    refreshTokens: [{ type: String }],
    homeAddress: AddressSchema,
    deliveryAddress: AddressSchema,
    favorites: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    cart: [CartSchema],
    paymentMethods: [PaymentMethodSchema],
  },
  { timestamps: true },
);

UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

const User = model<IUser>("User", UserSchema);
export default User;
