import Link from "next/link";
import { Product } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function ProductTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-sky-100 bg-white shadow-sm">
      <table className="w-full min-w-[640px] divide-y divide-sky-100 text-sm">
        <thead className="bg-gradient-to-r from-sky-50 to-teal-50">
          <tr>
            <th className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-sky-700">
              商品名
            </th>
            <th className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-sky-700">
              SKU
            </th>
            <th className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-sky-700">
              カテゴリ
            </th>
            <th className="whitespace-nowrap px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-sky-700">
              価格
            </th>
            <th className="whitespace-nowrap px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-sky-700">
              在庫数
            </th>
            <th className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-sky-700">
              公開状態
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sky-50">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-sky-50/60">
              <td className="whitespace-nowrap px-4 py-2">
                <Link
                  href={`/products/${p.id}`}
                  className="font-medium text-sky-700 hover:underline"
                >
                  {p.name}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-600">
                {p.sku}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-600">
                {p.category}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-right text-gray-800">
                ¥{p.price.toLocaleString()}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-right text-gray-800">
                {p.stock.toLocaleString()}
              </td>
              <td className="whitespace-nowrap px-4 py-2">
                <StatusBadge published={p.published} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
