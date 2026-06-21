import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users, IndianRupee, Clock, CheckCircle2, ArrowUpRight,
  Check, SkipForward, RefreshCw, UserPlus, ChevronDown, ChevronUp, Plus,
} from "lucide-react";
import { CountUp } from "@/components/tymely/Reveal";
import { useClinic } from "@/lib/api/clinic-state";

export const Route = createFileRoute("/dashboard/")({
  component: OverviewPage,
});

function OverviewPage() {
  const {
    queuePatients,
    activityFeed,
    earningsChart,
    markPatientDone,
    skipPatient,
    reschedulePatient,
    addManualEarning,
    callNextPatient,
  } = useClinic();

  const [showCompleted, setShowCompleted] = useState(false);
  const [earningInput, setEarningInput] = useState("");
  const [recent, setRecent] = useState<{ amt: number; t: string }[]>([]);

  const current = queuePatients.find((p) => p.status === "current");
  const waiting = queuePatients.filter((p) => p.status === "waiting");
  const done = queuePatients.filter((p) => p.status === "done");

  // Calculate dynamic stats
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayDay = days[new Date().getDay()];
  const todayEarnings = earningsChart.find((e) => e.day === todayDay)?.value || 0;

  const completedCount = done.length;
  const completedPercentage = queuePatients.length > 0 ? Math.round((completedCount / queuePatients.length) * 100) : 0;
  const avgWait = waiting.length * 10;

  const stats = [
    { label: "Patients Today", value: queuePatients.length, suffix: "", icon: Users, delta: `+${waiting.length} waiting`, color: "#52B788" },
    { label: "Earnings Today", value: todayEarnings, prefix: "₹", icon: IndianRupee, delta: "Live", color: "#52B788" },
    { label: "Avg. Wait", value: avgWait, suffix: " min", icon: Clock, delta: "Estimated", color: "#F59E0B" },
    { label: "Completed", value: completedCount, suffix: "", icon: CheckCircle2, delta: `${completedPercentage}%`, color: "#52B788" },
  ];

  const max = Math.max(...earningsChart.map((d) => d.value), 1000);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="group rounded-2xl border border-border-subtle bg-gradient-to-br from-surface to-ink-alt p-6 transition-all hover:-translate-y-1 hover:border-emerald/40 hover:shadow-[0_20px_60px_-20px_rgba(82,183,136,0.25)]"
              style={{ animation: `fade-in 0.4s ease ${i * 0.06}s both` }}
            >
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-border-subtle bg-surface-alt">
                  <Icon className="h-4 w-4" style={{ color: s.color }} />
                </div>
                <span className="text-xs text-emerald">{s.delta}</span>
              </div>
              <div className="mt-6 font-mono-dm text-3xl text-foreground">
                {s.prefix}<CountUp to={s.value} />{s.suffix}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-text-secondary">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Queue panel (2/3) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Current token */}
          {current ? (
            <div className="relative overflow-hidden rounded-2xl border border-emerald/30 bg-gradient-to-br from-emerald/10 via-surface to-ink-alt p-7">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald/15 blur-3xl" />
              <div className="relative flex flex-wrap items-center gap-8">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-emerald">Now serving</div>
                  <div className="font-display mt-2 text-7xl text-foreground">#{String(current.token).padStart(2, "0")}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-3xl text-foreground">{current.name}</div>
                  <div className="mt-1 text-sm text-text-secondary">
                    {current.age}y · {current.gender === "M" ? "Male" : "Female"} · {current.reason}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-ink-alt px-3 py-1 text-xs text-text-secondary">
                    <Clock className="h-3 w-3 text-emerald" /> In consultation · {current.arrivedAt}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => markPatientDone(current.id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2.5 text-sm font-medium text-[#062014] transition hover:brightness-110 cursor-pointer"
                  >
                    <Check className="h-4 w-4" /> Mark Done
                  </button>
                  <button
                    onClick={() => skipPatient(current.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#F59E0B]/50 px-4 py-2.5 text-sm text-[#F59E0B] transition hover:bg-[#F59E0B]/10 cursor-pointer"
                  >
                    <SkipForward className="h-4 w-4" /> Skip
                  </button>
                  <button
                    onClick={() => reschedulePatient(current.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#3B82F6]/50 px-4 py-2.5 text-sm text-[#3B82F6] transition hover:bg-[#3B82F6]/10 cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" /> Reschedule
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border-subtle bg-surface p-12 text-center">
              <div className="text-text-secondary">No patients currently in consultation.</div>
              <Link
                to="/dashboard/add-patient"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-sm font-medium text-[#062014] transition hover:brightness-110"
              >
                <UserPlus className="h-4 w-4" /> Add Patient
              </Link>
            </div>
          )}

          {/* Waiting list */}
          <div className="rounded-2xl border border-border-subtle bg-surface">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <h3 className="font-display text-lg text-foreground">Live Queue</h3>
                <span className="rounded-full bg-emerald/15 px-2.5 py-0.5 text-xs font-medium text-emerald">
                  {waiting.length} waiting
                </span>
              </div>
              <Link
                to="/dashboard/queue"
                className="flex items-center gap-1 text-xs text-text-secondary hover:text-foreground"
              >
                View queue board <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {waiting.length > 0 ? (
                waiting.map((p, i) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-[60px_1fr_auto_auto] items-center gap-4 px-6 py-3.5 transition hover:bg-surface-alt"
                    style={{ animation: `fade-in 0.35s ease ${i * 0.04}s both` }}
                  >
                    <div className="font-mono-dm text-sm text-emerald">#{String(p.token).padStart(2, "0")}</div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{p.name}</div>
                      <div className="text-xs text-text-secondary">{p.reason}</div>
                    </div>
                    <div
                      className="rounded-full px-2.5 py-1 text-[11px]"
                      style={{
                        backgroundColor: p.waitMins < 15 ? "rgba(76,175,80,0.12)" : p.waitMins < 30 ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)",
                        color: p.waitMins < 15 ? "#4CAF50" : p.waitMins < 30 ? "#F59E0B" : "#EF4444",
                      }}
                    >
                      {p.waitMins} min wait
                    </div>
                    <button
                      onClick={() => callNextPatient(p.id)}
                      className="rounded-md border border-border-subtle px-3 py-1.5 text-xs text-text-secondary transition hover:border-emerald hover:text-emerald cursor-pointer"
                    >
                      Call next
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-text-secondary">
                  Queue is empty.
                </div>
              )}
            </div>
          </div>

          {/* Earnings sparkline */}
          <div className="rounded-2xl border border-border-subtle bg-surface p-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h3 className="font-display text-xl text-foreground">This week</h3>
                <p className="text-xs text-text-secondary">Earnings trend</p>
              </div>
              <div className="font-mono-dm text-2xl text-foreground">₹<CountUp to={earningsChart.reduce((a, b) => a + b.value, 0)} /></div>
            </div>
            <div className="flex h-44 items-end gap-3">
              {earningsChart.map((d, i) => (
                <div key={d.day} className="group flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-emerald-dark to-emerald transition-all hover:opacity-90"
                    style={{
                      height: `${(d.value / max) * 100}%`,
                      animation: `fade-in 0.5s ease ${0.1 + i * 0.08}s both`,
                    }}
                  />
                  <div className="text-[11px] text-text-secondary">{d.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity feed */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border-subtle bg-surface">
            <div className="border-b border-border px-6 py-4">
              <h3 className="font-display text-lg text-foreground">Live Activity</h3>
            </div>
            <div className="max-h-[420px] divide-y divide-border overflow-y-auto">
              {activityFeed.length > 0 ? (
                activityFeed.map((a, i) => {
                  const palette = {
                    done: { bg: "rgba(82,183,136,0.12)", color: "#52B788", Icon: Check },
                    added: { bg: "rgba(82,183,136,0.12)", color: "#52B788", Icon: UserPlus },
                    skipped: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B", Icon: SkipForward },
                    rescheduled: { bg: "rgba(59,130,246,0.12)", color: "#3B82F6", Icon: RefreshCw },
                    payment: { bg: "rgba(82,183,136,0.12)", color: "#52B788", Icon: IndianRupee },
                  }[a.type];
                  const Ic = palette.Icon;
                  return (
                    <div
                      key={a.id}
                      className="flex items-start gap-3 px-6 py-3.5"
                      style={{ animation: `fade-in 0.4s ease ${i * 0.05}s both` }}
                    >
                      <div
                        className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full"
                        style={{ backgroundColor: palette.bg }}
                      >
                        <Ic className="h-3.5 w-3.5" style={{ color: palette.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-foreground">{a.text}</p>
                        <p className="mt-0.5 text-[11px] text-text-secondary">{a.time}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-text-secondary">
                  No recent activities.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-6">
            <h3 className="font-display text-lg text-foreground">Quick Cash Entry</h3>
            <p className="text-xs text-text-secondary">For current patient · #{String(current?.token ?? 0).padStart(2, "0")}</p>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const v = Number(earningInput);
                if (!v) return;
                const tokenText = current
                  ? `Token #${String(current.token).padStart(2, "0")}`
                  : "Manual Earning";
                addManualEarning(v, tokenText);
                setRecent((r) => [{ amt: v, t: tokenText }, ...r].slice(0, 4));
                setEarningInput("");
              }}
              className="mt-4 space-y-3"
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">₹</span>
                <input
                  type="number"
                  value={earningInput}
                  onChange={(e) => setEarningInput(e.target.value)}
                  placeholder="Enter custom amount…"
                  className="h-11 w-full rounded-lg border border-border-subtle bg-ink-alt pl-7 pr-3 text-foreground placeholder:text-text-muted outline-none focus:border-emerald font-mono-dm"
                />
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald px-4 text-sm font-medium text-[#062014] transition hover:brightness-110 cursor-pointer">
                <Plus className="h-4 w-4" /> Add Payment
              </button>
            </form>

            {recent.length > 0 && (
              <div className="mt-6">
                <div className="text-xs uppercase tracking-wider text-text-secondary">Recent collections</div>
                <div className="mt-2 space-y-1.5">
                  {recent.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border border-border bg-ink-alt px-3 py-2 text-xs"
                      style={{ animation: `fade-in 0.3s ease both` }}
                    >
                      <span className="text-text-secondary">{r.t}</span>
                      <span className="font-mono-dm text-emerald">+₹{r.amt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completed today */}
      <div className="rounded-2xl border border-border-subtle bg-surface">
        <button
          onClick={() => setShowCompleted((v) => !v)}
          className="flex w-full items-center justify-between px-6 py-5 text-left cursor-pointer"
        >
          <div>
            <h3 className="font-display text-lg text-foreground">Completed Patients Today</h3>
            <p className="text-xs text-text-secondary">
              {done.length} patients finished consultation
            </p>
          </div>
          {showCompleted ? <ChevronUp className="h-5 w-5 text-text-secondary" /> : <ChevronDown className="h-5 w-5 text-text-secondary" />}
        </button>

        {showCompleted && (
          <div className="overflow-hidden border-t border-border" style={{ animation: "fade-in 0.3s ease" }}>
            <table className="w-full text-left border-collapse">
              <thead className="bg-ink-alt text-xs uppercase tracking-wider text-text-secondary">
                <tr>
                  <th className="px-6 py-3 font-medium">Token</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Arrived</th>
                  <th className="px-6 py-3 font-medium text-right">Consultation Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-text-secondary">
                {done.length > 0 ? (
                  done.map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-surface-alt">
                      <td className="px-6 py-3 font-mono-dm text-emerald">#{String(p.token).padStart(2, "0")}</td>
                      <td className="px-6 py-3 text-foreground">{p.name}</td>
                      <td className="px-6 py-3 text-text-secondary">{p.arrivedAt}</td>
                      <td className="px-6 py-3 text-right font-mono-dm text-foreground">₹{p.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-xs text-text-secondary">
                      No patients completed today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
