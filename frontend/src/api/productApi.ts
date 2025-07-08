import axiosInstance from "@utils/axiosInstance.ts";
import { ProductType } from "@types";

const productApi = {
  async fetchProducts({
    page,
    brands,
    limit,
    maxPrice,
    minPrice,
    sort,
    categorySlugs,
  }: {
    page?: number;
    brands?: string[];
    limit?: number;
    maxPrice?: number | null;
    minPrice?: number | null;
    sort?: string;
    categorySlugs?: string[];
  }): Promise<{ products: ProductType[]; totalCount: number }> {
    const params: Record<string, any> = {};

    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (sort) params.sort = sort;
    if (brands?.length) params.brands = brands.join(",");
    if (categorySlugs?.length) params.categorySlugs = categorySlugs.join(",");
    if (typeof minPrice === "number") params.minPrice = minPrice;
    if (typeof maxPrice === "number") params.maxPrice = maxPrice;

    const response = await axiosInstance.get(`/products`, { params });
    return response.data;
  },
  async fetchSearchProducts({
    query,
    page = 1,
    limit = 5,
    filter,
  }: {
    query: string[];
    page?: number;
    limit?: number;
    filter?: string;
  }) {
    const q = query.join(",");
    const response = await axiosInstance.get(
      `/products/search?q=${q}&page=${page}&limit=${limit}&filter=${filter}`,
    );
    return response.data;
  },
  async fetchProductsByIds(productIds: string[]): Promise<ProductType[]> {
    const response = await axiosInstance.post(`/products/bulk`, {
      productIds: productIds,
    });
    return response.data;
  },
  async fetchProductBySlug(slug: string): Promise<ProductType> {
    const response = await axiosInstance.get(`/products/${slug}`);
    return response.data;
  },
  async fetchOnSaleProducts(): Promise<ProductType[]> {
    const response = await axiosInstance.get(`/products/on-sale`);
    return response.data;
  },
  async fetchBestSellerProducts(): Promise<ProductType[]> {
    const response = await axiosInstance.get(`/products/best-sellers`);
    return response.data;
  },
  async fetchNewArrivalProducts(): Promise<ProductType[]> {
    const response = await axiosInstance.get(`/products/new-arrivals`);
    return response.data;
  },
  async fetchBoostedProducts(): Promise<ProductType[]> {
    const response = await axiosInstance.get(`/products/featured`);
    return response.data;
  },
  async fetchProductReviews(productId: string) {
    const response = await axiosInstance.get(`/products/${productId}/reviews`);
    return response.data;
  },

  //Admin
  async createProduct(product: FormData) {
    const response = await axiosInstance.post("/products", product, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  async updateProduct(
    productId: string,
    product: FormData,
  ): Promise<ProductType> {
    const response = await axiosInstance.put(
      `/products/${productId}`,
      product,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },
  async deleteProductImage(productId: string, imageId: string): Promise<void> {
    const response = await axiosInstance.delete(
      `/products/${productId}/images/${imageId}`,
    );
    return response.data;
  },
  async deleteProduct(productId: string): Promise<void> {
    const response = await axiosInstance.delete(`/products/${productId}`);
    return response.data;
  },
};

export default productApi;

// const API_BASE_URL = 'https://localhost:4000';

// Fetch version
// const api = {
//
//   async fetchProducts():Promise<Product[]>{
//     const response = fetch(API_BASE_URL,{
//       method:"GET",
//       headers:{'Content-Type':"application/json"}
//     });
//     if(!response.ok){
//       throw  new Error(`HTTP error! status:${response.status}`)
//     }
//     return await response.json();
//   },
//
//   async addProduct(product:Omit<Product, "id">):Promise<Product>{
//     const response = await fetch(API_BASE_URL,{
//       method:"POST",
//       headers:{'Content-Type':"application/json"},
//       body :JSON.stringify(product)
//     });
//     if(!response.ok){
//       throw  new Error(`HTTP error! status:${response.status}`)
//     }
//     return await response.json();
//   },
//
//   async updateProduct(product:Partial<Product>):Promise<Product>{
//     const response = await fetch(API_BASE_URL,{
//       method:"PUT",
//       headers:{'Content-Type':"application/json"},
//       body :JSON.stringify(product)
//     });
//     if(!response.ok){
//       throw  new Error(`HTTP error! status:${response.status}`)
//     }
//     return await response.json();
//   },
//
//   async removeProduct(id:string){
//     const response = await fetch(API_BASE_URL,{
//       method:"DELETE",
//       headers:{'Content-Type':"application/json"},
//       body :JSON.stringify(id)
//     });
//     if(!response.ok){
//       throw  new Error(`HTTP error! status:${response.status}`)
//     }
//     return await response.json();
//   }
// }
