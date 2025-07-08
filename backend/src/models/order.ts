import { Schema, model, Document } from "mongoose";
import { AddressType, AddressSchema } from "./address";
import { statusNotificationMap } from "../constants";
import Notification from "./notification";

export interface IOrder extends Document {
  user: Schema.Types.ObjectId;
  cart: {
    product: Schema.Types.ObjectId;
    purchasePrice: number;
    purchaseDiscountRatio: number;
    quantity: number;
  }[];
  total: number;
  statusHistory: { status: string; timestamp?: Date }[];
  deliveryAddress: AddressType;
  deliveryMethod: string;
  deliveryMethodFee: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentMethodFee: number;
  trackingNumber: string;
  giftWrapFee: number;
  cancellationReason: string;
  currentStatus: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        purchasePrice: {
          type: Number,
          required: true,
        },
        purchaseDiscountRatio: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    total: { type: Number, required: true },
    paymentMethodFee: { type: Number, required: true, default: 0 },
    deliveryMethodFee: { type: Number, required: true, default: 0 },
    giftWrapFee: { type: Number, required: true, default: 0 },
    statusHistory: {
      type: [
        {
          status: {
            type: String,
            required: true,
            enum: [
              "pending",
              "completed",
              "cancelled",
              "in_transit",
              "refund_request",
              "placed",
            ],
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [{ status: "pending", timestamp: new Date() }],
    },

    currentStatus: {
      type: String,
      required: true,
      enum: [
        "pending",
        "completed",
        "cancelled",
        "in_transit",
        "refund_request",
        "placed",
      ],
      default: "pending",
    },
    deliveryAddress: AddressSchema,
    paymentMethod: {
      type: String,
      required: true,
    },
    deliveryMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    trackingNumber: String,
    cancellationReason: String,
  },
  { timestamps: true },
);

OrderSchema.pre("save", function (next) {
  if (this.isModified("statusHistory") && this.statusHistory.length > 0) {
    const latestStatus = this.statusHistory.at(-1)?.status;
    if (latestStatus) {
      this.currentStatus = latestStatus;
    }
  }
  next();
});

OrderSchema.post("save", async function (doc, next) {
  const latestStatus = doc.currentStatus;
  const notificationType = statusNotificationMap[latestStatus];

  if (!notificationType) return next();

  await Notification.create({
    user: doc.user,
    type: notificationType,
    message: `Your order #${doc._id} is now ${latestStatus.replace("_", " ")}.`,
    isRead: false,
    createdAt: new Date(),
    link: `/account/orders/${doc._id}`,
  });

  next();
});

const Order = model<IOrder>("Order", OrderSchema);
export default Order;
