import axiosInstance from "@utils/axiosInstance.ts";
import { SliderType } from "../context/ProductContext.tsx";
import { Promo } from "@pages/admin/NotificationManager.tsx";
import { AnnouncementType } from "@pages/admin/AnnouncementManager.tsx";
import { AdminType, OrderRulesType } from "@types";

const adminApi = {
  async login(username: string, password: string): Promise<AdminType> {
    const response = await axiosInstance.post("/admin/login", {
      username,
      password,
    });
    return { ...response.data, role: "admin" as const };
  },

  async logout() {
    const response = await axiosInstance.post("/admin/logout");
    return response.data;
  },

  async getDashboard() {
    const response = await axiosInstance.get("/admin/dashboard");
    return response.data;
  },
  async getSlider(): Promise<SliderType[]> {
    const response = await axiosInstance.get(`/admin/slider`);
    return response.data;
  },

  async editSlider(sliderId: string, formData: FormData): Promise<SliderType> {
    const response = await axiosInstance.put(
      `/admin/slider/${sliderId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  async createSlider(formData: FormData): Promise<SliderType> {
    const response = await axiosInstance.post(`/admin/slider`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deleteSlider(sliderId: string): Promise<void> {
    const response = await axiosInstance.delete(`/admin/slider/${sliderId}`);
    return response.data;
  },

  async getPromos(): Promise<Promo[]> {
    const response = await axiosInstance.get(`/admin/promo`);
    return response.data;
  },

  async createPromo(message: string, link?: string): Promise<Promo> {
    const response = await axiosInstance.post(`/admin/promo`, {
      message,
      link,
    });
    return response.data;
  },

  async deletePromo(id: string): Promise<Promo> {
    const response = await axiosInstance.delete(`/admin/promo/${id}`);
    return response.data;
  },

  async fetchAnnouncements(): Promise<AnnouncementType[]> {
    const response = await axiosInstance.get(`/admin/announcement`);
    return response.data;
  },

  async createAnnouncement(formData: FormData): Promise<AnnouncementType> {
    const response = await axiosInstance.post(`/admin/announcement`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async toggleAnnouncement(
    announcementId: string,
    isActive: boolean,
  ): Promise<AnnouncementType> {
    const response = await axiosInstance.patch(
      `/admin/announcement/${announcementId}/toggle`,
      {
        isActive,
      },
    );
    return response.data;
  },

  async deleteAnnouncement(announcementId: string): Promise<AnnouncementType> {
    const response = await axiosInstance.delete(
      `/admin/announcement/${announcementId}`,
    );
    return response.data;
  },

  async fetchContacts(page: number, limit: number) {
    const response = await axiosInstance.get(`/admin/contacts`, {
      params: { page, limit },
    });
    return response.data;
  },

  async markContactAsRead(contactId: string): Promise<void> {
    const response = await axiosInstance.patch(
      `/admin/contacts/${contactId}/read`,
    );
    return response.data;
  },

  async fetchUnreadContactCount(): Promise<{ count: number }> {
    const response = await axiosInstance.get(`/admin/contacts/unread`);
    return response.data;
  },
  async fetchAllUsers({
    page = 1,
    limit = 10,
    searchTerm = "",
  }: {
    page?: number;
    limit?: number;
    searchTerm?: string;
  }) {
    const response = await axiosInstance.get("/users", {
      params: {
        page,
        limit,
        searchTerm,
      },
    });
    return response.data;
  },

  async editOrderRules(orderRules: OrderRulesType) {
    const response = await axiosInstance.put("/admin/order-rules", orderRules);
    return response.data;
  },
};
export default adminApi;
