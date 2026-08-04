"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { COLUMN_DEFS, ColumnKey } from "@/lib/listColumns";

type SortKey = ColumnKey | "name";
type SortDir = "asc" | "desc";

function SortableHeader({
  sortKeyValue,
  align,
  active,
  sortDir,
  onSort,
  children,
}: {
  sortKeyValue: SortKey;
  align?: "left" | "right";
  active: boolean;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  children: React.ReactNode;
}) {
  return (
    <th
      className={`whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-sky-700 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <button
        type="button"
        onClick={() => onSort(sortKeyValue)}
        className={`inline-flex items-center gap-1 hover:text-sky-900 ${
          align === "right" ? "flex-row-reverse" : ""
        }`}
      >
        {children}
        <span className={active ? "text-sky-900" : "text-sky-300"}>
          {active ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </button>
    </th>
  );
}

interface ProductTableProps {
  products: Product[];
  visibleColumns: ColumnKey[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}

export default function ProductTable({
  products,
  visibleColumns,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: ProductTableProps) {
  const imageColumn = COLUMN_DEFS.find((col) => col.key === "image");
  const showImage = imageColumn !== undefined && visibleColumns.includes("image");
  const columns = COLUMN_DEFS.filter(
    (col) => col.key !== "image" && visibleColumns.includes(col.key)
  );

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortedProducts = useMemo(() => {
    if (!sortKey) return products;
    const getValue: ((p: Product) => string | number) | undefined =
      sortKey === "name"
        ? (p) => p.name
        : COLUMN_DEFS.find((c) => c.key === sortKey)?.sortValue;
    if (!getValue) return products;
    return [...products].sort((a, b) => {
      const va = getValue(a);
      const vb = getValue(b);
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [products, sortKey, sortDir]);

  const allSelected =
    products.length > 0 && products.every((p) => selectedIds.has(p.id));
  const someSelected = products.some((p) => selectedIds.has(p.id));
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  return (
    <div className="overflow-x-auto rounded-2xl border border-sky-100 bg-white shadow-sm">
      <table className="w-full min-w-[640px] divide-y divide-sky-100 text-sm">
        <thead className="bg-gradient-to-r from-sky-50 to-teal-50">
          <tr>
            <th className="w-10 px-4 py-2.5">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                aria-label="すべて選択"
                className="h-4 w-4 rounded border-gray-300 accent-teal-500"
              />
            </th>
            {showImage && (
              <th className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-sky-700">
                {imageColumn.label}
              </th>
            )}
            <SortableHeader
              sortKeyValue="name"
              active={sortKey === "name"}
              sortDir={sortDir}
              onSort={handleSort}
            >
              商品名
            </SortableHeader>
            {columns.map((col) =>
              col.sortValue ? (
                <SortableHeader
                  key={col.key}
                  sortKeyValue={col.key}
                  align={col.align}
                  active={sortKey === col.key}
                  sortDir={sortDir}
                  onSort={handleSort}
                >
                  {col.label}
                </SortableHeader>
              ) : (
                <th
                  key={col.key}
                  className={`whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-sky-700 ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-sky-50">
          {sortedProducts.map((p) => (
            <tr
              key={p.id}
              className={`hover:bg-sky-50/60 ${
                selectedIds.has(p.id) ? "bg-teal-50/60" : ""
              }`}
            >
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.has(p.id)}
                  onChange={() => onToggleSelect(p.id)}
                  aria-label={`${p.name}を選択`}
                  className="h-4 w-4 rounded border-gray-300 accent-teal-500"
                />
              </td>
              {showImage && (
                <td className="px-4 py-2">{imageColumn.render(p)}</td>
              )}
              <td className="whitespace-nowrap px-4 py-2">
                <Link
                  href={`/products/${p.id}`}
                  className="font-medium text-sky-700 hover:underline"
                >
                  {p.name}
                </Link>
              </td>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-2 text-gray-600 ${
                    col.align === "right" ? "text-right" : "text-left"
                  } ${
                    col.truncate
                      ? "max-w-[220px] truncate"
                      : "whitespace-nowrap"
                  }`}
                >
                  {col.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
