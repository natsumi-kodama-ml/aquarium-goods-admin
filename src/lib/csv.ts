import { CATEGORIES, Category, Product, ProductInput } from "./types";

const CSV_HEADERS = [
  "商品名",
  "SKU",
  "カテゴリ",
  "価格",
  "在庫数",
  "公開状態",
  "生き物モチーフ",
  "商品説明",
  "備考",
] as const;

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function productsToCsv(products: Product[]): string {
  const lines = [CSV_HEADERS.map(escapeCsvField).join(",")];
  for (const p of products) {
    const row = [
      p.name,
      p.sku,
      p.category,
      String(p.price),
      String(p.stock),
      p.published ? "公開中" : "非公開",
      p.animalMotif,
      p.description,
      p.notes,
    ];
    lines.push(row.map((v) => escapeCsvField(v)).join(","));
  }
  return "﻿" + lines.join("\r\n");
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  let i = 0;
  while (i < s.length) {
    const char = s[i];
    if (inQuotes) {
      if (char === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += char;
      i++;
      continue;
    }
    if (char === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += char;
    i++;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
}

export type ProductCsvInput = Omit<ProductInput, "imageUrl">;

export interface CsvImportResult {
  rows: { sku: string; input: ProductCsvInput }[];
  errors: string[];
}

export function parseProductsCsv(text: string): CsvImportResult {
  const table = parseCsv(text);
  if (table.length === 0) {
    return { rows: [], errors: ["CSVが空です"] };
  }

  const header = table[0].map((h) => h.trim());
  const colIndex = (name: string) => header.indexOf(name);
  const nameIdx = colIndex("商品名");
  const skuIdx = colIndex("SKU");
  const categoryIdx = colIndex("カテゴリ");
  const priceIdx = colIndex("価格");
  const stockIdx = colIndex("在庫数");
  const publishedIdx = colIndex("公開状態");
  const motifIdx = colIndex("生き物モチーフ");
  const descIdx = colIndex("商品説明");
  const notesIdx = colIndex("備考");

  if (nameIdx === -1 || skuIdx === -1) {
    return {
      rows: [],
      errors: ['ヘッダー行に「商品名」と「SKU」の列が見つかりません'],
    };
  }

  const errors: string[] = [];
  const rows: { sku: string; input: ProductCsvInput }[] = [];

  for (let i = 1; i < table.length; i++) {
    const cols = table[i];
    if (cols.every((c) => c.trim() === "")) continue;
    const lineNo = i + 1;

    const name = cols[nameIdx]?.trim() ?? "";
    const sku = cols[skuIdx]?.trim() ?? "";
    if (!name || !sku) {
      errors.push(`${lineNo}行目: 商品名またはSKUが空のためスキップしました`);
      continue;
    }

    let category = CATEGORIES[0] as Category;
    if (categoryIdx !== -1) {
      const raw = cols[categoryIdx]?.trim() ?? "";
      if (raw && (CATEGORIES as readonly string[]).includes(raw)) {
        category = raw as Category;
      } else if (raw) {
        errors.push(
          `${lineNo}行目: カテゴリ「${raw}」は不明なため「${CATEGORIES[0]}」にしました`
        );
      }
    }

    const priceRaw = priceIdx !== -1 ? cols[priceIdx]?.trim() ?? "" : "";
    const price = Number(priceRaw);
    if (priceRaw === "" || Number.isNaN(price) || price < 0) {
      errors.push(`${lineNo}行目: 価格が不正なためスキップしました`);
      continue;
    }

    const stockRaw = stockIdx !== -1 ? cols[stockIdx]?.trim() ?? "" : "";
    const stock = Number(stockRaw);
    if (
      stockRaw === "" ||
      Number.isNaN(stock) ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      errors.push(`${lineNo}行目: 在庫数が不正なためスキップしました`);
      continue;
    }

    const published =
      publishedIdx !== -1 ? cols[publishedIdx]?.trim() === "公開中" : true;

    rows.push({
      sku,
      input: {
        name,
        sku,
        category,
        price,
        stock,
        published,
        description: descIdx !== -1 ? cols[descIdx]?.trim() ?? "" : "",
        animalMotif: motifIdx !== -1 ? cols[motifIdx]?.trim() ?? "" : "",
        notes: notesIdx !== -1 ? cols[notesIdx]?.trim() ?? "" : "",
      },
    });
  }

  return { rows, errors };
}
