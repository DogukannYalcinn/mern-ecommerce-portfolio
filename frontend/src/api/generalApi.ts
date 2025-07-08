import axiosInstance from "@utils/axiosInstance.ts";
import { SliderType } from "../context/ProductContext.tsx";
import { OrderRulesType } from "@types";

const generalApi = {
  async fetchActiveAnnouncement() {
    const response = await axiosInstance.get("/generals/announcements");
    return response.data;
  },

  async fetchOrderRules(): Promise<OrderRulesType> {
    const response = await axiosInstance.get(`/generals/order-rules`);
    return response.data;
  },

  async fetchSliders(): Promise<SliderType[]> {
    const response = await axiosInstance.get(`/generals/sliders`);
    return response.data;
  },
  async fetchMostPopularBrands() {
    const response = await axiosInstance.get("/generals/most-popular-brands");
    return response.data;
  },
};

export default generalApi;
