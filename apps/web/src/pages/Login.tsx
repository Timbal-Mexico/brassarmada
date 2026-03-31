import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { isSupabaseConfigured, signInWithPassword, useUser } from "@/lib/supabase";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null | undefined)?.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailOk = useMemo(() => (email.length ? isValidEmail(email) : false), [email]);
  const passwordOk = useMemo(() => (password.length ? password.length >= 6 : false), [password]);
  const canSubmit = emailOk && passwordOk && !isSubmitting;

  const user = useUser();
  if (user.data) return <Navigate to={from || "/"} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!canSubmit) return;
    setIsSubmitting(true);

    const res = await signInWithPassword({ email: email.trim(), password });
    if (res.error) {
      setIsSubmitting(false);
      toast({ title: "No se pudo iniciar sesión", description: res.error.message });
      return;
    }

    await user.refetch();
    setIsSubmitting(false);
    toast({ title: "Bienvenido", description: "Acceso concedido." });
    navigate(from || "/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />
      <section className="border-b border-black bg-white px-4 py-16">
        <div className="mx-auto w-full max-w-lg">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black">Acceso</div>
          <h1 className="mt-2 font-heading text-4xl font-black tracking-tighter text-black">LOGIN</h1>

          {!isSupabaseConfigured ? (
            <div className="mt-6 border border-black bg-white p-4 font-body text-[10px] tracking-[0.2em] text-black uppercase">
              Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.
            </div>
          ) : null}

          <form onSubmit={submit} className="mt-10 grid gap-4">
            <div>
              <label className="block font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                type="email"
                className={`mt-2 h-11 w-full border bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black outline-none ${
                  touched.email && !emailOk ? "border-red-600" : "border-black"
                }`}
                placeholder="tu@email.com"
                aria-label="Email"
              />
            </div>

            <div>
              <label className="block font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">
                Contraseña
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                type="password"
                className={`mt-2 h-11 w-full border bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black outline-none ${
                  touched.password && !passwordOk ? "border-red-600" : "border-black"
                }`}
                placeholder="••••••••"
                aria-label="Contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit || !isSupabaseConfigured}
              className="mt-4 h-11 border border-black bg-black px-6 font-heading text-[10px] font-black tracking-[0.2em] text-white uppercase hover:opacity-80 disabled:opacity-40"
            >
              {isSubmitting ? "Ingresando…" : "Ingresar"}
            </button>

            <div className="mt-2 flex items-center justify-between">
              <Link to="/" className="font-body text-[10px] tracking-[0.2em] text-black uppercase hover:opacity-60">
                Volver
              </Link>
              <a
                href="https://app.brassarmada.com.mx/login"
                className="font-body text-[10px] tracking-[0.2em] text-black uppercase hover:opacity-60"
              >
                Ir a Admin
              </a>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;

