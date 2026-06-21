import { useEffect, useState } from "react";

export function PageLoader() {
  const [phase, setPhase] = useState<"in" | "pulse" | "out" | "done">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("pulse"), 600);
    const t2 = setTimeout(() => setPhase("out"), 1400);
    const t3 = setTimeout(() => setPhase("done"), 2200);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080808]"
      style={{
        opacity: phase === "out" ? 0 : 1,
        transition: "opacity 0.7s ease",
        pointerEvents: phase === "out" ? "none" : "auto",
      }}
    >
      <div className="flex items-center gap-3" style={{ opacity: phase === "in" ? 0 : 1, transition: "opacity .8s ease" }}>
        <span className={`relative flex h-3 w-3 ${phase === "pulse" ? "pulse-emerald" : ""}`}>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald" />
        </span>
        <span className="font-display text-4xl tracking-tight text-white">Tymely</span>
      </div>
    </div>
  );
}