interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: Props) {
  return (
    <div
      className={`mx-auto max-w-2xl ${align === "center" ? "text-center" : "text-left"}`}
    >
      {eyebrow && (
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-2xl font-extrabold text-ink-900 sm:text-3xl">
        {title}
      </h2>
      {description && <p className="mt-3 text-ink-500">{description}</p>}
    </div>
  );
}
