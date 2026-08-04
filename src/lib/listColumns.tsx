import { ReactNode } from "react";
import { Product } from "./types";
import StatusBadge from "@/components/StatusBadge";
import ProductImage from "@/components/ProductImage";

export type ColumnKey =
  | "image"
  | "sku"
  | "category"
  | "price"
  | "stock"
  | "published"
  | "animalMotif"
  | "description"
  | "createdAt"
  | "updatedAt"
  | "notes";

interface ColumnDef {
  key: ColumnKey;
  label: string;
  align?: "left" | "right";
  truncate?: boolean;
  render: (product: Product) => ReactNode;
  sortValue?: (product: Product) => string | number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP");
}

export const COLUMN_DEFS: ColumnDef[] = [
  {
    key: "image",
    label: "画像",
    render: (p) => (
      <ProductImage
        imageUrl={p.imageUrl}
        animalMotif={p.animalMotif}
        alt={p.name}
        className="h-10 w-10 rounded-md text-lg"
      />
    ),
  },
  { key: "sku", label: "SKU", render: (p) => p.sku, sortValue: (p) => p.sku },
  {
    key: "category",
    label: "カテゴリ",
    render: (p) => p.category,
    sortValue: (p) => p.category,
  },
  {
    key: "price",
    label: "価格",
    align: "right",
    render: (p) => `¥${p.price.toLocaleString()}`,
    sortValue: (p) => p.price,
  },
  {
    key: "stock",
    label: "在庫数",
    align: "right",
    render: (p) => p.stock.toLocaleString(),
    sortValue: (p) => p.stock,
  },
  {
    key: "published",
    label: "公開状態",
    render: (p) => <StatusBadge published={p.published} />,
    sortValue: (p) => (p.published ? 1 : 0),
  },
  {
    key: "animalMotif",
    label: "生き物モチーフ",
    render: (p) => p.animalMotif || "-",
    sortValue: (p) => p.animalMotif,
  },
  {
    key: "description",
    label: "商品説明",
    truncate: true,
    render: (p) => p.description || "-",
  },
  {
    key: "createdAt",
    label: "登録日",
    render: (p) => formatDate(p.createdAt),
    sortValue: (p) => p.createdAt,
  },
  {
    key: "updatedAt",
    label: "更新日",
    render: (p) => formatDate(p.updatedAt),
    sortValue: (p) => p.updatedAt,
  },
  { key: "notes", label: "備考", truncate: true, render: (p) => p.notes || "-" },
];

export const DEFAULT_VISIBLE_COLUMNS: ColumnKey[] = [
  "image",
  "sku",
  "category",
  "price",
  "stock",
  "published",
];
