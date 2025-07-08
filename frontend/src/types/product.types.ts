export type ProductImageType = {
  _id: string;
  url: string;
};

export type CartProduct = ProductType & { quantity: number };

export type ProductType = {
  _id: string;
  title: string;
  price: number;
  description: string;
  images: ProductImageType[];
  stock: number;
  discountedPrice: number;
  discountedRatio: number;
  averageRating: number;
  totalReviews: number;
  categoryIds: string[];
  brand: string;
  tags: string[];
  slug: string;
  isBoosted: boolean;
};

export type ProductValidationType = {
  title: string;
  price: number;
  description: string;
  stock: number;
  brand: string;
  categorySlugs: string[];
  discountedPrice?: number;
  discountedRatio?: number;
  tags: string[];
};
