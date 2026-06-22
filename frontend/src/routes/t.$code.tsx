import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Clock,
  Stethoscope,
  Phone,
  MapPin,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import { PageLoader } from "@/components/tymely/Loader";

type QueuePatient = {
  id: string;
  token: number;
  name: string;
  phone: string;
  age: number;
  gender: "M" | "F";
  reason: string;
  arrivedAt: string;
  waitMins: number;
  status: "waiting" | "current" | "done" | "skipped" | "rescheduled";
  amount?: number;
  trackingCode?: string;
};

export const Route = createFileRoute("/t/$code")({
  head: () => ({
    meta: [
      { title: "Live Queue Status — Tymely" },
      { name: "description", content: "Track your clinic queue token number and estimated wait time live." },
    ],
  }),
  component: GuestTrackerPage,
});

function GuestTrackerPage() {
  const { code } = Route.useParams();
  const [queue, setQueue] = useState<QueuePatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const loadQueue = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const response = await fetch(`${apiBase}/api/public/track/${code}`);
        if (response.ok) {
          const data = await response.json();
          setQueue(data);
        }
      } catch (err) {
        console.error("Error fetching guest queue details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadQueue();
    // Poll the backend every 3 seconds for live tracking updates
    const interval = setInterval(loadQueue, 3000);

    // Visual sync pulsing effect
    const pulseInterval = setInterval(() => {
      setPulse((p) => !p);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(pulseInterval);
    };
  }, [code]);

  if (loading) {
    return <PageLoader />;
  }

  const patient = queue.find((p) => p.trackingCode === code);

  if (!patient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#080808] px-6 text-center text-white">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-500/10 text-red-500">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="font-display mt-6 text-3xl font-semibold">Tracking Link Expired</h2>
        <p className="mt-2 max-w-sm text-sm text-text-secondary">
          We couldn't find an active queue ticket matching this code. You may have already completed your consultation or the link is invalid.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="rounded-full bg-emerald px-6 py-2.5 text-xs font-semibold text-[#062014] transition hover:brightness-110"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Calculate position in queue
  const waitingPatients = queue.filter((p) => p.status === "waiting");
  const myIndex = waitingPatients.findIndex((p) => p.id === patient.id);
  const patientsAhead = myIndex > -1 ? myIndex : 0;
  const isCurrent = patient.status === "current";
  const isDone = patient.status === "done";
  const isSkipped = patient.status === "skipped";

  // Calculate wait time
  const estWait = isCurrent ? 0 : isDone ? 0 : (patientsAhead + 1) * 10;

  return (
    <div className="relative min-h-screen bg-[#080808] text-white">
      <main className="mx-auto max-w-md px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222] pb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald" />
            <span className="font-display text-xl font-medium tracking-tight text-white">
              Mehra Family Clinic
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald/20 bg-emerald/5 px-2.5 py-1 text-[10px] text-emerald">
            <span
              className={`h-1.5 w-1.5 rounded-full bg-emerald transition-all duration-500 ${
                pulse ? "scale-125 opacity-100" : "scale-100 opacity-60"
              }`}
            />
            Live Syncing
          </div>
        </div>

        {/* Hero status box */}
        <div className="mt-8 text-center">
          <div className="text-xs uppercase tracking-widest text-text-secondary">
            Your Token Number
          </div>
          <div className="font-display mt-2 text-8xl text-white">
            #{String(patient.token).padStart(2, "0")}
          </div>
          <div className="mt-2 text-lg font-medium text-emerald">{patient.name}</div>
        </div>

        {/* Time Tracking Indicator */}
        <div className="mt-10 rounded-2xl border border-[#222] bg-[#111] p-6 text-center">
          {isCurrent && (
            <div className="space-y-4" style={{ animation: "fade-in 0.4s ease" }}>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald/15 text-emerald">
                <Stethoscope className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-medium text-white">It's your turn!</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  Please proceed to the doctor's consulting room now.
                </p>
              </div>
            </div>
          )}

          {isDone && (
            <div className="space-y-4" style={{ animation: "fade-in 0.4s ease" }}>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald/15 text-emerald">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-medium text-white">Consultation Finished</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  Thank you for visiting! Get well soon.
                </p>
              </div>
            </div>
          )}

          {isSkipped && (
            <div className="space-y-4" style={{ animation: "fade-in 0.4s ease" }}>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-500/10 text-red-500">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-medium text-white">You were skipped</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  You were called but were not present. Please see the receptionist to rejoin.
                </p>
              </div>
            </div>
          )}

          {!isCurrent && !isDone && !isSkipped && (
            <div className="space-y-6" style={{ animation: "fade-in 0.4s ease" }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#222] bg-[#0A0A0A] p-4">
                  <div className="text-[10px] uppercase tracking-wider text-text-secondary">
                    Patients Ahead
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-white">
                    {patientsAhead === 0 ? "Next Up" : patientsAhead}
                  </div>
                </div>
                <div className="rounded-xl border border-[#222] bg-[#0A0A0A] p-4">
                  <div className="text-[10px] uppercase tracking-wider text-text-secondary">
                    Est. Wait Time
                  </div>
                  <div className="mt-2 flex items-baseline justify-center gap-0.5 text-white">
                    <span className="text-3xl font-semibold">{estWait}</span>
                    <span className="text-xs text-text-secondary font-medium">min</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>Registered</span>
                  <span>Consultation Room</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#0F0F0F]">
                  <div
                    className="h-full rounded-full bg-emerald transition-all duration-1000"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(10, 100 - (patientsAhead + 1) * 15)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic details */}
        <div className="mt-6 rounded-2xl border border-[#222] bg-[#111] p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Visit Details
          </h3>
          <div className="mt-4 space-y-3">
            {[
              { k: "Reason for visit", v: patient.reason },
              { k: "Arrival time", v: patient.arrivedAt },
              { k: "Consultation fees", v: `₹${patient.amount || 500}` },
            ].map((d) => (
              <div
                key={d.k}
                className="flex items-center justify-between border-b border-[#1A1A1A] py-2 last:border-0"
              >
                <span className="text-xs text-text-secondary">{d.k}</span>
                <span className="text-sm font-medium text-white">{d.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call & Navigate quick actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <a
            href="tel:+919820112345"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#222] bg-[#111] py-3 text-sm font-medium text-text-secondary transition hover:text-white"
          >
            <Phone className="h-4 w-4 text-emerald" /> Call Clinic
          </a>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#222] bg-[#111] py-3 text-sm font-medium text-text-secondary transition hover:text-white"
          >
            <MapPin className="h-4 w-4 text-emerald" /> Directions
          </a>
        </div>
      </main>
    </div>
  );
}
