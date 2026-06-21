import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Phone, MessageSquare, MoreHorizontal } from "lucide-react";
import { useClinic } from "@/lib/api/clinic-state";

export const Route = createFileRoute("/dashboard/patients")({
  component: PatientsPage,
});

function PatientsPage() {
  const { allPatients } = useClinic();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(allPatients[0]?.id ?? null);

  const filtered = allPatients.filter(
    (p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.phone.includes(q)
  );
  
  const active = allPatients.find((p) => p.id === selected) ?? filtered[0];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
      {/* List */}
      <div className="rounded-2xl border border-border-subtle bg-surface">
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or phone…"
              className="h-10 w-full rounded-lg border border-border-subtle bg-ink-alt pl-9 pr-3 text-sm text-foreground placeholder:text-text-muted outline-none focus:border-emerald"
            />
          </div>
          <span className="text-xs text-text-secondary">{filtered.length} patients</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-ink-alt text-xs uppercase tracking-wider text-text-secondary">
              <tr>
                <th className="px-6 py-3 text-left">Patient</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Last visit</th>
                <th className="px-6 py-3 text-right">Visits</th>
                <th className="px-6 py-3 text-right">Paid</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p.id)}
                    className="cursor-pointer border-t border-border transition hover:bg-surface-alt"
                    style={{ backgroundColor: selected === p.id ? "rgba(82,183,136,0.06)" : undefined }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-surface-alt text-xs font-medium text-emerald">
                          {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div className="text-foreground">{p.name}</div>
                          <div className="text-xs text-text-secondary">{p.age}y · {p.gender === "M" ? "Male" : "Female"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary font-mono-dm text-xs">{p.phone}</td>
                    <td className="px-6 py-4 text-text-secondary">{p.lastVisit}</td>
                    <td className="px-6 py-4 text-right font-mono-dm text-foreground">{p.totalVisits}</td>
                    <td className="px-6 py-4 text-right font-mono-dm text-emerald">₹{p.totalPaid.toLocaleString("en-IN")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-text-secondary">
                    No patients registered yet. Add a patient to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient detail */}
      {active ? (
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border-subtle bg-gradient-to-br from-surface to-ink-alt p-6">
            <div className="flex items-start justify-between">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald/15 text-lg font-medium text-emerald">
                {active.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <button className="rounded-md p-1.5 text-text-secondary transition hover:text-foreground cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 font-display text-2xl text-foreground">{active.name}</div>
            <div className="text-xs text-text-secondary">{active.age}y · {active.gender === "M" ? "Male" : "Female"}</div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {active.tags.map((t) => (
                <span key={t} className="rounded-full border border-border-subtle bg-ink-alt px-2.5 py-0.5 text-[11px] text-text-secondary">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a
                href={`tel:${active.phone}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-subtle bg-ink-alt py-2 text-xs text-text-secondary transition hover:text-foreground cursor-pointer"
              >
                <Phone className="h-3.5 w-3.5" /> Call
              </a>
              <a
                href={`https://wa.me/91${active.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald/15 py-2 text-xs text-emerald transition hover:bg-emerald/25 cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-6">
            <h4 className="font-display text-lg text-foreground">Stats</h4>
            <div className="mt-4 space-y-3">
              {[
                { k: "Total visits", v: active.totalVisits },
                { k: "Total paid", v: "₹" + active.totalPaid.toLocaleString("en-IN") },
                { k: "Last visit", v: active.lastVisit },
              ].map((s) => (
                <div key={s.k} className="flex items-center justify-between border-b border-border py-2 last:border-0">
                  <span className="text-xs text-text-secondary">{s.k}</span>
                  <span className="font-mono-dm text-sm text-foreground">{s.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-6">
            <h4 className="font-display text-lg text-foreground">Recent visits</h4>
            <div className="mt-4 space-y-3">
              {["Consultation", "Follow-up"].map((r, i) => (
                <div key={i} className="border-l-2 border-emerald/40 pl-3">
                  <div className="text-sm text-foreground">{r}</div>
                  <div className="text-[11px] text-text-secondary">{i === 0 ? "Today" : "Earlier"}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      ) : (
        <div className="rounded-2xl border border-border-subtle bg-surface p-12 text-center text-text-secondary">
          Select a patient to view details.
        </div>
      )}
    </div>
  );
}
