import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import {
  Check, SkipForward, RefreshCw, Trash2, ChevronRight, Pause, Play,
  RotateCcw, UserPlus, Search, Clock,
} from "lucide-react";
import { useClinic } from "@/lib/api/clinic-state";

export const Route = createFileRoute("/dashboard/queue")({
  component: QueuePage,
});

function QueuePage() {
  const {
    queuePatients,
    markPatientDone,
    skipPatient,
    reschedulePatient,
    removePatient,
    resetQueue,
  } = useClinic();

  const [paused, setPaused] = useState(false);
  const [q, setQ] = useState("");

  const current = queuePatients.find((p) => p.status === "current");
  const waiting = queuePatients.filter((p) => p.status === "waiting");
  const next3 = waiting.slice(0, 3);
  const filtered = waiting.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setPaused((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition cursor-pointer"
          style={{
            borderColor: paused ? "#EF4444" : "#52B788",
            color: paused ? "#EF4444" : "#52B788",
            backgroundColor: paused ? "rgba(239,68,68,0.08)" : "rgba(82,183,136,0.08)",
          }}
        >
          {paused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          Queue {paused ? "Paused" : "Active"}
        </button>
        <button
          onClick={resetQueue}
          className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface px-4 py-2.5 text-sm text-text-secondary transition hover:text-foreground cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" /> Reset Queue
        </button>
        <Link
          to="/dashboard/add-patient"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2.5 text-sm font-medium text-[#062014] transition hover:brightness-110"
        >
          <UserPlus className="h-4 w-4" /> Add Patient
        </Link>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find in queue…"
            className="h-10 w-72 rounded-lg border border-border-subtle bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-text-muted outline-none focus:border-emerald"
          />
        </div>
      </div>

      {/* Hero current */}
      {current ? (
        <div className="relative overflow-hidden rounded-2xl border border-emerald/30 bg-gradient-to-br from-emerald/15 via-surface to-ink-alt p-8">
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald/15 blur-3xl" />
          <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-emerald">Now serving</div>
              <div className="font-display mt-2 text-8xl text-foreground">#{String(current.token).padStart(2, "0")}</div>
            </div>
            <div>
              <div className="font-display text-4xl text-foreground">{current.name}</div>
              <div className="mt-2 text-sm text-text-secondary">
                {current.phone} · {current.age}y · {current.gender === "M" ? "Male" : "Female"}
              </div>
              <div className="mt-1 text-sm text-text-secondary">Reason: {current.reason}</div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-ink-alt px-3 py-1 text-xs text-text-secondary">
                <Clock className="h-3 w-3 text-emerald" /> Consultation timer · {current.arrivedAt}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => markPatientDone(current.id)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald px-5 py-3 text-sm font-medium text-[#062014] transition hover:brightness-110 cursor-pointer"
              >
                <Check className="h-4 w-4" /> Mark Done
              </button>
              <button
                onClick={() => skipPatient(current.id)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#F59E0B]/50 px-5 py-3 text-sm text-[#F59E0B] transition hover:bg-[#F59E0B]/10 cursor-pointer"
              >
                <SkipForward className="h-4 w-4" /> Skip
              </button>
              <button
                onClick={() => reschedulePatient(current.id)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#3B82F6]/50 px-5 py-3 text-sm text-[#3B82F6] transition hover:bg-[#3B82F6]/10 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" /> Reschedule
              </button>
              <button
                onClick={() => removePatient(current.id)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#EF4444]/50 px-5 py-3 text-sm text-[#EF4444] transition hover:bg-[#EF4444]/10 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border-subtle bg-surface p-16 text-center">
          <div className="text-text-secondary">No patients currently in consultation.</div>
        </div>
      )}

      {/* Next up */}
      <div>
        <div className="mb-3 text-xs uppercase tracking-wider text-text-secondary">Next up</div>
        <div className="flex items-stretch gap-3">
          {next3.length > 0 ? (
            next3.map((p, i) => (
              <Fragment key={p.id}>
                <div className="flex-1 rounded-xl border border-border-subtle bg-surface p-4 transition hover:-translate-y-1 hover:border-emerald/40">
                  <div className="font-mono-dm text-lg text-emerald">#{String(p.token).padStart(2, "0")}</div>
                  <div className="mt-1 text-sm font-medium text-foreground">{p.name}</div>
                  <div className="text-xs text-text-secondary">{p.waitMins} min wait</div>
                </div>
                {i < next3.length - 1 && (
                  <div className="grid place-items-center text-text-muted">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                )}
              </Fragment>
            ))
          ) : (
            <div className="flex-1 rounded-xl border border-dashed border-border-subtle p-6 text-center text-xs text-text-secondary">
              No upcoming patients.
            </div>
          )}
        </div>
      </div>

      {/* Full queue table */}
      <div className="rounded-2xl border border-border-subtle bg-surface">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-display text-xl text-foreground">Full queue</h3>
          <span className="text-xs text-text-secondary">{filtered.length} patients</span>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead className="bg-ink-alt text-xs uppercase tracking-wider text-text-secondary">
            <tr>
              <th className="px-6 py-3 text-left">Token</th>
              <th className="px-6 py-3 text-left">Patient</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Arrived</th>
              <th className="px-6 py-3 text-left">Wait</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((p) => {
                const color = p.waitMins < 15 ? "#4CAF50" : p.waitMins < 30 ? "#F59E0B" : "#EF4444";
                return (
                  <tr key={p.id} className="border-t border-border transition hover:bg-surface-alt">
                    <td className="px-6 py-3 font-mono-dm text-emerald">#{String(p.token).padStart(2, "0")}</td>
                    <td className="px-6 py-3">
                      <div className="text-foreground">{p.name}</div>
                      <div className="text-xs text-text-secondary">{p.reason}</div>
                    </td>
                    <td className="px-6 py-3 text-text-secondary">{p.phone}</td>
                    <td className="px-6 py-3 text-text-secondary">{p.arrivedAt}</td>
                    <td className="px-6 py-3">
                      <span className="rounded-full px-2.5 py-1 text-[11px]" style={{ backgroundColor: color + "22", color }}>
                        {p.waitMins} min
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => markPatientDone(p.id)}
                          title="Done"
                          className="grid h-8 w-8 place-items-center rounded-md border border-border-subtle text-emerald transition hover:bg-emerald/10 cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => skipPatient(p.id)}
                          title="Skip"
                          className="grid h-8 w-8 place-items-center rounded-md border border-border-subtle text-[#F59E0B] transition hover:bg-[#F59E0B]/10 cursor-pointer"
                        >
                          <SkipForward className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => reschedulePatient(p.id)}
                          title="Reschedule"
                          className="grid h-8 w-8 place-items-center rounded-md border border-border-subtle text-[#3B82F6] transition hover:bg-[#3B82F6]/10 cursor-pointer"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center text-xs text-text-secondary">
                  No waiting patients match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
