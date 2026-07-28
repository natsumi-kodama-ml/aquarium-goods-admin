export const CATEGORIES = [
  "ぬいぐるみ",
  "アクセサリー",
  "文房具",
  "お菓子",
  "アパレル",
  "生活雑貨",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: Category;
  imageUrl: string;
  price: number;
  stock: number;
  published: boolean;
  description: string;
  animalMotif: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;
