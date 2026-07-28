"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { CATEGORIES, Category } from "@/lib/types";

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
}

interface FormState {
  name: string;
  sku: string;
  category: Category;
  price: string;
  stock: string;
  published: boolean;
  description: string;
  animalMotif: string;
  notes: string;
}

const emptyForm: FormState = {
  name: "",
  sku: "",
  category: CATEGORIES[0],
  price: "",
  stock: "",
  published: true,
  description: "",
  animalMotif: "",
  notes: "",
};

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const { getProduct, addProduct, updateProduct } = useProducts();

  const existingProduct =
    mode === "edit" && productId ? getProduct(productId) : undefined;

  const [form, setForm] = useState<FormState>(() =>
    existingProduct
      ? {
          name: existingProduct.name,
          sku: existingProduct.sku,
          category: existingProduct.category,
          price: String(existingProduct.price),
          stock: String(existingProduct.stock),
          published: existingProduct.published,
          description: existingProduct.description,
          animalMotif: existingProduct.animalMotif,
          notes: existingProduct.notes,
        }
      : emptyForm
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );

  if (mode === "edit" && !existingProduct) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-600">商品が見つかりませんでした。</p>
        <Link href="/" className="text-sm text-sky-700 hover:underline">
          一覧に戻る
        </Link>
      </div>
    );
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): Partial<Record<keyof FormState, string>> {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim() === "") nextErrors.name = "商品名を入力してください";
    if (form.sku.trim() === "") nextErrors.sku = "SKUを入力してください";
    const price = Number(form.price);
    if (form.price.trim() === "" || Number.isNaN(price) || price < 0) {
      nextErrors.price = "0以上の価格を入力してください";
    }
    const stock = Number(form.stock);
    if (form.stock.trim() === "" || Number.isNaN(stock) || !Number.isInteger(stock) || stock < 0) {
      nextErrors.stock = "0以上の整数で在庫数を入力してください";
    }
    return nextErrors;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const input = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      published: form.published,
      description: form.description.trim(),
      animalMotif: form.animalMotif.trim(),
      notes: form.notes.trim(),
    };

    if (mode === "create") {
      const created = addProduct(input);
      router.push(`/products/${created.id}`);
    } else if (existingProduct) {
      updateProduct(existingProduct.id, input);
      router.push(`/products/${existingProduct.id}`);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-gray-900">
        {mode === "create" ? "商品の新規登録" : "商品の編集"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="商品名" error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none"
            />
          </Field>

          <Field label="SKU" error={errors.sku}>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => update("sku", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none"
            />
          </Field>

          <Field label="カテゴリ">
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value as Category)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="生き物モチーフ">
            <input
              type="text"
              value={form.animalMotif}
              onChange={(e) => update("animalMotif", e.target.value)}
              placeholder="例: ラッコ, ペンギン"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none"
            />
          </Field>

          <Field label="価格(円)" error={errors.price}>
            <input
              type="number"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none"
            />
          </Field>

          <Field label="在庫数" error={errors.stock}>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none"
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update("published", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          公開する
        </label>

        <Field label="商品説明">
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none"
          />
        </Field>

        <Field label="備考">
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none"
          />
        </Field>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            {mode === "create" ? "登録する" : "保存する"}
          </button>
          <Link
            href={
              mode === "edit" && existingProduct
                ? `/products/${existingProduct.id}`
                : "/"
            }
            className="text-sm text-gray-600 hover:underline"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      <span className="font-medium">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
