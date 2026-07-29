"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import StatusBadge from "./StatusBadge";
import ProductImage from "./ProductImage";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProductDetailView({
  productId,
}: {
  productId: string;
}) {
  const { getProduct } = useProducts();
  const product = getProduct(productId);

  if (!product) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-600">商品が見つかりませんでした。</p>
        <Link href="/" className="text-sm text-sky-700 hover:underline">
          一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Link href="/" className="text-sm font-medium text-teal-700 hover:underline">
        ← 一覧に戻る
      </Link>

      <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <ProductImage
              imageUrl={product.imageUrl}
              animalMotif={product.animalMotif}
              alt={product.name}
              className="h-24 w-24 shrink-0 rounded-2xl text-4xl"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                {product.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {product.sku} ・ {product.category}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge published={product.published} />
            <Link
              href={`/products/${product.id}/edit`}
              className="rounded-full bg-gradient-to-r from-sky-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-sky-600 hover:to-teal-600 hover:shadow-lg"
            >
              編集
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="価格" value={`¥${product.price.toLocaleString()}`} />
          <Stat label="在庫数" value={product.stock.toLocaleString()} />
          <Stat label="カテゴリ" value={product.category} />
          <Stat label="生き物モチーフ" value={product.animalMotif || "-"} />
        </div>

        <dl className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-6 text-sm">
          <div>
            <dt className="font-medium text-gray-600">商品説明</dt>
            <dd className="mt-1 whitespace-pre-wrap text-gray-800">
              {product.description || "(未入力)"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-600">備考</dt>
            <dd className="mt-1 whitespace-pre-wrap text-gray-800">
              {product.notes || "(なし)"}
            </dd>
          </div>
          <div className="flex gap-8">
            <div>
              <dt className="font-medium text-gray-600">登録日</dt>
              <dd className="mt-1 text-gray-800">
                {formatDate(product.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">更新日</dt>
              <dd className="mt-1 text-gray-800">
                {formatDate(product.updatedAt)}
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-sky-50 to-teal-50 p-3">
      <p className="text-xs text-sky-600">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
