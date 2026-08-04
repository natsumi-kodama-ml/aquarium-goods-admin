import { ReactNode } from "react";
import { Product } from "./types";
import StatusBadge from "@/components/StatusBadge";

export type ColumnKey =
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
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP");
}

export const COLUMN_DEFS: ColumnDef[] = [
  { key: "sku", label: "SKU", render: (p) => p.sku },
  { key: "category", label: "カテゴリ", render: (p) => p.category },
  {
    key: "price",
    label: "価格",
    align: "right",
    render: (p) => `¥${p.price.toLocaleString()}`,
  },
  {
    key: "stock",
    label: "在庫数",
    align: "right",
    render: (p) => p.stock.toLocaleString(),
  },
  {
    key: "published",
    label: "公開状態",
    render: (p) => <StatusBadge published={p.published} />,
  },
  {
    key: "animalMotif",
    label: "生き物モチーフ",
    render: (p) => p.animalMotif || "-",
  },
  {
    key: "description",
    label: "商品説明",
    truncate: true,
    render: (p) => p.description || "-",
  },
  { key: "createdAt", label: "登録日", render: (p) => formatDate(p.createdAt) },
  { key: "updatedAt", label: "更新日", render: (p) => formatDate(p.updatedAt) },
  { key: "notes", label: "備考", truncate: true, render: (p) => p.notes || "-" },
];

export const DEFAULT_VISIBLE_COLUMNS: ColumnKey[] = [
  "sku",
  "category",
  "price",
  "stock",
  "published",
];
