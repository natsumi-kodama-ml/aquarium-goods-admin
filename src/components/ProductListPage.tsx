"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import ColumnSettings from "./ColumnSettings";
import CsvTools from "./CsvTools";

export default function ProductListPage() {
  const { products, deleteProducts, setPublishedForProducts } = useProducts();
  const { visibleColumns } = useColumnVisibility();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  const isFiltered = search.trim() !== "" || category !== "all" || status !== "all";

  function resetFilters() {
    setSearch("");
    setCategory("all");
    setStatus("all");
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      const allSelected =
        filteredProducts.length > 0 &&
        filteredProducts.every((p) => prev.has(p.id));
      const next = new Set(prev);
      filteredProducts.forEach((p) => {
        if (allSelected) {
          next.delete(p.id);
        } else {
          next.add(p.id);
        }
      });
      return next;
    });
  }

  function handleBulkPublish(published: boolean) {
    setPublishedForProducts(Array.from(selectedIds), published);
    clearSelection();
  }

  function handleBulkDelete() {
    const confirmed = window.confirm(
      `選択した${selectedIds.size}件を削除します。この操作は取り消せません。よろしいですか？`
    );
    if (!confirmed) return;
    deleteProducts(Array.from(selectedIds));
    clearSelection();
  }

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

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-400">{filteredProducts.length}件表示中</p>
        <div className="flex items-center gap-2">
          <CsvTools products={filteredProducts} />
          <ColumnSettings />
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm">
          <span className="font-semibold text-teal-800">
            {selectedIds.size}件選択中
          </span>
          <button
            type="button"
            onClick={() => handleBulkPublish(true)}
            className="rounded-full bg-white px-3 py-1.5 font-medium text-teal-700 shadow-sm hover:bg-teal-100"
          >
            公開する
          </button>
          <button
            type="button"
            onClick={() => handleBulkPublish(false)}
            className="rounded-full bg-white px-3 py-1.5 font-medium text-teal-700 shadow-sm hover:bg-teal-100"
          >
            非公開にする
          </button>
          <button
            type="button"
            onClick={handleBulkDelete}
            className="rounded-full bg-white px-3 py-1.5 font-medium text-rose-500 shadow-sm hover:bg-rose-50"
          >
            削除
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="ml-auto text-xs text-teal-700 hover:underline"
          >
            選択解除
          </button>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-sky-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">
            🐚 条件に一致する商品がありません
          </p>
          {isFiltered && (
            <>
              <p className="text-xs text-slate-400">
                キーワードやカテゴリ・公開状態の絞り込みを見直してみてください
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full bg-gradient-to-r from-sky-500 to-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:from-sky-600 hover:to-teal-600"
              >
                絞り込みをリセット
              </button>
            </>
          )}
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          visibleColumns={visibleColumns}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
        />
      )}
    </div>
  );
}
