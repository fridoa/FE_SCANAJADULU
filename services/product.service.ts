import { axiosInstance } from "@/libs/axios/instance";
import { IProduct } from "@/types/Product";
import endpoint from "./endpoint.constant";

const productService = {
  getProduct: async (query?: string): Promise<IProduct[]> => {
    if (!query) {
      const response = await axiosInstance.get(endpoint.PRODUCT);
      return Array.isArray(response.data) ? response.data : response.data.data;
    }

    const isSku = /^\d+$/.test(query) && query.length > 3;

    if (isSku) {
      try {
        const response = await axiosInstance.get(`${endpoint.PRODUCT}/sku/${query}`);
        const data = response.data.data || response.data;

        if (data && (data._id || data.id || data.name)) {
          if (!Array.isArray(data)) {
            return [data];
          }
          return data;
        }

        return [];
      } catch (error) {
        console.log("SKU not found, falling back to name search");
      }
    }

    try {
      const response = await axiosInstance.get(endpoint.PRODUCT);
      const allProducts: IProduct[] = Array.isArray(response.data) ? response.data : response.data.data || [];

      const lowerQuery = query.toLowerCase();
      return allProducts.filter((p) => (p.name && p.name.toLowerCase().includes(lowerQuery)) || (p.sku && p.sku.includes(query)));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  createProduct: async (payload: Partial<IProduct>) => {
    const response = await axiosInstance.post(endpoint.PRODUCT, payload);
    return response.data.data;
  },
};

export default productService;
