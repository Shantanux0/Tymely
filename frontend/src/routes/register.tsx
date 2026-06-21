import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CustomCursor } from "@/components/tymely/CustomCursor";
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Building, 
  Stethoscope, 
  Loader2, 
  Check 
} from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — Tymely" },
      { name: "description", content: "Create your Tymely doctor account and clinic dashboard." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Step 1: Doctor Profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Clinic Profile
  const [clinicName, setClinicName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [customSpecialty, setCustomSpecialty] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSpecialty = specialty === "Other" ? customSpecialty : specialty;

    if (!clinicName || !finalSpecialty) {
      toast.error("Please fill in all clinic details");
      return;
    }

    setLoading(true);
    setLoadingText("Creating account...");

    try {
      // 1. Send register request
      const regResponse = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          clinicName,
          specialty: finalSpecialty,
        }),
      });

      const regData = await regResponse.json();

      if (!regResponse.ok) {
        throw new Error(regData.message || "Registration failed");
      }

      toast.success("Account created successfully!");
      setLoadingText("Logging in...");

      // 2. Perform auto-login
      const loginResponse = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        throw new Error("Registration succeeded, but auto-login failed. Please sign in manually.");
      }

      const loginData = await loginResponse.json();
      
      // Store auth credentials
      localStorage.setItem("tymely_auth_token", loginData.token);
      localStorage.setItem("tymely_doctor_name", loginData.name);
      localStorage.setItem("tymely_clinic_name", loginData.clinicName);
      localStorage.setItem("tymely_specialty", loginData.specialty);

      toast.success(`Welcome to Tymely, Dr. ${loginData.name}!`);
      
      // Redirect to dashboard
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "An error occurred during registration");
      if (err.message.includes("auto-login failed")) {
        navigate({ to: "/login" });
      }
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-6 py-12">
      <CustomCursor />
      
      {/* Background glow orb */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald/15 blur-[140px]" />
      
      <div className="relative w-full max-w-lg rounded-2xl border border-border-subtle bg-[#111] p-8 md:p-10 shadow-[0_20px_80px_-20px_rgba(82,183,136,0.25)]">
        
        {/* Header / Logo */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-text-secondary hover:text-white">
            <span className="h-2 w-2 rounded-full bg-emerald" />
            <span className="font-display text-2xl text-white">Tymely</span>
          </Link>
          <span className="font-mono-dm text-xs text-text-secondary uppercase">
            Step {step} of 2
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-[#1A1A1A]">
          <div 
            className="h-full bg-emerald transition-all duration-500 ease-out"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl text-white md:text-4xl">
          {step === 1 ? "Create your account." : "About your clinic."}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {step === 1 
            ? "Let's set up your personal login credentials." 
            : "Tell us a bit about your practice to customize your dashboard."
          }
        </p>

        {step === 1 ? (
          /* Step 1: Doctor Profile Form */
          <form className="mt-8 space-y-4" onSubmit={handleNextStep}>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-text-secondary">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border-subtle bg-[#0a0a0a] py-3 pl-11 pr-4 text-white outline-none focus:border-emerald"
                  placeholder="Dr. Rajesh Sharma"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-text-secondary">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border-subtle bg-[#0a0a0a] py-3 pl-11 pr-4 text-white outline-none focus:border-emerald"
                  placeholder="doctor@clinic.in"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-text-secondary">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-border-subtle bg-[#0a0a0a] py-3 pl-11 pr-4 text-white outline-none focus:border-emerald"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-text-secondary">Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-border-subtle bg-[#0a0a0a] py-3 pl-11 pr-4 text-white outline-none focus:border-emerald"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              data-cursor="button"
              type="submit"
              className="group mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald px-6 py-3 font-medium text-[#062014] transition hover:brightness-110 hover:shadow-[0_0_40px_rgba(82,183,136,0.45)]"
            >
              Continue
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          </form>
        ) : (
          /* Step 2: Clinic Profile Form */
          <form className="mt-8 space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-text-secondary">Clinic Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted">
                  <Building className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full rounded-lg border border-border-subtle bg-[#0a0a0a] py-3 pl-11 pr-4 text-white outline-none focus:border-emerald"
                  placeholder="Apollo Clinic / Sharma Clinic"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-text-secondary">Specialty</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted">
                  <Stethoscope className="h-4 w-4" />
                </span>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full rounded-lg border border-border-subtle bg-[#0a0a0a] py-3 pl-11 pr-4 text-white outline-none focus:border-emerald appearance-none"
                  required
                >
                  <option value="" disabled>Select a specialty</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Orthopedician">Orthopedician</option>
                  <option value="ENT Specialist">ENT Specialist</option>
                  <option value="Ophthalmologist">Ophthalmologist</option>
                  <option value="Other">Other (specify...)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-text-secondary">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {specialty === "Other" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="mb-2 block text-xs uppercase tracking-wider text-text-secondary">Specify Specialty</label>
                <input
                  type="text"
                  value={customSpecialty}
                  onChange={(e) => setCustomSpecialty(e.target.value)}
                  className="w-full rounded-lg border border-border-subtle bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-emerald"
                  placeholder="e.g. Neurologist"
                  required
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                data-cursor="button"
                type="button"
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-lg border border-border-subtle bg-transparent px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5 disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              
              <button
                data-cursor="button"
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald px-6 py-3 font-medium text-[#062014] transition hover:brightness-110 hover:shadow-[0_0_40px_rgba(82,183,136,0.45)] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {loadingText}
                  </>
                ) : (
                  <>
                    Create Account
                    <Check className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Bottom Link to Login */}
        <p className="mt-8 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald hover:underline font-medium">Log in</Link>
        </p>

      </div>
    </div>
  );
}
