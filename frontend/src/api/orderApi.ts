import axiosInstance from "@utils/axiosInstance.ts";
import { OrderType } from "@types";

const orderApi = {
  async fetchAllOrders({
    page = 1,
    limit = 10,
    filter = "",
  }: {
    page?: number;
    limit?: number;
    filter?: string;
    searchTerm?: string;
  }) {
    const response = await axiosInstance.get("/orders", {
      params: {
        page,
        limit,
        filter,
      },
    });
    return response.data;
  },
  async fetchAdminOrderById(id: string): Promise<OrderType> {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },
  async fetchUserOrderById(id: string): Promise<OrderType> {
    const response = await axiosInstance.get(`/orders/my-orders/${id}`);
    return response.data;
  },
  async createOrder({
    total,
    shippingAddress,
    paymentMethod,
    deliveryMethod,
    isGiftWrap,
  }: {
    total: number;
    shippingAddress: string;
    paymentMethod: string;
    deliveryMethod: string;
    isGiftWrap: boolean;
  }): Promise<void> {
    const response = await axiosInstance.post(`/orders`, {
      total,
      shippingAddress,
      paymentMethod,
      deliveryMethod,
      isGiftWrap,
    });
    return response.data;
  },
  async fetchUserOrders(
    status: string,
    date: Date | null,
    page: number,
    limit: number,
  ): Promise<{ orders: OrderType[]; totalCount: number }> {
    const dateParam = date ? encodeURIComponent(date.toISOString()) : "";
    const response = await axiosInstance.get(
      `/orders/my-orders?status=${status}&date=${dateParam}&page=${page}&limit=${limit}`,
    );
    return response.data;
  },
  async refundRequestOrder(orderId: string, reason: string) {
    const response = await axiosInstance.patch(`/orders/${orderId}/refund`, {
      reason,
    });
    return response.data;
  },
  async updateOrderStatus(orderId: string, status: string) {
    const response = await axiosInstance.patch(`/orders/${orderId}/status`, {
      status: status,
    });
    return response.data;
  },
};

export default orderApi;
