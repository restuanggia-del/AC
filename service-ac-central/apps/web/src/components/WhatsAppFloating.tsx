import { Phone } from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import { buildTelLink, buildWhatsAppLink } from "../utils";

export default function WhatsAppFloating() {
  const { settings } = useSettings();
  const waLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `Hallo ${settings.companyName}, saya ingin konsultasi AC.`,
  );

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a
        href={buildTelLink(settings.phoneNumber)}
        aria-label="Telepon kami"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 transition hover:scale-105 hover:bg-brand-700"
      >
        <Phone className="h-5 w-5" />
      </a>
      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-wa text-white shadow-lg shadow-wa/40 transition hover:scale-105 hover:bg-wa-dark"
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white">
          <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.256.59 4.455 1.71 6.39L3.2 28.8l6.58-1.685a12.74 12.74 0 0 0 6.22 1.585h.005c7.07 0 12.8-5.73 12.8-12.8s-5.73-12.8-12.8-12.8Zm0 23.36a10.5 10.5 0 0 1-5.35-1.47l-.384-.228-3.905 1 1.04-3.807-.25-.39a10.53 10.53 0 0 1-1.615-5.665c0-5.82 4.735-10.56 10.564-10.56 5.822 0 10.56 4.74 10.56 10.56 0 5.823-4.738 10.56-10.66 10.56Zm5.79-7.912c-.318-.16-1.882-.928-2.174-1.035-.29-.107-.502-.16-.714.16-.21.32-.82 1.035-1.005 1.248-.185.213-.37.24-.688.08-.318-.16-1.343-.494-2.558-1.573-.945-.842-1.583-1.882-1.768-2.2-.185-.32-.02-.492.14-.652.143-.142.318-.372.478-.558.16-.186.212-.32.318-.532.106-.213.053-.398-.027-.558-.08-.16-.714-1.72-.978-2.353-.258-.617-.52-.533-.714-.543-.185-.008-.398-.01-.61-.01-.213 0-.558.08-.85.398-.29.32-1.11 1.084-1.11 2.645 0 1.56 1.137 3.068 1.296 3.28.16.213 2.238 3.42 5.424 4.797.758.327 1.35.523 1.81.67.76.242 1.452.208 2 .126.61-.09 1.882-.77 2.148-1.512.265-.744.265-1.38.185-1.513-.08-.133-.29-.213-.61-.373Z" />
        </svg>
      </a>
    </div>
  );
}
