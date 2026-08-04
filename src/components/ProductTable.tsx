import Link from "next/link";
import { Product } from "@/lib/types";
import { COLUMN_DEFS, ColumnKey } from "@/lib/listColumns";

interface ProductTableProps {
  products: Product[];
  visibleColumns: ColumnKey[];
}

export default function ProductTable({
  products,
  visibleColumns,
}: ProductTableProps) {
  const imageColumn = COLUMN_DEFS.find((col) => col.key === "image");
  const showImage = imageColumn !== undefined && visibleColumns.includes("image");
  const columns = COLUMN_DEFS.filter(
    (col) => col.key !== "image" && visibleColumns.includes(col.key)
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-sky-100 bg-white shadow-sm">
      <table className="w-full min-w-[640px] divide-y divide-sky-100 text-sm">
        <thead className="bg-gradient-to-r from-sky-50 to-teal-50">
          <tr>
            {showImage && (
              <th className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-sky-700">
                {imageColumn.label}
              </th>
            )}
            <th className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-sky-700">
              商品名
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-sky-700 ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-sky-50">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-sky-50/60">
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
