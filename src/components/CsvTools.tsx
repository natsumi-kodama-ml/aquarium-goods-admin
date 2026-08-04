"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Product } from "@/lib/types";
import { useProducts } from "@/hooks/useProducts";
import { productsToCsv, parseProductsCsv } from "@/lib/csv";

export default function CsvTools({ products }: { products: Product[] }) {
  const { products: allProducts, addProduct, updateProduct } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleExport() {
    const csv = productsToCsv(products);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `商品マスタ_${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const text = await file.text();
    const { rows, errors } = parseProductsCsv(text);

    const skuToId = new Map<string, string>();
    const idToImageUrl = new Map<string, string>();
    allProducts.forEach((p) => {
      skuToId.set(p.sku.trim().toLowerCase(), p.id);
      idToImageUrl.set(p.id, p.imageUrl);
    });

    let created = 0;
    let updated = 0;
    for (const row of rows) {
      const key = row.sku.trim().toLowerCase();
      const existingId = skuToId.get(key);
      if (existingId) {
        updateProduct(existingId, {
          ...row.input,
          imageUrl: idToImageUrl.get(existingId) ?? "",
        });
        updated++;
      } else {
        const createdProduct = addProduct({ ...row.input, imageUrl: "" });
        skuToId.set(key, createdProduct.id);
        idToImageUrl.set(createdProduct.id, "");
        created++;
      }
    }

    const parts = [`${created}件新規登録`, `${updated}件更新`];
    if (errors.length > 0) {
      parts.push(`${errors.length}件スキップ`);
      console.warn("CSVインポートで発生した問題:", errors);
    }
    setMessage(parts.join(" / "));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleExport}
        className="rounded-full border border-sky-200 bg-white px-4 py-1.5 text-sm text-sky-700 hover:bg-sky-50"
      >
        CSVエクスポート
      </button>
      <button
        type="button"
        onClick={handleImportClick}
        className="rounded-full border border-sky-200 bg-white px-4 py-1.5 text-sm text-sky-700 hover:bg-sky-50"
      >
        CSVインポート
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileChange}
        className="hidden"
      />
      {message && <span className="text-xs text-slate-500">{message}</span>}
    </div>
  );
}
