export default function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        published
          ? "bg-gradient-to-r from-teal-400 to-emerald-400 text-white shadow-sm"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          published ? "bg-white" : "bg-gray-400"
        }`}
      />
      {published ? "公開中" : "非公開"}
    </span>
  );
}
