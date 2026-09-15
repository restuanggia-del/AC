import { useEffect, useRef, useState } from "react";

/**
 * Mendeteksi kapan sebuah elemen masuk/keluar viewport.
 * `inView` di-toggle dua arah (true saat masuk, false saat keluar)
 * sehingga animasi bisa terpicu ulang baik saat scroll ke bawah
 * maupun scroll ke atas.
 */
export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = {},
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
        ...options,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
