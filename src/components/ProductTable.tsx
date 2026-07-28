import Link from "next/link";
import { Product } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function ProductTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              商品名
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              SKU
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              カテゴリ
            </th>
            <th className="px-4 py-2 text-right font-medium text-gray-600">
              価格
            </th>
            <th className="px-4 py-2 text-right font-medium text-gray-600">
              在庫数
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              公開状態
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                <Link
                  href={`/products/${p.id}`}
                  className="font-medium text-sky-700 hover:underline"
                >
                  {p.name}
                </Link>
              </td>
              <td className="px-4 py-2 text-gray-600">{p.sku}</td>
              <td className="px-4 py-2 text-gray-600">{p.category}</td>
              <td className="px-4 py-2 text-right text-gray-800">
                ¥{p.price.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right text-gray-800">
                {p.stock.toLocaleString()}
              </td>
              <td className="px-4 py-2">
                <StatusBadge published={p.published} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
