import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import LocationPage from "./pages/LocationPage";
import NotFound from "./pages/NotFound";
import PortfolioPage from "./pages/PortfolioPage";
import Pricing from "./pages/Pricing";
import Services from "./pages/Services";
import Team from "./pages/Team";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="tentang" element={<About />} />
          <Route path="layanan" element={<Services />} />
          <Route path="harga" element={<Pricing />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="team" element={<Team />} />
          <Route path="lokasi" element={<LocationPage />} />
          <Route path="kontak" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
