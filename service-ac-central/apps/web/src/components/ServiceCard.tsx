import { Wind } from "lucide-react";
import type { Service } from "../types";
import { formatRupiah, buildWhatsAppLink } from "../utils";
import { useSettings } from "../hooks/useSettings";

export default function ServiceCard({ service }: { service: Service }) {
  const { settings } = useSettings();
  const waLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `Hallo ${settings.companyName}, saya ingin pesan layanan "${service.name} (${service.pkSize})".`,
  );

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-100 hover:shadow-xl hover:shadow-brand-600/10">
      <div className="flex h-40 items-center justify-center bg-brand-50">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Wind className="h-14 w-14 text-brand-400" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-ink-900">{service.name}</h3>
        <p className="mt-1 text-sm text-ink-500">Ukuran {service.pkSize}</p>
        {service.description && (
          <p className="mt-2 line-clamp-2 text-sm text-ink-400">
            {service.description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-extrabold text-brand-700">
            {formatRupiah(service.price)}
          </p>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-brand-600 group-hover:shadow-lg group-hover:shadow-brand-600/25"
        >
          Pesan Sekarang
        </a>
      </div>
    </div>
  );
}
