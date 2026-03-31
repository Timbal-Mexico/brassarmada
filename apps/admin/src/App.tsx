import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import RequireAuth from "@/components/RequireAuth";
import Index from "./pages/Index.tsx";
import Profile from "./pages/Profile.tsx";
import Bands from "./pages/Bands.tsx";
import CalendarPage from "./pages/CalendarPage.tsx";
import Earnings from "./pages/Earnings.tsx";
import Quotations from "./pages/Quotations.tsx";
import Messages from "./pages/Messages.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Users from "./pages/Users.tsx";
import Settings from "./pages/Settings.tsx";
import Artists from "./pages/Artists.tsx";
import { RoleGuard } from "@brassarmada/ui";
import ArtistDetail from "./pages/ArtistDetail.tsx";
import ArtistContent from "./pages/artist/Content.tsx";
import ArtistStats from "./pages/artist/Stats.tsx";
import ArtistAudience from "./pages/artist/Audience.tsx";
import ArtistMonetization from "./pages/artist/Monetization.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/bands" element={<RequireAuth><Bands /></RequireAuth>} />
          <Route path="/calendar" element={<RequireAuth><CalendarPage /></RequireAuth>} />
          <Route path="/earnings" element={<RequireAuth><Earnings /></RequireAuth>} />
          <Route path="/quotations" element={<RequireAuth><Quotations /></RequireAuth>} />
          <Route path="/messages" element={<RequireAuth><Messages /></RequireAuth>} />
          <Route path="/artists" element={<RequireAuth><Artists /></RequireAuth>} />
          <Route path="/artists/:slug" element={<RequireAuth><RoleGuard roles={["admin","super_admin"]}><ArtistDetail /></RoleGuard></RequireAuth>} />
          <Route path="/artist/content" element={<RequireAuth><RoleGuard roles={["artista"]}><ArtistContent /></RoleGuard></RequireAuth>} />
          <Route path="/artist/stats" element={<RequireAuth><RoleGuard roles={["artista"]}><ArtistStats /></RoleGuard></RequireAuth>} />
          <Route path="/artist/audience" element={<RequireAuth><RoleGuard roles={["artista"]}><ArtistAudience /></RoleGuard></RequireAuth>} />
          <Route path="/artist/monetization" element={<RequireAuth><RoleGuard roles={["artista"]}><ArtistMonetization /></RoleGuard></RequireAuth>} />
          <Route path="/users" element={<RequireAuth><RoleGuard roles={["super_admin"]}><Users /></RoleGuard></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
