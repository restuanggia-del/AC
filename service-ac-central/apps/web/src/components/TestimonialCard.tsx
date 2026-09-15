import type { Testimonial } from "../types";
import RatingStars from "./RatingStars";

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink-900/5">
      <RatingStars rating={testimonial.rating} />
      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">
        “{testimonial.message}”
      </p>
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
          {testimonial.customerName.charAt(0)}
        </div>
        <p className="text-sm font-bold text-ink-900">
          {testimonial.customerName}
        </p>
      </div>
    </div>
  );
}
