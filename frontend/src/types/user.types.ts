export type AddressType = {
  address: string;
  city: string;
  postalCode: string;
};

export type CartItem = {
  product: string;
  quantity: number;
};

export type UserStatsType = {
  completedOrderCount: number;
  reviewCount: number;
  favoriteCount: number;
  cancelledOrderCount: number;
};

export const DEFAULT_STATS: UserStatsType = {
  completedOrderCount: 0,
  reviewCount: 0,
  favoriteCount: 0,
  cancelledOrderCount: 0,
};

export type PaymentMethodType = {
  paymentMethod: "credit-card" | "paypal";
  cardHolderName?: string;
  cardMaskNumber?: string;
  paypalEmail?: string;
  cardNumber?: string;
};

export type UserRegisterType = Omit<
  UserType,
  "_id" | "cart" | "favorites" | "stats" | "paymentMethods" | "role"
> & {
  confirmPassword: string;
  password: string;
};

export type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  deliveryAddress: AddressType;
  homeAddress: AddressType;
  phoneNumber: string;
  cart: CartItem[];
  favorites: string[];
  stats: UserStatsType;
  paymentMethods: PaymentMethodType[];
  role: "user";
};

export type EditableUserType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  homeAddress: AddressType;
  deliveryAddress: AddressType;
};
