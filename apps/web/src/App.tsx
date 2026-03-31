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
import ArtistPanel from "./pages/ArtistPanel.tsx";
import RequireWebAuth from "./components/RequireWebAuth.tsx";
import NewsIndex from "./pages/NewsIndex.tsx";
import NewsDetail from "./pages/NewsDetail.tsx";
import ContactPage from "./pages/Contact.tsx";
import StorePage from "./pages/Store.tsx";
import ProjectsPage from "./pages/Projects.tsx";
import Login from "./pages/Login.tsx";
import LoginRedirect from "./pages/LoginRedirect.tsx";

// New Pages (Placeholders for now)

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
          <Route path="/noticias" element={<NewsIndex />} />
          <Route path="/noticias/:slug" element={<NewsDetail />} />
          <Route path="/proyectos" element={<ProjectsPage />} />
          <Route path="/artistas" element={<ArtistsPage />} />
          <Route path="/artistas/:slug" element={<ArtistProfile />} />
          <Route path="/panel/perfil" element={<RequireWebAuth><ArtistPanel /></RequireWebAuth>} />
          <Route path="/panel/artistas/:slug" element={<RequireWebAuth><ArtistPanel /></RequireWebAuth>} />
          <Route path="/tienda" element={<StorePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<LoginRedirect />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
