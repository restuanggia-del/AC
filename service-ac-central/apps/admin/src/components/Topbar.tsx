import { Menu } from "lucide-react";
import { useState } from "react";
import MobileSidebar from "./MobileSidebar";
import UserMenu from "./UserMenu";

export default function Topbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3 lg:px-6">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-ink-600 hover:bg-ink-50 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden lg:block" />

        <UserMenu />
      </header>

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
