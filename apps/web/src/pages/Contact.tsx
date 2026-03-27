import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const normalizeDigits = (value: string) => value.replace(/\D/g, "");

const isValidMxPhone = (raw: string) => {
  const digits = normalizeDigits(raw);
  if (digits.length === 10) return true;
  if (digits.length === 12 && digits.startsWith("52")) return true;
  if (digits.length === 13 && digits.startsWith("521")) return true;
  return false;
};

const isValidEmail = (value: string) => {
  const v = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};

const ContactPage = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState({ phone: false, email: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const phoneOk = useMemo(() => (phone.trim().length ? isValidMxPhone(phone) : false), [phone]);
  const emailOk = useMemo(() => (email.trim().length ? isValidEmail(email) : false), [email]);

  const phoneError = touched.phone && !phoneOk ? "Ingresa un teléfono válido (MX)." : "";
  const emailError = touched.email && !emailOk ? "Ingresa un email válido." : "";

  const canSubmit = phoneOk && emailOk && !isSubmitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ phone: true, email: true });
    if (!phoneOk || !emailOk) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsSubmitting(false);
    setPhone("");
    setEmail("");
    setTouched({ phone: false, email: false });
    toast({
      title: "Solicitud enviada",
      description: "Te contactaremos para una consulta inicial y definir el siguiente paso.",
    });
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <section className="border-b border-black bg-white">
        <div className="border-b border-black">
          <div className="h-[200px] w-full overflow-hidden bg-black">
            <img
              src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=2000&auto=format&fit=crop"
              alt="Banner contacto"
              loading="eager"
              className="h-full w-full object-cover grayscale"
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl px-4 py-16">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-6">
              <h1 className="font-heading text-4xl font-black tracking-tighter text-black md:text-6xl">
                CONTACTO
              </h1>
              <p className="mt-6 font-body text-sm leading-relaxed tracking-widest text-black uppercase font-light">
                Este es el primer paso del proceso de contratación. Déjanos tu teléfono y tu correo y te contactaremos
                para una consulta inicial.
              </p>
            </div>

            <div className="md:col-span-6">
              <form onSubmit={onSubmit} className="border border-black bg-white p-8">
                <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">
                  SOLICITAR LLAMADA
                </div>
                <div className="mt-4 border border-black bg-white p-4 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-70">
                  Comparte tus datos. Un asesor te contactará para entender tu evento y proponerte opciones.
                </div>
                <div className="mt-4 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60">
                  Disponibilidad: solo por WhatsApp (canal oficial).
                </div>

                <div className="mt-8 grid gap-4">
                  <div>
                    <label className="block font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">
                      TELÉFONO
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                      placeholder="+52 33 3466 9630"
                      aria-label="Teléfono"
                      className={`mt-2 h-12 w-full rounded-none border bg-white px-4 font-body text-[10px] tracking-[0.2em] text-black placeholder:text-black/40 focus:outline-none ${
                        phoneError ? "border-red-600" : "border-black"
                      }`}
                    />
                    {phoneError ? (
                      <div className="mt-2 font-body text-[10px] tracking-[0.2em] text-black uppercase">
                        {phoneError}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label className="block font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      placeholder="tu@email.com"
                      aria-label="Email"
                      className={`mt-2 h-12 w-full rounded-none border bg-white px-4 font-body text-[10px] tracking-[0.2em] text-black placeholder:text-black/40 focus:outline-none ${
                        emailError ? "border-red-600" : "border-black"
                      }`}
                    />
                    {emailError ? (
                      <div className="mt-2 font-body text-[10px] tracking-[0.2em] text-black uppercase">
                        {emailError}
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="mt-8 h-12 w-full border border-black bg-black px-6 font-heading text-[10px] font-black tracking-[0.2em] text-white disabled:opacity-40"
                >
                  {isSubmitting ? "ENVIANDO…" : "COMENZAR PROCESO"}
                </button>

                <div className="mt-6 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60">
                  Te contactaremos para una consulta inicial y definir el siguiente paso.
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
