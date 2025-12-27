export interface IProduct {
  _id?: string;
  id?: string;
  name: string;
  category?: string;
  price: string | number;
  cost_price?: string | number;
  sku?: string;
  stock?: string | number;
  image_url?: string;
}
