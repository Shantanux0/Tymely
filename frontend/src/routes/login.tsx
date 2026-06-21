import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Tymely" },
      { name: "description", content: "Login to your Tymely clinic dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      const data = await response.json();
      localStorage.setItem("tymely_auth_token", data.token);
      localStorage.setItem("tymely_doctor_name", data.name);
      localStorage.setItem("tymely_clinic_name", data.clinicName);
      localStorage.setItem("tymely_specialty", data.specialty);
      toast.success("Welcome back, " + data.name);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-6">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald/15 blur-[140px]" />
      <div className="relative w-full max-w-md rounded-2xl border border-border-subtle bg-[#111] p-10 shadow-[0_20px_80px_-20px_rgba(82,183,136,0.25)]">
        <Link to="/" className="mb-8 flex items-center gap-2 text-sm text-text-secondary hover:text-white">
          <span className="h-2 w-2 rounded-full bg-emerald" />
          <span className="font-display text-2xl text-white">Tymely</span>
        </Link>
        <h1 className="font-display text-4xl text-white">Welcome back.</h1>
        <p className="mt-2 text-sm text-text-secondary">Sign in to your clinic dashboard.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-text-secondary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border-subtle bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-emerald"
              placeholder="doctor@clinic.in"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-text-secondary">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border-subtle bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-emerald"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            data-cursor="button"
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-emerald px-6 py-3 font-medium text-[#062014] transition hover:brightness-110 hover:shadow-[0_0_40px_rgba(82,183,136,0.45)] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          New to Tymely?{" "}
          <Link to="/register" className="text-emerald hover:underline">Start free trial</Link>
        </p>
      </div>
    </div>
  );
}