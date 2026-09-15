import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./layouts/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import ContactMessagesPage from "./pages/ContactMessagesPage";
import Dashboard from "./pages/Dashboard";
import FaqPage from "./pages/FaqPage";
import Login from "./pages/Login";
import LocationsPage from "./pages/LocationsPage";
import PackagesPage from "./pages/PackagesPage";
import PortfolioPage from "./pages/PortfolioPage";
import ServicesPage from "./pages/ServicesPage";
import SettingsPage from "./pages/SettingsPage";
import TeamPage from "./pages/TeamPage";
import TestimonialsPage from "./pages/TestimonialsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="layanan" element={<ServicesPage />} />
          <Route path="paket-harga" element={<PackagesPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="lokasi" element={<LocationsPage />} />
          <Route path="testimoni" element={<TestimonialsPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="pesan" element={<ContactMessagesPage />} />
          <Route path="pengaturan" element={<SettingsPage />} />
          <Route path="akun" element={<AccountSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
