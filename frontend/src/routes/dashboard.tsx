import { createFileRoute, Outlet, useRouterState, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Bell, Search, Sun, Moon } from "lucide-react";
import { DashSidebar } from "@/components/tymely/DashSidebar";
import { ClinicProvider } from "@/lib/api/clinic-state";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("tymely_auth_token");
      if (!token) {
        throw redirect({
          to: "/login",
        });
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Dashboard — Tymely" },
      { name: "description", content: "Tymely clinic dashboard for doctors." },
    ],
  }),
  component: DashboardLayout,
});

const titles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Good morning, Dr. Mehra", subtitle: "Here's what's happening at your clinic today." },
  "/dashboard/queue": { title: "Queue", subtitle: "Manage who's next and keep things moving." },
  "/dashboard/add-patient": { title: "Add Patient", subtitle: "Register a walk-in or returning patient." },
  "/dashboard/patients": { title: "Patients", subtitle: "Your complete patient directory." },
  "/dashboard/earnings": { title: "Earnings", subtitle: "Track consultations, payments and growth." },
  "/dashboard/settings": { title: "Settings", subtitle: "Clinic preferences and your profile." },
};

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const rawMeta = titles[pathname] ?? titles["/dashboard"];

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [docName, setDocName] = useState("Dr. Mehra");
  const [specialty, setSpecialty] = useState("General Physician");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tymely_theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      }
      
      const name = localStorage.getItem("tymely_doctor_name");
      const spec = localStorage.getItem("tymely_specialty");
      if (name) setDocName(name);
      if (spec) setSpecialty(spec);
    }
  }, []);

  const meta = {
    title: rawMeta.title.replace("Dr. Mehra", docName),
    subtitle: rawMeta.subtitle
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    localStorage.setItem("tymely_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ClinicProvider>
      <div className="min-h-screen bg-background text-foreground">
        <DashSidebar />

        <div className="transition-[padding] duration-300" style={{ paddingLeft: 260 }}>
          <header className="sticky top-0 z-30 flex h-20 items-center gap-6 border-b border-border bg-background/85 px-8 backdrop-blur-xl">
            <div className="min-w-0">
              <h1 className="font-display truncate text-2xl text-foreground">{meta.title}</h1>
              <p className="truncate text-xs text-text-secondary">{meta.subtitle}</p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  placeholder="Search patients, tokens…"
                  className="h-10 w-72 rounded-lg border border-border-subtle bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-text-muted outline-none focus:border-emerald"
                />
              </div>

              <button
                onClick={toggleTheme}
                className="relative grid h-10 w-10 place-items-center rounded-lg border border-border-subtle bg-surface text-text-secondary transition hover:text-foreground cursor-pointer"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <button className="relative grid h-10 w-10 place-items-center rounded-lg border border-border-subtle bg-surface text-text-secondary transition hover:text-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald" />
              </button>
              <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface px-3 py-1.5">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-emerald/20 text-xs font-medium text-emerald">
                  {docName.split(" ").map(n => n[0]).filter(c => c !== ".").join("").toUpperCase().substring(0, 2)}
                </div>
                <div className="hidden text-left md:block">
                  <div className="text-xs font-medium text-foreground">{docName}</div>
                  <div className="text-[10px] text-text-secondary">{specialty}</div>
                </div>
              </div>
            </div>
          </header>

          <main className="px-8 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </ClinicProvider>
  );
}
