import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Globe, Lock, MessageSquare, Stethoscope, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

const sections = [
  { id: "clinic", label: "Clinic", icon: Stethoscope },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { id: "language", label: "Language", icon: Globe },
  { id: "security", label: "Security", icon: Lock },
] as const;

function SettingsPage() {
  const [active, setActive] = useState<(typeof sections)[number]["id"]>("clinic");
  const [notif, setNotif] = useState({ sms: true, whatsapp: true, missed: true, dailySummary: false });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
      {/* Tabs */}
      <nav className="space-y-1">
        {sections.map((s) => {
          const Ic = s.icon;
          const on = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
              style={{
                backgroundColor: on ? "rgba(82,183,136,0.1)" : "transparent",
                color: on ? "var(--foreground)" : "var(--text-secondary)",
              }}
            >
              <Ic className="h-4 w-4" style={{ color: on ? "#52B788" : undefined }} />
              {s.label}
            </button>
          );
        })}
      </nav>

      <div className="space-y-6">
        {active === "clinic" && (
          <div className="rounded-2xl border border-border-subtle bg-surface p-8" style={{ animation: "fade-in 0.3s ease" }}>
            <h3 className="font-display text-2xl text-foreground">Clinic details</h3>
            <p className="text-sm text-text-secondary">Shown on receipts and patient SMS.</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { l: "Clinic name", v: "Mehra Family Clinic" },
                { l: "Doctor name", v: "Dr. Rohan Mehra" },
                { l: "Specialty", v: "General Physician" },
                { l: "Phone", v: "+91 98201 12345" },
                { l: "City", v: "Bengaluru" },
                { l: "Consultation fee", v: "₹500" },
              ].map((f) => (
                <div key={f.l}>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-text-secondary">{f.l}</label>
                  <input
                    defaultValue={f.v}
                    className="h-11 w-full rounded-lg border border-border-subtle bg-ink-alt px-3 text-foreground outline-none focus:border-emerald"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => toast.success("Clinic details saved")}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald px-5 py-2.5 text-sm font-medium text-[#062014] transition hover:brightness-110"
              >
                <Save className="h-4 w-4" /> Save changes
              </button>
            </div>
          </div>
        )}

        {active === "notifications" && (
          <div className="rounded-2xl border border-border-subtle bg-surface p-8" style={{ animation: "fade-in 0.3s ease" }}>
            <h3 className="font-display text-2xl text-foreground">Notifications</h3>
            <p className="text-sm text-text-secondary">Choose what gets sent and when.</p>
            <div className="mt-6 divide-y divide-border">
              {[
                { k: "sms" as const, l: "SMS reminders", d: "Token & queue updates via SMS" },
                { k: "whatsapp" as const, l: "WhatsApp booking", d: "Patients book directly on WhatsApp" },
                { k: "missed" as const, l: "Missed appointment alerts", d: "Auto-reschedule no-shows" },
                { k: "dailySummary" as const, l: "Daily summary email", d: "Earnings & patients at 9PM" },
              ].map((opt) => (
                <div key={opt.k} className="flex items-center justify-between py-4">
                  <div>
                    <div className="text-sm text-foreground">{opt.l}</div>
                    <div className="text-xs text-text-secondary">{opt.d}</div>
                  </div>
                  <button
                    onClick={() => setNotif((n) => ({ ...n, [opt.k]: !n[opt.k] }))}
                    className="relative h-6 w-11 rounded-full transition"
                    style={{ backgroundColor: notif[opt.k] ? "#52B788" : "var(--border)" }}
                    aria-pressed={notif[opt.k]}
                  >
                    <span
                      className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                      style={{ left: notif[opt.k] ? 22 : 2 }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "whatsapp" && (
          <div className="rounded-2xl border border-border-subtle bg-surface p-8" style={{ animation: "fade-in 0.3s ease" }}>
            <h3 className="font-display text-2xl text-foreground">WhatsApp Business</h3>
            <p className="text-sm text-text-secondary">Connected · auto-replies live</p>
            <div className="mt-6 rounded-xl border border-emerald/30 bg-emerald/5 p-5">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald" />
                </span>
                <div>
                  <div className="text-sm font-medium text-foreground">+91 98201 12345</div>
                  <div className="text-xs text-text-secondary">42 messages handled today</div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="mb-2 block text-xs uppercase tracking-wider text-text-secondary">Auto-reply template</label>
              <textarea
                rows={4}
                defaultValue="Hi {{name}}, your token is #{{token}} at Mehra Family Clinic. Estimated wait: {{wait}} mins."
                className="w-full resize-none rounded-lg border border-border-subtle bg-ink-alt p-3 text-sm text-foreground outline-none focus:border-emerald font-mono-dm"
              />
            </div>
          </div>
        )}

        {active === "language" && (
          <div className="rounded-2xl border border-border-subtle bg-surface p-8" style={{ animation: "fade-in 0.3s ease" }}>
            <h3 className="font-display text-2xl text-foreground">Language</h3>
            <p className="text-sm text-text-secondary">Pick the language patients see in messages.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["English", "हिन्दी", "मराठी", "தமிழ்", "తెలుగు", "বাংলা", "ગુજરાતી", "ಕನ್ನಡ"].map((l, i) => (
                <button
                  key={l}
                  className="rounded-lg border px-4 py-3 text-sm transition"
                  style={{
                    borderColor: i === 0 ? "#52B788" : "var(--border)",
                    backgroundColor: i === 0 ? "rgba(82,183,136,0.1)" : "var(--ink-alt)",
                    color: i === 0 ? "#52B788" : "var(--text-secondary)",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {active === "security" && (
          <div className="rounded-2xl border border-border-subtle bg-surface p-8" style={{ animation: "fade-in 0.3s ease" }}>
            <h3 className="font-display text-2xl text-foreground">Security</h3>
            <p className="text-sm text-text-secondary">Your account & data protection.</p>
            <div className="mt-6 space-y-3">
              {[
                { l: "Change password", d: "Last changed 3 months ago" },
                { l: "Two-factor authentication", d: "Recommended for clinic accounts" },
                { l: "Active sessions", d: "2 devices signed in" },
                { l: "Export my data", d: "Download patients & earnings" },
              ].map((r) => (
                <button
                  key={r.l}
                  className="flex w-full items-center justify-between rounded-xl border border-border-subtle bg-ink-alt p-4 text-left transition hover:border-emerald/40"
                >
                  <div>
                    <div className="text-sm text-foreground">{r.l}</div>
                    <div className="text-xs text-text-secondary">{r.d}</div>
                  </div>
                  <span className="text-emerald">→</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
