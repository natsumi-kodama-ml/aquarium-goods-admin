export default function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        published
          ? "bg-emerald-100 text-emerald-800"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {published ? "公開中" : "非公開"}
    </span>
  );
}
