import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 480);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Kembali ke atas"
      title="Kembali ke atas"
      className={`fixed bottom-6 left-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white/90 text-ink-600 shadow-lg shadow-ink-900/10 backdrop-blur transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-300 hover:text-brand-700 hover:shadow-brand-600/20 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
    </button>
  );
}
