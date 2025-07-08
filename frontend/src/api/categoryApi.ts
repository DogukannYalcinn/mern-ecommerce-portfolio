import axiosInstance from "@utils/axiosInstance.ts";
import { CategoryType } from "@types";

const CategoryApi = {
  async fetchCategories(): Promise<CategoryType[]> {
    const response = await axiosInstance.get("/categories");
    return response.data;
  },
  async createCategory(formData: FormData) {
    const response = await axiosInstance.post("/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  async editCategory(categoryId: string, formData: FormData) {
    const response = await axiosInstance.put(
      `/categories/${categoryId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },
  async deleteCategory(categoryId: string) {
    const response = await axiosInstance.delete(`/categories/${categoryId}`);
    return response.data;
  },
};

export default CategoryApi;
