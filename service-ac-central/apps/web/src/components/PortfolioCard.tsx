import type { Portfolio } from "../types";

export default function PortfolioCard({ item }: { item: Portfolio }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-ink-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/10">
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/85 to-transparent p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-300">
          {item.category}
        </p>
        <p className="text-sm font-bold text-white">{item.title}</p>
      </div>
    </div>
  );
}
