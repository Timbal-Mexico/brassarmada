import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { createRevenueEvent, fetchMyArtist, listRevenueEvents } from "@/lib/artistApi";
import type { ArtistRevenueEvent } from "@/lib/artistApi";
import { useProfile } from "@brassarmada/supabase";
import { RoleGate } from "@brassarmada/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { startOfDay, subDays } from "date-fns";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const lastDays = 30;

const schema = z.object({
  source: z.enum(["streaming", "tickets", "merch", "other"]),
  amount: z.coerce.number().positive(),
  currency: z.string().min(3).max(3).default("MXN"),
  note: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

const money = (cents: number, currency: string) => {
  const amount = cents / 100;
  try {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
};

const ArtistMonetization = () => {
  const queryClient = useQueryClient();
  const profile = useProfile();
  const userId = profile.data?.id ?? null;

  const myArtist = useQuery({
    queryKey: ["artist-self", userId],
    enabled: !!userId,
    queryFn: async () => fetchMyArtist(userId ?? ""),
    staleTime: 10_000,
  });

  const artistId = myArtist.data?.id ?? null;
  const sinceISO = useMemo(() => subDays(startOfDay(new Date()), lastDays - 1).toISOString(), []);

  const revenue = useQuery({
    queryKey: ["artist-revenue", artistId, sinceISO],
    enabled: !!artistId,
    queryFn: async () => listRevenueEvents(artistId ?? "", sinceISO),
    staleTime: 10_000,
  });

  const totals = useMemo(() => {
    const rows: ArtistRevenueEvent[] = revenue.data ?? [];
    const bySource = rows.reduce(
      (acc, r) => {
        acc.totalCents += r.amount_cents;
        acc.bySource[r.source] = (acc.bySource[r.source] ?? 0) + r.amount_cents;
        acc.currency = r.currency || acc.currency;
        return acc;
      },
      { totalCents: 0, bySource: {} as Record<string, number>, currency: "MXN" },
    );
    return bySource;
  }, [revenue.data]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { source: "streaming", amount: 0, currency: "MXN", note: "" },
    mode: "onBlur",
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!artistId) return;
      const amount_cents = Math.round(values.amount * 100);
      await createRevenueEvent(artistId, {
        source: values.source,
        amount_cents,
        currency: (values.currency || "MXN").toUpperCase(),
        note: values.note?.trim() || null,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["artist-revenue"] });
      form.reset({ source: "streaming", amount: 0, currency: "MXN", note: "" });
      toast({ title: "Registrado", description: "Ingreso agregado." });
    },
    onError: (e) => toast({ title: "Error", description: (e as Error).message }),
  });

  const ensureArtist = () => {
    if (myArtist.isLoading) return { ok: false, node: <div className="rounded-lg border border-border bg-card/50 p-6 text-sm text-muted-foreground">Cargando…</div> };
    if (myArtist.isError) return { ok: false, node: <div className="rounded-lg border border-red-600 bg-red-50 p-6 text-sm text-red-700">Error: {(myArtist.error as Error).message}</div> };
    if (!myArtist.data) {
      return {
        ok: false,
        node: (
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <div className="text-sm text-foreground">Primero crea tu perfil de artista.</div>
            <Link to="/profile" className="mt-4 inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm">
              Ir a Mi Perfil
            </Link>
          </div>
        ),
      };
    }
    return { ok: true, node: null };
  };

  const gate = ensureArtist();

  return (
    <RoleGate roles={["artista"]}>
      <DashboardLayout>
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Panel</div>
          <h1 className="mt-2 text-3xl font-display font-bold text-foreground">Monetización</h1>
          <div className="mt-2 text-sm text-muted-foreground">{myArtist.data?.stage_name ?? ""}</div>
        </div>

        {!gate.ok ? gate.node : null}

        {gate.ok ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-card p-6 md:col-span-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total (30d)</div>
                <div className="mt-2 text-3xl font-display font-bold text-foreground">{money(totals.totalCents, totals.currency)}</div>
              </div>
              <div className="glass-card p-6">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Streaming</div>
                <div className="mt-2 text-xl font-display font-bold text-foreground">{money(totals.bySource.streaming ?? 0, totals.currency)}</div>
              </div>
              <div className="glass-card p-6">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tickets</div>
                <div className="mt-2 text-xl font-display font-bold text-foreground">{money(totals.bySource.tickets ?? 0, totals.currency)}</div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5 rounded-lg border border-border bg-card/50 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Agregar ingreso</div>
                <form className="mt-4 grid gap-4" onSubmit={form.handleSubmit((v) => createMutation.mutate(v))}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Fuente</label>
                      <select {...form.register("source")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm">
                        <option value="streaming">Streaming</option>
                        <option value="tickets">Tickets</option>
                        <option value="merch">Merch</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Monto</label>
                      <input {...form.register("amount")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Moneda</label>
                      <input {...form.register("currency")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Nota</label>
                      <input {...form.register("note")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="h-10 rounded-md border border-border bg-background px-4 text-sm" disabled={createMutation.isPending}>
                      Guardar
                    </button>
                  </div>
                </form>
              </div>

              <div className="lg:col-span-7 rounded-lg border border-border bg-card/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/20">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Movimientos (30d)</div>
                </div>
                <div className="overflow-auto">
                  <table className="min-w-[820px] w-full">
                    <thead className="border-b border-border bg-muted/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Fecha</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Fuente</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Nota</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(revenue.data ?? []).map((r) => (
                        <tr key={r.id} className="border-b border-border/60">
                          <td className="px-4 py-3 text-sm text-foreground">{new Date(r.occurred_at).toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-foreground">{r.source}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{r.note ?? "—"}</td>
                          <td className="px-4 py-3 text-right text-sm text-foreground">{money(r.amount_cents, r.currency)}</td>
                        </tr>
                      ))}
                      {revenue.isLoading ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                            Cargando…
                          </td>
                        </tr>
                      ) : null}
                      {revenue.isError ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-red-700">
                            {(revenue.error as Error).message}
                          </td>
                        </tr>
                      ) : null}
                      {!revenue.isLoading && (revenue.data ?? []).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                            Sin movimientos
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </DashboardLayout>
    </RoleGate>
  );
};

export default ArtistMonetization;
