import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bands } from "@/data/bands";
import { trackEvent, getUtmParams } from "@/lib/analytics";
import { submitLead, type LeadFormData } from "@/lib/kommo";

const formSchema = z.object({
  eventName: z.string().trim().min(2, "Mínimo 2 caracteres").max(100),
  date: z.string().min(1, "Selecciona una fecha"),
  band: z.string().min(1, "Selecciona una banda"),
  phone: z.string().trim().min(10, "Mínimo 10 dígitos").max(15).regex(/^[0-9+\- ]+$/, "Solo números"),
  budget: z.string().min(1, "Selecciona un presupuesto"),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  preselectedBand?: string;
  onSuccess?: () => void;
  variant?: "sticky" | "inline" | "modal";
}

const ContactForm = ({ preselectedBand, onSuccess, variant = "inline" }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      band: preselectedBand || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const utm = getUtmParams();

    const leadData: LeadFormData = {
      eventName: values.eventName,
      date: values.date,
      band: values.band,
      phone: values.phone,
      budget: values.budget,
      utm_source: utm.utm_source || "",
      utm_medium: utm.utm_medium || "",
      utm_campaign: utm.utm_campaign || "",
      page_url: utm.page_url || "",
    };

    await submitLead(leadData);
    trackEvent("lead_submit", { band: values.band, budget: values.budget });
    setSubmitted(true);
    setIsSubmitting(false);
    onSuccess?.();
  };

  if (submitted) {
    return (
      <div className="rounded-sm border border-primary bg-card p-6 text-center">
        <p className="font-heading text-lg text-primary">¡Solicitud Enviada!</p>
        <p className="mt-2 font-body text-sm text-muted-foreground">
          Te contactaremos en menos de 24 horas.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register("eventName")}
          placeholder="Nombre del evento"
          className="touch-target w-full rounded-sm border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {errors.eventName && <p className="mt-1 font-body text-xs text-destructive">{errors.eventName.message}</p>}
      </div>

      <div>
        <input
          {...register("date")}
          type="date"
          className="touch-target w-full rounded-sm border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {errors.date && <p className="mt-1 font-body text-xs text-destructive">{errors.date.message}</p>}
      </div>

      <div>
        <select
          {...register("band")}
          className="touch-target w-full rounded-sm border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Selecciona una banda</option>
          {bands.map((b) => (
            <option key={b.id} value={b.slug}>{b.name}</option>
          ))}
        </select>
        {errors.band && <p className="mt-1 font-body text-xs text-destructive">{errors.band.message}</p>}
      </div>

      <div>
        <input
          {...register("phone")}
          type="tel"
          placeholder="Teléfono (10 dígitos)"
          className="touch-target w-full rounded-sm border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {errors.phone && <p className="mt-1 font-body text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <div>
        <select
          {...register("budget")}
          className="touch-target w-full rounded-sm border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Presupuesto estimado</option>
          <option value="0-20k">$0 — $20,000 MXN</option>
          <option value="20-50k">$20,000 — $50,000 MXN</option>
          <option value="50k+">$50,000+ MXN</option>
        </select>
        {errors.budget && <p className="mt-1 font-body text-xs text-destructive">{errors.budget.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="touch-target w-full rounded-sm bg-primary px-6 py-4 font-heading text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Enviando..." : "Solicitar Cotización"}
      </button>
    </form>
  );
};

export default ContactForm;
