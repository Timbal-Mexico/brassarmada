import { useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { getAdminTestCredentials } from "@/lib/auth";
import { supabase, useProfile } from "@brassarmada/supabase";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null | undefined)?.from;

  const demo = useMemo(() => getAdminTestCredentials(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailOk = useMemo(() => (email.length ? isValidEmail(email) : false), [email]);
  const passwordOk = useMemo(() => (password.length ? password.length >= 3 : false), [password]);
  const canSubmit = emailOk && passwordOk && !isSubmitting;

  const profile = useProfile();
  if (profile.data) return <Navigate to="/" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!canSubmit) return;
    setIsSubmitting(true);
    const res = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (res.error) {
      setIsSubmitting(false);
      toast({ title: "No se pudo iniciar sesión", description: res.error.message });
      return;
    }
    toast({ title: "Bienvenido", description: "Acceso concedido." });
    navigate(from || "/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-border bg-background/80 backdrop-blur-sm p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Brass Armada Admin</div>
        <h1 className="mt-2 text-3xl font-display font-bold text-foreground">Login</h1>
        <div className="mt-6 border border-border bg-muted/30 p-4 text-xs tracking-wide text-muted-foreground">
          Credenciales de prueba: {demo.email} / {demo.password}
        </div>

        <form onSubmit={submit} className="mt-8 grid gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              type="email"
              className={`mt-2 h-11 w-full rounded-none border bg-background px-3 text-sm text-foreground outline-none ${
                touched.email && !emailOk ? "border-destructive" : "border-border"
              }`}
              placeholder="demo@brassarmada.com.mx"
              aria-label="Email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Contraseña</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              type="password"
              className={`mt-2 h-11 w-full rounded-none border bg-background px-3 text-sm text-foreground outline-none ${
                touched.password && !passwordOk ? "border-destructive" : "border-border"
              }`}
              placeholder="••••••••"
              aria-label="Contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-4 h-11 w-full bg-primary text-primary-foreground disabled:opacity-40"
          >
            {isSubmitting ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
