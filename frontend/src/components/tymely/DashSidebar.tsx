import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, ListOrdered, UserPlus, Users,
  IndianRupee, Settings, ChevronLeft, LogOut,
} from "lucide-react";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/queue", label: "Queue", icon: ListOrdered },
  { to: "/dashboard/add-patient", label: "Add Patient", icon: UserPlus },
  { to: "/dashboard/patients", label: "Patients", icon: Users },
  { to: "/dashboard/earnings", label: "Earnings", icon: IndianRupee },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-sidebar transition-[width] duration-300"
      style={{ width: collapsed ? 72 : 260 }}
    >
      <div className="flex h-20 items-center gap-2.5 px-5">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald" />
        </span>
        {!collapsed && (
          <span className="font-display text-2xl font-medium tracking-tight text-foreground">
            Tymely
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to as never}
              className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all"
              style={{
                backgroundColor: active ? "rgba(82,183,136,0.12)" : "transparent",
                color: active ? "var(--foreground)" : "var(--text-secondary)",
                boxShadow: active ? "inset 2px 0 0 #52B788" : undefined,
              }}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" style={{ color: active ? "#52B788" : undefined }} />
              {!collapsed && <span className="font-medium">{label}</span>}
              {active && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-border p-3">
        <Link
          to="/"
          onClick={() => {
            localStorage.removeItem("tymely_auth_token");
            localStorage.removeItem("tymely_doctor_name");
            localStorage.removeItem("tymely_clinic_name");
            localStorage.removeItem("tymely_specialty");
          }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition hover:bg-surface-alt hover:text-foreground"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </Link>
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label="Toggle sidebar"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition hover:bg-surface-alt hover:text-foreground"
        >
          <ChevronLeft
            className="h-[18px] w-[18px] shrink-0 transition-transform"
            style={{ transform: collapsed ? "rotate(180deg)" : "none" }}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
