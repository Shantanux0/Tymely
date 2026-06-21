import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, Clock, FileText, TrendingDown, List, MessageCircle,
  Link as LinkIcon, RefreshCw, IndianRupee, Users, UserPlus, MessageSquare,
  LayoutDashboard, Plus, Check, Quote, Mail, Phone, MapPin,
} from "lucide-react";
import { CustomCursor } from "@/components/tymely/CustomCursor";
import { Navbar } from "@/components/tymely/Navbar";
import { Reveal, CountUp } from "@/components/tymely/Reveal";
import { PageLoader } from "@/components/tymely/Loader";
import modernHospitalChaos from "@/assets/modern_hospital_chaos.png";
import cleanHospitalWaiting from "@/assets/clean_hospital_waiting.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tymely — One dashboard for your clinic" },
      { name: "description", content: "Tymely gives Indian doctors one dashboard to manage queues, track earnings, and auto-book patients on WhatsApp." },
      { property: "og:title", content: "Tymely — One dashboard for your clinic" },
      { property: "og:description", content: "Clinic management software built for Indian doctors. WhatsApp booking, live queue, and earnings tracking." },
    ],
  }),
  component: Index,
});

const UNS = "https://images.unsplash.com";
const img = (id: string, w = 1400) =>
  `${UNS}/${id}?auto=format&fit=crop&w=${w}&q=80`;

function Index() {
  return (
    <div className="relative min-h-screen bg-[#080808] text-white">
      <PageLoader />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorks />
        <DashboardPreview />
        <MissedAppointment />
        <StatsSection />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${img("photo-1629909613654-28e377c37b09", 1920)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.6) 60%, rgba(8,8,8,0.95) 100%)" }}
      />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="orb-drift-a absolute -top-32 -right-24 h-[480px] w-[480px] rounded-full bg-emerald/20 blur-[140px]" />
      <div className="orb-drift-b absolute -bottom-40 -left-32 h-[520px] w-[520px] rounded-full bg-emerald/15 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald/40 bg-emerald/5 px-4 py-1.5 text-xs text-white opacity-0"
          style={{ animation: "fade-in 0.8s ease 0.2s forwards", boxShadow: "0 0 32px rgba(82,183,136,0.18)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald pulse-emerald" />
          Now available for Indian clinics
        </div>

        <h1 className="font-display leading-[1.05] text-[64px] tracking-tight md:text-[96px]">
          <HeroWord text="Less" delay={0.5} />{" "}
          <HeroWord text="Chaos." delay={0.65} className="text-emerald" />
          <br />
          <HeroWord text="More" delay={0.85} />{" "}
          <HeroWord text="Care." delay={1.0} className="text-emerald" />
        </h1>

        <p
          className="mx-auto mt-8 max-w-[600px] text-base text-text-secondary opacity-0 md:text-lg"
          style={{ animation: "fade-in 0.9s ease 1.4s forwards" }}
        >
          Tymely gives doctors one dashboard to manage queues, track earnings, and send WhatsApp appointments automatically. Built for Indian clinics.
        </p>

        <div
          className="mt-10 flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row"
          style={{ animation: "fade-in 0.9s ease 1.7s forwards" }}
        >
          <Link
            to="/register"
            data-cursor="button"
            className="group inline-flex items-center gap-2 rounded-full bg-emerald px-7 py-3.5 text-sm font-medium text-[#062014] transition-all hover:scale-[1.03] hover:shadow-[0_0_48px_rgba(82,183,136,0.5)]"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <button
            data-cursor="button"
            className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-white transition-all hover:border-emerald hover:text-emerald"
          >
            Watch Demo
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>
        </div>

        <div
          className="font-mono-dm mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-text-secondary opacity-0"
          style={{ animation: "fade-in 0.9s ease 2.0s forwards" }}
        >
          <span><CountUp to={500} suffix="+" /> Doctors</span>
          <span className="hidden h-3 w-px bg-text-muted sm:block" />
          <span><CountUp to={50000} suffix="+" /> Patients</span>
          <span className="hidden h-3 w-px bg-text-muted sm:block" />
          <span><CountUp to={4.9} decimals={1} /> Rating</span>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0"
        style={{ animation: "fade-in 1s ease 2.2s forwards" }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex h-8 w-5 justify-center rounded-full border border-white/30 pt-1.5">
            <span className="scroll-dot h-1.5 w-1 rounded-full bg-white/70" />
          </div>
          <span className="font-mono-dm text-[10px] uppercase tracking-widest text-text-muted">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}

function HeroWord({ text, delay, className }: { text: string; delay: number; className?: string }) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <span
        className={`inline-block opacity-0 ${className ?? ""}`}
        style={{
          transform: "translateY(100%)",
          animation: `hero-rise 1.1s cubic-bezier(.16,.84,.34,1) ${delay}s forwards`,
        }}
      >
        {text}
      </span>
      <style>{`@keyframes hero-rise { to { transform: translateY(0); opacity: 1; } }`}</style>
    </span>
  );
}

/* ---------- MARQUEE ---------- */
function Marquee() {
  const items1 = [
    "Patient Queue Made Simple", "WhatsApp Booking in Seconds", "Zero Paperwork",
    "Real Time Earnings Tracker", "Trusted by 500+ Indian Doctors",
  ];
  const items2 = ["Pune", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Nagpur"];

  return (
    <section className="relative overflow-hidden border-y border-border-subtle bg-[#111]">
      <div className="py-5">
        <div className="marquee flex w-max gap-10 whitespace-nowrap text-sm text-[#666]">
          {[...items1, ...items1, ...items1].map((t, i) => (
            <span key={`a${i}`} className="flex items-center gap-10">
              {t}<span className="h-1 w-1 rounded-full bg-emerald" />
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-border-subtle py-5">
        <div className="marquee-reverse flex w-max gap-10 whitespace-nowrap text-sm text-[#666]">
          {[...items2, ...items2, ...items2, ...items2].map((t, i) => (
            <span key={`b${i}`} className="flex items-center gap-10">
              {t}<span className="h-1 w-1 rounded-full bg-emerald" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- PROBLEM ---------- */
function ProblemSection() {
  const pains = [
    { icon: Clock, title: "Patients wait with no information", desc: "They crowd the waiting room because they have no idea when their turn comes." },
    { icon: FileText, title: "Everything written on paper", desc: "Compounders lose records, make errors, and waste hours on manual entry." },
    { icon: TrendingDown, title: "No earnings visibility", desc: "Doctors finish the day with no clear idea of how much the clinic actually earned." },
  ];
  return (
    <section id="about" className="bg-[#0F0F0F] px-6 py-28 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-emerald/20 shadow-[0_0_60px_rgba(82,183,136,0.12)]">
              <img
                src={modernHospitalChaos}
                alt="Modern but overcrowded and chaotic hospital waiting lobby"
                loading="lazy"
                className="h-[560px] w-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 max-w-[260px] rounded-xl border-l-2 border-emerald bg-[#1A1A1A] p-5 shadow-2xl md:-right-8">
              <p className="font-display text-xl text-white">47 patients.</p>
              <p className="font-display text-xl text-white">0 tracking.</p>
              <p className="font-mono-dm mt-1 text-xs text-emerald">Pure chaos.</p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="font-mono-dm mb-4 text-xs uppercase tracking-[0.2em] text-emerald">The Problem</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-5xl leading-[1.1] text-white md:text-6xl">
              Every clinic runs on chaos. Until now.
            </h2>
          </Reveal>
          <div className="mt-10 space-y-1">
            {pains.map((p, i) => (
              <Reveal key={p.title} delay={0.2 + i * 0.1}>
                <div className="flex gap-5 border-b border-border-subtle py-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{p.title}</h3>
                    <p className="mt-1 text-sm text-text-secondary">{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FEATURES ---------- */
function FeaturesSection() {
  const cards = [
    { icon: MessageCircle, title: "WhatsApp Booking", desc: "Patients send a WhatsApp message and get booked automatically. No app needed." },
    { icon: LinkIcon, title: "Live Token Tracking", desc: "Patient gets a WhatsApp link showing their queue position and wait time. Auto updates." },
    { icon: RefreshCw, title: "Smart Rescheduling", desc: "Patient missed their turn? Automatically moved 5 slots ahead. Fair for all." },
    { icon: IndianRupee, title: "Daily Earnings Tracker", desc: "Track today, this week, this month. Visual charts. No spreadsheets." },
    { icon: Users, title: "Patient Records", desc: "Every visit saved. Search by name or phone. Returning patients auto-filled." },
  ];
  return (
    <section id="features" className="bg-[#111] px-6 py-28 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Reveal><p className="font-mono-dm text-xs uppercase tracking-[0.2em] text-emerald">Features</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display mt-4 text-5xl text-white md:text-7xl">Everything your clinic needs.</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-display mt-2 text-3xl text-text-secondary md:text-4xl">Nothing it doesn't.</p>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="relative mt-16 overflow-hidden rounded-3xl border border-border-subtle">
            <img
              src={cleanHospitalWaiting}
              alt="Clean and peaceful hospital waiting lobby with digital token display"
              loading="lazy"
              className="h-[420px] w-full object-cover md:h-[520px]"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, #111 100%)" }} />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {/* Large card */}
          <Reveal className="md:col-span-2 md:row-span-2">
            <FeatureCard
              large
              icon={List}
              title="Live Queue Management"
              desc="See every patient in real time. Mark done, skip, or reschedule with one tap. Queue updates instantly across all devices."
            >
              <div className="mt-6 space-y-2 rounded-xl border border-border-subtle bg-[#0d0d0d] p-4">
                {[
                  { n: "#08", name: "Anjali Verma", t: "Now serving", active: true },
                  { n: "#09", name: "Rohit Sharma", t: "Next" },
                  { n: "#10", name: "Pooja Iyer", t: "~ 12 min" },
                  { n: "#11", name: "Sahil Khan", t: "~ 20 min" },
                ].map((r) => (
                  <div key={r.n} className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${r.active ? "bg-emerald/10 border border-emerald/30" : "border border-transparent"}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono-dm text-xs text-text-secondary">{r.n}</span>
                      <span className="text-sm text-white">{r.name}</span>
                    </div>
                    <span className={`text-xs ${r.active ? "text-emerald" : "text-text-secondary"}`}>{r.t}</span>
                  </div>
                ))}
              </div>
            </FeatureCard>
          </Reveal>
          {/* WhatsApp card */}
          <Reveal delay={0.1}>
            <FeatureCard icon={MessageCircle} title="WhatsApp Auto Booking" desc="Patients message your clinic number and get booked automatically.">
              <div className="mt-4 space-y-2">
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-emerald/15 px-3 py-2 text-xs text-white">Hi doctor, can I book?</div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#0d0d0d] px-3 py-2 text-xs text-white border border-border-subtle">Booked! Token #14. Track: tymely.in/t/8f2</div>
              </div>
            </FeatureCard>
          </Reveal>

          {cards.slice(1).map((c, i) => (
            <Reveal key={c.title} delay={0.15 + i * 0.08}>
              <FeatureCard icon={c.icon} title={c.title} desc={c.desc} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon, title, desc, children, large,
}: {
  icon: typeof List; title: string; desc: string; children?: React.ReactNode; large?: boolean;
}) {
  return (
    <div
      className={`group h-full rounded-2xl border border-border-subtle bg-[#1A1A1A] p-7 transition-all duration-500 hover:border-emerald/60 hover:bg-[#1E1E1E] hover:shadow-[0_0_48px_rgba(82,183,136,0.18)] hover:-translate-y-1 ${large ? "md:p-9" : ""}`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald/10 text-emerald">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className={`mt-5 text-white ${large ? "font-display text-3xl md:text-4xl" : "text-xl font-medium"}`}>{title}</h3>
      <p className={`mt-3 text-text-secondary ${large ? "text-base max-w-md" : "text-sm"}`}>{desc}</p>
      {children}
    </div>
  );
}

/* ---------- HOW IT WORKS ---------- */
function HowItWorks() {
  const steps = [
    { n: "01", icon: UserPlus, title: "Doctor registers clinic", desc: "Sign up, add your clinic details, connect your WhatsApp number. Done in minutes.", img: "photo-1666214280391-8ff5bd3c0bf0" },
    { n: "02", icon: MessageSquare, title: "Patients book via WhatsApp", desc: "Patients message your clinic number. Tymely auto-books them and sends a token link.", img: "photo-1611162617213-7d7a39e9b1d7" },
    { n: "03", icon: LayoutDashboard, title: "Dashboard updates live", desc: "See every patient in your queue, track earnings, manage everything from one screen.", img: "photo-1551288049-bebda4e38f71" },
  ];
  return (
    <section id="how" className="relative bg-[#0A0A0A] px-6 py-28 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Reveal><p className="font-mono-dm text-xs uppercase tracking-[0.2em] text-emerald">Process</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display mt-4 text-5xl text-white md:text-7xl">Live in three steps.</h2>
          </Reveal>
        </div>

        <div className="relative mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-emerald/40 to-transparent md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.15}>
              <div className="relative">
                <div className="relative z-10 flex h-24 w-24 items-center justify-center">
                  <span className="font-mono-dm absolute -top-2 left-0 text-7xl font-light text-emerald/15">{s.n}</span>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-emerald/40 bg-[#0A0A0A] text-emerald">
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mt-4 font-display text-2xl text-white">{s.title}</h3>
                <p className="mt-3 text-sm text-text-secondary">{s.desc}</p>
                <div className="mt-6 overflow-hidden rounded-xl border border-border-subtle">
                  <img src={img(s.img, 800)} alt={s.title} loading="lazy" className="h-48 w-full object-cover" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- DASHBOARD PREVIEW ---------- */
function DashboardPreview() {
  return (
    <section className="relative overflow-hidden bg-[#111] px-6 py-28 md:py-36">
      <div className="mx-auto max-w-7xl text-center">
        <Reveal><p className="font-mono-dm text-xs uppercase tracking-[0.2em] text-emerald">Product</p></Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display mt-4 text-5xl text-white md:text-7xl">Your clinic. One screen.</h2>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="absolute inset-x-12 -bottom-10 h-40 rounded-full bg-emerald/30 blur-[100px]" />
            <div className="relative float-slow overflow-hidden rounded-2xl border border-border-subtle bg-[#0d0d0d] shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 border-b border-border-subtle bg-[#161616] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <div className="font-mono-dm ml-4 flex-1 rounded-md bg-[#0a0a0a] px-3 py-1 text-left text-[11px] text-text-secondary">
                  tymely.in / dashboard
                </div>
              </div>
              <div className="grid gap-4 p-6 text-left md:grid-cols-4">
                {[
                  { l: "Today", v: "₹18,400", t: "+12%" },
                  { l: "Patients", v: "47", t: "live" },
                  { l: "Waiting", v: "12", t: "queue" },
                  { l: "Avg wait", v: "8 min", t: "stable" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl border border-border-subtle bg-[#111] p-4">
                    <div className="text-[11px] uppercase tracking-wider text-text-secondary">{s.l}</div>
                    <div className="font-mono-dm mt-2 text-2xl text-white">{s.v}</div>
                    <div className="mt-1 text-[11px] text-emerald">{s.t}</div>
                  </div>
                ))}
                <div className="md:col-span-2 rounded-xl border border-border-subtle bg-[#111] p-4">
                  <div className="text-xs uppercase tracking-wider text-text-secondary">Live Queue</div>
                  <div className="mt-3 space-y-2">
                    {["Anjali Verma", "Rohit Sharma", "Pooja Iyer", "Sahil Khan"].map((n, i) => (
                      <div key={n} className="flex justify-between text-xs text-white">
                        <span>#{(8 + i).toString().padStart(2, "0")} · {n}</span>
                        <span className="text-text-secondary">{i === 0 ? "Serving" : `~ ${i * 8} min`}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 rounded-xl border border-border-subtle bg-[#111] p-4">
                  <div className="text-xs uppercase tracking-wider text-text-secondary">Earnings · Week</div>
                  <div className="mt-4 flex h-24 items-end gap-2">
                    {[40, 65, 55, 80, 70, 95, 60].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-emerald/30 to-emerald" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* floating badges */}
            <FloatingBadge className="-top-4 -left-4 md:-left-12" delay="0s">47 patients today</FloatingBadge>
            <FloatingBadge className="-top-4 -right-4 md:-right-10" delay="1s">₹18,400 earned</FloatingBadge>
            <FloatingBadge className="-bottom-4 -left-4 md:-left-10" delay="2s">Queue: 12 waiting</FloatingBadge>
            <FloatingBadge className="-bottom-4 -right-4 md:-right-12" delay="3s">3 done in last hour</FloatingBadge>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FloatingBadge({ children, className, delay }: { children: React.ReactNode; className?: string; delay?: string }) {
  return (
    <div
      className={`absolute hidden items-center gap-2 rounded-full border border-border-subtle bg-[#1A1A1A] px-4 py-2 text-xs text-white shadow-xl md:flex float-slow ${className ?? ""}`}
      style={{ animationDelay: delay }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald pulse-emerald" />
      {children}
    </div>
  );
}

/* ---------- MISSED APPOINTMENT ---------- */
function MissedAppointment() {
  const flow = ["Patient misses turn", "Auto detected", "Moved 5 ahead", "WhatsApp notification sent"];
  return (
    <section className="bg-[#0F0F0F] px-6 py-28 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
        <div>
          <Reveal><p className="font-mono-dm text-xs uppercase tracking-[0.2em] text-emerald">Smart Feature</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display mt-4 text-5xl text-white md:text-6xl">Missed your turn? We handle it.</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-text-secondary">
              If a patient misses their token number, Tymely automatically reschedules them 5 positions ahead in the queue. No manual work. Fair for every patient.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <div className="space-y-4">
            {flow.map((s, i) => (
              <div key={s} className="relative">
                <div className="flex items-center gap-4 rounded-xl border border-border-subtle bg-[#1A1A1A] p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald/15 font-mono-dm text-sm text-emerald">{i + 1}</div>
                  <span className="text-white">{s}</span>
                </div>
                {i < flow.length - 1 && (
                  <div className="ml-9 h-6 w-px bg-gradient-to-b from-emerald/60 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- STATS ---------- */
function StatsSection() {
  const stats = [
    { v: <><CountUp to={500} suffix="+" /></>, l: "Doctors using Tymely" },
    { v: <><CountUp to={50000} suffix="+" /></>, l: "Patients managed" },
    { v: <>₹<CountUp to={2} />Cr+</>, l: "Earnings tracked" },
    { v: <><CountUp to={4.9} decimals={1} /> / 5</>, l: "Average rating" },
  ];
  return (
    <section className="relative overflow-hidden bg-[#080808] px-6 py-28 md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/20 blur-[180px]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 text-center md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="relative md:px-6 md:[&:not(:last-child)]:border-r md:[&:not(:last-child)]:border-border-subtle">
              <div className="font-mono-dm text-5xl text-white md:text-6xl">{s.v}</div>
              <div className="mt-3 text-sm text-text-secondary">{s.l}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- TESTIMONIALS ---------- */
function Testimonials() {
  const items = [
    {
      photo: "photo-1612349317150-e413f6a5b16d",
      name: "Dr. Rajesh Sharma", role: "General Physician, Pune",
      quote: "Before Tymely, my compounder was writing 60 patient names daily on paper. Now everything is automatic. My evenings are finally free.",
    },
    {
      photo: "photo-1594824476967-48c8b964273f",
      name: "Dr. Priya Nair", role: "Pediatrician, Mumbai",
      quote: "The WhatsApp booking changed everything. Parents book appointments at midnight and show up on time. Queue chaos is completely gone.",
    },
    {
      photo: "photo-1537368910025-700350fe46c7",
      name: "Dr. Amit Kulkarni", role: "Dermatologist, Nashik",
      quote: "I never knew my exact daily earnings before. Now I check Tymely at 8pm and see everything. Worth every rupee of the subscription.",
    },
  ];
  return (
    <section className="bg-[#111] px-6 py-28 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Reveal><p className="font-mono-dm text-xs uppercase tracking-[0.2em] text-emerald">Testimonials</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display mt-4 text-5xl text-white md:text-7xl">Doctors love Tymely.</h2>
          </Reveal>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <div className="group h-full rounded-2xl border border-border-subtle bg-[#1A1A1A] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-emerald/50 hover:shadow-[0_0_48px_rgba(82,183,136,0.18)]">
                <Quote className="h-8 w-8 text-emerald" />
                <p className="font-display mt-6 text-xl italic leading-snug text-white">{t.quote}</p>
                <div className="mt-8 flex items-center gap-4">
                  <img
                    src={img(t.photo, 200)}
                    alt={t.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-text-secondary">{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- PRICING ---------- */
function Pricing() {
  const [yearly, setYearly] = useState(true);
  const features = [
    "Unlimited patients", "Live queue management", "WhatsApp automation included",
    "Expiring token links", "Earnings tracker", "Patient history and records",
    "Missed appointment recovery", "Priority support",
  ];
  return (
    <section id="pricing" className="bg-[#0A0A0A] px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <Reveal><p className="font-mono-dm text-xs uppercase tracking-[0.2em] text-emerald">Pricing</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display mt-4 text-5xl text-white md:text-7xl">One plan. Everything included.</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-text-secondary">No hidden charges. WhatsApp included.</p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 inline-flex items-center gap-1 rounded-full border border-border-subtle bg-[#111] p-1">
              <button
                data-cursor="button"
                onClick={() => setYearly(false)}
                className={`rounded-full px-5 py-2 text-sm transition ${!yearly ? "bg-emerald text-[#062014]" : "text-text-secondary"}`}
              >Monthly</button>
              <button
                data-cursor="button"
                onClick={() => setYearly(true)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm transition ${yearly ? "bg-emerald text-[#062014]" : "text-text-secondary"}`}
              >
                Yearly
                <span className="rounded-full bg-emerald/20 px-2 py-0.5 text-[10px] text-emerald">Save ₹1,589</span>
              </button>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal>
            <PriceCard
              title="Monthly"
              price={yearly ? "₹1,083" : "₹1,299"}
              period={yearly ? "/month · billed yearly" : "/month"}
              note={yearly ? "Pay ₹12,999 once a year" : "Billed monthly"}
              features={features}
              cta="Get Started"
              outlined
            />
          </Reveal>
          <Reveal delay={0.1}>
            <PriceCard
              title="Yearly"
              highlight
              price={yearly ? "₹12,999" : "₹15,588"}
              period={yearly ? "/year" : "/year (monthly billing)"}
              note={yearly ? "₹1,083/month · Save ₹1,589 · 2 months free" : "Switch to yearly to save"}
              features={features}
              cta="Get Started"
            />
          </Reveal>
        </div>

        <p className="mt-10 text-center text-sm text-text-secondary">
          All plans include 14 day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}

function PriceCard({
  title, price, period, note, features, cta, outlined, highlight,
}: {
  title: string; price: string; period: string; note: string; features: string[];
  cta: string; outlined?: boolean; highlight?: boolean;
}) {
  return (
    <div className={`relative rounded-2xl border p-8 md:p-10 ${highlight ? "border-emerald/60 bg-[#1E1E1E] shadow-[0_0_72px_rgba(82,183,136,0.22)]" : "border-border-subtle bg-[#1A1A1A]"}`}>
      {highlight && (
        <div className="absolute -top-3 right-6 rounded-full bg-emerald px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[#062014]">
          Most Popular
        </div>
      )}
      <div className="text-sm uppercase tracking-wider text-text-secondary">{title}</div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-mono-dm text-5xl text-white md:text-6xl">{price}</span>
        <span className="text-sm text-text-secondary">{period}</span>
      </div>
      <p className="mt-2 text-xs text-emerald">{note}</p>
      <ul className="mt-8 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm text-white">
            <Check className="h-4 w-4 text-emerald" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        to="/register"
        data-cursor="button"
        className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition ${
          outlined
            ? "border border-emerald/60 text-emerald hover:bg-emerald/10"
            : "bg-emerald text-[#062014] hover:brightness-110 hover:shadow-[0_0_40px_rgba(82,183,136,0.45)]"
        }`}
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const qs = [
    { q: "Is WhatsApp cost included in the subscription?", a: "Yes. Your entire WhatsApp API usage is covered in your Tymely subscription. You pay nothing extra for WhatsApp messages or confirmations." },
    { q: "Do I need technical knowledge to set this up?", a: "None at all. We set everything up for you including your WhatsApp connection. You will be live within 24 hours of signing up." },
    { q: "Can multiple staff members use one account?", a: "Yes. Your compounder and staff can access the dashboard to add patients and manage the queue." },
    { q: "Is my patient data safe and private?", a: "Completely. Your data is encrypted and stored securely. No other doctor or third party can ever access your patient records." },
    { q: "What happens if a patient misses their turn?", a: "Tymely automatically reschedules them 5 positions ahead in the queue and sends them a WhatsApp notification. No manual work needed." },
    { q: "Can I cancel my subscription anytime?", a: "Yes for monthly plans. Yearly plans are non-refundable but you keep access until the period ends." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="contact" className="bg-[#111] px-6 py-28 md:py-36">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <Reveal><p className="font-mono-dm text-xs uppercase tracking-[0.2em] text-emerald">FAQ</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display mt-4 text-5xl text-white md:text-7xl">Questions answered.</h2>
          </Reveal>
        </div>
        <div className="mt-14">
          {qs.map((item, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="border-t border-border-subtle">
                <button
                  data-cursor="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-base text-white md:text-lg">{item.q}</span>
                  <Plus
                    className="h-5 w-5 shrink-0 text-emerald transition-transform duration-300"
                    style={{ transform: open === i ? "rotate(45deg)" : "rotate(0)" }}
                  />
                </button>
                <div
                  className="overflow-hidden transition-[max-height,opacity] duration-500"
                  style={{ maxHeight: open === i ? 240 : 0, opacity: open === i ? 1 : 0 }}
                >
                  <p className="pb-6 pr-10 text-sm text-text-secondary md:text-base">{item.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-border-subtle" />
        </div>
      </div>
    </section>
  );
}

/* ---------- FINAL CTA ---------- */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#080808] px-6 py-32 md:py-44">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/20 blur-[180px]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="font-display text-5xl leading-[1.05] text-white md:text-7xl">
            Your clinic <span className="text-emerald">deserves better.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 text-lg text-text-secondary">Join 500+ doctors running smarter clinics.</p>
        </Reveal>
        <Reveal delay={0.25}>
          <Link
            to="/register"
            data-cursor="button"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-emerald px-8 py-4 text-base font-medium text-[#062014] transition-all hover:scale-[1.04] hover:shadow-[0_0_72px_rgba(82,183,136,0.6)]"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <Reveal delay={0.35}>
          <p className="mt-6 text-xs text-text-muted">14 day free trial · No credit card · Setup in 24 hours</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="border-t border-[#1A1A1A] bg-[#080808] px-6 pb-10 pt-20">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald" />
            <span className="font-display text-2xl text-white">Tymely</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-text-secondary">
            One dashboard for queues, earnings, and WhatsApp booking.
          </p>
          <p className="mt-6 text-xs text-text-muted">Made with care in India.</p>
        </div>

        <FooterCol title="Product" links={[
          ["Features", "#features"], ["Pricing", "#pricing"], ["How It Works", "#how"], ["Dashboard", "/login"],
        ]} />
        <FooterCol title="Company" links={[
          ["About", "#about"], ["Contact", "#contact"], ["Privacy Policy", "#"], ["Terms", "#"],
        ]} />

        <div>
          <div className="font-mono-dm text-xs uppercase tracking-wider text-text-muted">Contact</div>
          <ul className="mt-4 space-y-3 text-sm text-text-secondary">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald" />hello@tymely.in</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-emerald" />+91 98765 43210</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald" />Pune, Maharashtra, India</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl items-center justify-between border-t border-[#1A1A1A] pt-6 text-xs text-text-muted">
        <span>© 2025 Tymely. All rights reserved.</span>
        <span className="font-mono-dm">v1.0</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="font-mono-dm text-xs uppercase tracking-wider text-text-muted">{title}</div>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map(([l, h]) => (
          <li key={l}>
            <a href={h} className="text-text-secondary transition hover:text-emerald">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
