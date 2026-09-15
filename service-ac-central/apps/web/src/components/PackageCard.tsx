import { Check, X } from "lucide-react";
import type { PricePackage } from "../types";
import { formatRupiah, buildWhatsAppLink } from "../utils";
import { useSettings } from "../hooks/useSettings";

export default function PackageCard({ pkg }: { pkg: PricePackage }) {
  const { settings } = useSettings();
  const waLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `Hallo ${settings.companyName}, saya ingin pesan paket "${pkg.name}".`,
  );

  return (
    <div className="flex flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <p className="text-sm font-bold text-brand-600">{pkg.pkSize}</p>
      <h3 className="mt-1 text-lg font-extrabold text-ink-900">{pkg.name}</h3>
      <p className="mt-2 text-2xl font-extrabold text-ink-900">
        {formatRupiah(pkg.price)}
        <span className="text-sm font-medium text-ink-400"> / unit</span>
      </p>

      <ul className="mt-5 flex-1 space-y-2.5">
        {pkg.checklist.map((c, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            {c.included ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            ) : (
              <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-300" />
            )}
            <span
              className={
                c.included ? "text-ink-700" : "text-ink-400 line-through"
              }
            >
              {c.item}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
      >
        Pesan Sekarang
      </a>
    </div>
  );
}
