import { Request } from "express";
import product from "./models/product";
export interface UserCredentials {
  username: string;
  password: string;
  age: number;
  address: { city: string; street: string };
  cart: [productId: string, quantity: number];
}

export interface AuthRequest extends Request {
  authenticatedUserId?: string | null;
}

export const statusNotificationMap: Record<string, string> = {
  pending: "order_pending",
  placed: "order_placed",
  in_transit: "order_in_transit",
  completed: "order_completed",
  cancelled: "order_cancelled",
  refund_request: "order_refund_request",
};
