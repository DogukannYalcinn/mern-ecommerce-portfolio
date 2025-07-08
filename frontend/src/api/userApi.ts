import axiosInstance from "@utils/axiosInstance.ts";
import {
  UserType,
  PaymentMethodType,
  UserStatsType,
  CartItem,
  UserRegisterType,
} from "@types";
import { ContactForm } from "@pages/ContactPage.tsx";

const userApi = {
  async register(userCredentials: UserRegisterType) {
    const response = await axiosInstance.post("/users/register", {
      ...userCredentials,
    });
    return response.data;
  },
  async login(
    email: string,
    password: string,
  ): Promise<{ user: UserType; accessToken: string }> {
    const response = await axiosInstance.post("/users/login", {
      email,
      password,
    });
    const userWithRole = { ...response.data.user, role: "user" as const };

    return {
      user: userWithRole,
      accessToken: response.data.accessToken,
    };
  },
  async logout(): Promise<void> {
    await axiosInstance.post("/users/logout");
  },
  async editProfile(userData: Partial<UserType>): Promise<UserType> {
    const response = await axiosInstance.put(`/users`, userData);
    return response.data;
  },
  async updateCart(cart: CartItem[]): Promise<CartItem[]> {
    const response = await axiosInstance.put(`/users/cart`, {
      cart,
    });
    return response.data;
  },
  async refreshToken() {
    const response = await axiosInstance.post("/users/refresh-token");
    return response.data;
  },
  async checkSession(): Promise<{ user: UserType; accessToken: string }> {
    const response = await axiosInstance.get("/users/check-session");
    const userWithRole = { ...response.data.user, role: "user" as const };
    return {
      user: userWithRole,
      accessToken: response.data.accessToken,
    };
  },
  async createUserReview(productId: string, rating: number, comment: string) {
    const response = await axiosInstance.post("/users/review", {
      productId,
      comment,
      rating,
    });
    return response.data;
  },
  async toggleFavorite(productId: string): Promise<string[]> {
    const response = await axiosInstance.patch("/users/toggle-favorite", {
      productId,
    });
    return response.data;
  },
  async fetchUserStats(): Promise<UserStatsType> {
    const response = await axiosInstance.get(`/users/stats`);
    return response.data;
  },
  async getUnreadNotifications(userId?: string) {
    const url = userId
      ? `/users/notifications/unread-count?userId=${userId}`
      : `/users/notifications/unread-count`;

    const response = await axiosInstance.get(url);
    return response.data;
  },
  async getUserNotifications({
    page,
    limit,
    userId,
  }: {
    page: number;
    limit: number;
    userId?: string;
  }) {
    const query = [`page=${page}`, `limit=${limit}`];

    if (userId) {
      query.push(`userId=${userId}`);
    }

    const url = `/users/notifications?${query.join("&")}`;

    const response = await axiosInstance.get(url);
    return response.data;
  },
  async markNotificationsAsRead(unreadIds: string[]) {
    const response = await axiosInstance.patch(`/users/notifications/read/`, {
      ids: unreadIds,
    });
    return response.data;
  },
  async addPaymentMethod({
    paymentMethod,
    cardNumber,
    cardHolderName,
    paypalEmail,
  }: {
    paymentMethod: string;
    cardNumber?: string;
    cardHolderName?: string;
    paypalEmail?: string;
  }) {
    const response: { data: PaymentMethodType[] } = await axiosInstance.post(
      `/users/payment-method`,
      {
        method: paymentMethod,
        cardNumber,
        cardHolderName,
        paypalEmail,
      },
    );
    return response.data;
  },
  async deletePaymentMethod(method: string) {
    const response: { data: PaymentMethodType[] } = await axiosInstance.delete(
      `/users/payment-method/${method}`,
    );
    return response.data;
  },
  async postContactForm({ fullName, email, subject, message }: ContactForm) {
    const response = await axiosInstance.post(`/users/contact`, {
      fullName,
      email,
      subject,
      message,
    });
    return response.data;
  },
};

export default userApi;
