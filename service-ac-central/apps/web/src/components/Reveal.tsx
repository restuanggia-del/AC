import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

type Direction = "up" | "down" | "left" | "right" | "fade" | "scale";

interface RevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
}

const hiddenOffset: Record<Direction, string> = {
  up: "translate-y-10",
  down: "-translate-y-10",
  left: "translate-x-10",
  right: "-translate-x-10",
  fade: "translate-y-0",
  scale: "translate-y-0 scale-95",
};

/**
 * Membungkus konten agar muncul dengan animasi fade + geser saat
 * elemen masuk viewport, dan mengulang animasi tersebut setiap kali
 * elemen kembali terlihat (baik scroll turun maupun scroll naik).
 */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 700,
  className = "",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${
        inView
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : `opacity-0 ${hiddenOffset[direction]}`
      } ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: inView ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
