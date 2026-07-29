import { CATEGORIES } from "@/lib/types";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export default function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="search" className="text-xs font-medium text-sky-700">
          検索(商品名・SKU)
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm">
            🔍
          </span>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="例: ラッコ, AQ-0001"
            className="w-56 rounded-full border border-sky-200 py-1.5 pl-8 pr-3 text-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="text-xs font-medium text-sky-700">
          カテゴリ
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-full border border-sky-200 px-3 py-1.5 text-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
        >
          <option value="all">すべて</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="text-xs font-medium text-sky-700">
          公開状態
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-full border border-sky-200 px-3 py-1.5 text-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
        >
          <option value="all">すべて</option>
          <option value="published">公開中</option>
          <option value="unpublished">非公開</option>
        </select>
      </div>
    </div>
  );
}
