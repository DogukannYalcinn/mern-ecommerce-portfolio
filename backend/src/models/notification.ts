import { Schema, model, Document, ObjectId } from "mongoose";

export interface INotification extends Document {
  user: ObjectId | null;
  message: string;
  type:
    | "order_placed"
    | "order_cancelled"
    | "order_in_transit"
    | "order_completed"
    | "refund_issued"
    | "promo";
  isRead: boolean;
  createdAt: Date;
  link?: string;
}

const NotificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: "User", default: null },
  message: { type: String, required: true, lowercase: true },
  type: {
    type: String,
    enum: [
      "order_pending",
      "order_placed",
      "order_in_transit",
      "order_completed",
      "order_cancelled",
      "order_refund_request",
      "promo",
    ],
    required: true,
  },
  isRead: { type: Boolean, default: false },
  link: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Notification = model("Notification", NotificationSchema);
export default Notification;
