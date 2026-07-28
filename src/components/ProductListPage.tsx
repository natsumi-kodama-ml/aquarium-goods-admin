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
        <h1 className="text-xl font-semibold text-gray-900">
          水族館グッズ 商品マスタ
        </h1>
        <Link
          href="/products/new"
          className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
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
        <p className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          条件に一致する商品がありません
        </p>
      ) : (
        <ProductTable products={filteredProducts} />
      )}
    </div>
  );
}
