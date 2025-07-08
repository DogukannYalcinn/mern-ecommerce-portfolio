import { ProductType, UserType, AddressType, CartProduct } from "@types";

export type OrderStatusHistoryItem = {
  _id: string;
  status: string;
  timestamp: Date;
};

export type OrderCartItem = {
  product: ProductType;
  purchasePrice: number;
  purchaseDiscountRatio: number;
  quantity: number;
};

export type OrderType = {
  _id: string;
  user: UserType;
  cart: OrderCartItem[];
  total: number;
  statusHistory: OrderStatusHistoryItem[];
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
  createdAt: string;
};

export type OrderValidationType = {
  paymentMethod: string | null;
  shippingAddress: string | null;
  deliveryMethod: string | null;
  cart: CartProduct[];
};

export type PaymentDeliveryMethod  = {
  label: string;
  identifier: string;
  fee: number;
  description: string;
};

export type OrderRulesType = {
  paymentMethods: PaymentDeliveryMethod[];
  deliveryMethods: PaymentDeliveryMethod[];
  giftWrapFee: number;
  taxRate: number;
  freeShippingThreshold: number;
};

export type UIMethodOption = PaymentDeliveryMethod & {
  isAddMode?: boolean;
  addLink?: string;
};