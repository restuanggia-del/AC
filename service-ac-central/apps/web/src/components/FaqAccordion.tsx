import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { FAQItem } from "../types";

export default function FaqAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?._id ?? null);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white">
      {faqs.map((faq) => {
        const isOpen = openId === faq._id;
        return (
          <div key={faq._id} className="px-5">
            <button
              onClick={() => setOpenId(isOpen ? null : faq._id)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="font-semibold text-ink-900">{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-ink-400 transition ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <p className="pb-4 text-sm leading-relaxed text-ink-500">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
