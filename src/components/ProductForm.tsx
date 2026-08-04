"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { CATEGORIES, Category } from "@/lib/types";
import { fileToResizedDataUrl } from "@/lib/resizeImage";
import ProductImage from "./ProductImage";

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
}

interface FormState {
  name: string;
  sku: string;
  category: Category;
  imageUrl: string;
  price: string;
  stock: string;
  published: boolean;
  description: string;
  animalMotif: string;
  notes: string;
}

const inputClass =
  "w-full rounded-xl border border-sky-200 px-3 py-1.5 text-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100";

const emptyForm: FormState = {
  name: "",
  sku: "",
  category: CATEGORIES[0],
  imageUrl: "",
  price: "",
  stock: "",
  published: true,
  description: "",
  animalMotif: "",
  notes: "",
};

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const { products, getProduct, addProduct, updateProduct } = useProducts();

  const existingProduct =
    mode === "edit" && productId ? getProduct(productId) : undefined;

  const [form, setForm] = useState<FormState>(() =>
    existingProduct
      ? {
          name: existingProduct.name,
          sku: existingProduct.sku,
          category: existingProduct.category,
          imageUrl: existingProduct.imageUrl,
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
  const [imageProcessing, setImageProcessing] = useState(false);
  const [imageError, setImageError] = useState("");

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

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImageError("");
    setImageProcessing(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      update("imageUrl", dataUrl);
    } catch {
      setImageError("画像の読み込みに失敗しました");
    } finally {
      setImageProcessing(false);
    }
  }

  function validate(): Partial<Record<keyof FormState, string>> {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim() === "") nextErrors.name = "商品名を入力してください";
    if (form.sku.trim() === "") {
      nextErrors.sku = "SKUを入力してください";
    } else {
      const normalizedSku = form.sku.trim().toLowerCase();
      const isDuplicate = products.some(
        (p) =>
          p.sku.trim().toLowerCase() === normalizedSku &&
          p.id !== existingProduct?.id
      );
      if (isDuplicate) nextErrors.sku = "このSKUは既に使われています";
    }
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
      imageUrl: form.imageUrl,
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
      <h1 className="text-2xl font-bold text-slate-800">
        {mode === "create" ? "🐬 商品の新規登録" : "🐬 商品の編集"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm"
      >
        <FormSection title="基本情報" description="商品を識別するための情報です">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="商品名" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="SKU" error={errors.sku}>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => update("sku", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="カテゴリ">
              <select
                value={form.category}
                onChange={(e) =>
                  update("category", e.target.value as Category)
                }
                className={inputClass}
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
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="販売情報" description="価格・在庫・公開可否を管理します">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="価格(円)" error={errors.price}>
              <input
                type="number"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="在庫数" error={errors.stock}>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => update("stock", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => update("published", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-teal-500"
            />
            公開する
          </label>
        </FormSection>

        <FormSection title="表示情報" description="一覧・詳細・店頭で見せる情報です">
          <div className="flex items-center gap-4">
            <ProductImage
              imageUrl={form.imageUrl}
              animalMotif={form.animalMotif}
              alt="商品画像プレビュー"
              className="h-24 w-24 shrink-0 rounded-2xl text-4xl"
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-sky-700">
                商品画像
              </span>
              <label className="w-fit cursor-pointer rounded-full border border-sky-300 px-4 py-1.5 text-sm text-sky-700 hover:bg-sky-50">
                画像を選択
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imageProcessing && (
                <span className="text-xs text-gray-500">変換中...</span>
              )}
              {imageError && (
                <span className="text-xs text-red-600">{imageError}</span>
              )}
              {form.imageUrl && !imageProcessing && (
                <button
                  type="button"
                  onClick={() => update("imageUrl", "")}
                  className="w-fit text-xs text-rose-400 hover:underline"
                >
                  画像を削除
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Field label="商品説明">
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="その他">
          <Field label="備考">
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={2}
              className={inputClass}
            />
          </Field>
        </FormSection>

        <div className="flex items-center gap-3 border-t border-sky-100 pt-4">
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-sky-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-sky-600 hover:to-teal-600 hover:shadow-lg"
          >
            {mode === "create" ? "登録する" : "保存する"}
          </button>
          <Link
            href={
              mode === "edit" && existingProduct
                ? `/products/${existingProduct.id}`
                : "/"
            }
            className="text-sm text-gray-500 hover:underline"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-baseline gap-2 border-l-4 border-teal-400 pl-3">
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
        {description && (
          <span className="text-xs text-gray-400">{description}</span>
        )}
      </div>
      {children}
    </section>
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
