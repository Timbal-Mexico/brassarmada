import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import BandLanding from "./pages/BandLanding.tsx";
import NotFound from "./pages/NotFound.tsx";
import ArtistsPage from "./pages/Artists.tsx";
import ArtistProfile from "./pages/ArtistProfile.tsx";
import ArtistAdmin from "./pages/ArtistAdmin.tsx";

// New Pages (Placeholders for now)
const News = () => <div className="p-20 text-center">NOTICIAS - PRÓXIMAMENTE</div>;
const Projects = () => <div className="p-20 text-center">PROYECTOS - PRÓXIMAMENTE</div>;
const Store = () => <div className="p-20 text-center">TIENDA - PRÓXIMAMENTE</div>;
const Login = () => <div className="p-20 text-center">LOGIN - PRÓXIMAMENTE</div>;
const Contact = () => <div className="p-20 text-center">CONTACTO - PRÓXIMAMENTE</div>;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bandas/:slug" element={<BandLanding />} />
          <Route path="/noticias" element={<News />} />
          <Route path="/proyectos" element={<Projects />} />
          <Route path="/artistas" element={<ArtistsPage />} />
          <Route path="/artistas/:slug" element={<ArtistProfile />} />
          <Route path="/panel/artistas/:slug" element={<ArtistAdmin />} />
          <Route path="/tienda" element={<Store />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
