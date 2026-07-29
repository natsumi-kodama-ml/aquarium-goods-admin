"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";

export default function ProductListPage() {
  const { products } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesKeyword =
        keyword === "" ||
        p.name.toLowerCase().includes(keyword) ||
        p.sku.toLowerCase().includes(keyword);
      const matchesCategory = category === "all" || p.category === category;
      const matchesStatus =
        status === "all" ||
        (status === "published" && p.published) ||
        (status === "unpublished" && !p.published);
      return matchesKeyword && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          🐠 水族館グッズ 商品マスタ
        </h1>
        <Link
          href="/products/new"
          className="rounded-full bg-gradient-to-r from-sky-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-sky-600 hover:to-teal-600 hover:shadow-lg"
        >
          + 新規登録
        </Link>
      </div>

      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
      />

      {filteredProducts.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-sky-200 bg-white p-8 text-center text-sm text-slate-500">
          🐚 条件に一致する商品がありません
        </p>
      ) : (
        <ProductTable products={filteredProducts} />
      )}
    </div>
  );
}
