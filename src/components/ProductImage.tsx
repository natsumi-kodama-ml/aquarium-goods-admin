const ANIMAL_EMOJI: Record<string, string> = {
  ラッコ: "🦦",
  ジンベエザメ: "🦈",
  サメ: "🦈",
  ペンギン: "🐧",
  イルカ: "🐬",
  クラゲ: "🪼",
  アシカ: "🦭",
  チョウチンアンコウ: "🐡",
  サンゴ: "🪸",
  タツノオトシゴ: "🐠",
};

function getPlaceholderEmoji(animalMotif: string): string {
  return ANIMAL_EMOJI[animalMotif] ?? "🐠";
}

export default function ProductImage({
  imageUrl,
  animalMotif,
  alt,
  className = "",
}: {
  imageUrl: string;
  animalMotif: string;
  alt: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- product photos are user-uploaded data URLs, not static assets
      <img
        src={imageUrl}
        alt={alt}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center bg-sky-50 ${className}`}
      aria-hidden="true"
    >
      <span>{getPlaceholderEmoji(animalMotif)}</span>
    </div>
  );
}
