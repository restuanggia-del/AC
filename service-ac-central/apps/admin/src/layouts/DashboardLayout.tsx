import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen gap-3 overflow-hidden p-3 lg:gap-4 lg:p-4">
      <Sidebar />
      <div className="flex flex-1 flex-col gap-3 overflow-hidden lg:gap-4">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
