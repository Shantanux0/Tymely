import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      // detect active section
      const sections = links.map((l) => document.querySelector(l.href));
      let current = "";
      sections.forEach((s, i) => {
        if (s) {
          const rect = (s as HTMLElement).getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) current = links[i].href;
        }
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(8,8,8,0.7)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid #222" : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald" />
            </span>
            <span className="font-display text-2xl font-medium tracking-tight text-white">Tymely</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative text-sm text-text-secondary transition-colors hover:text-white"
                style={{ color: active === l.href ? "var(--emerald)" : undefined }}
              >
                {l.label}
                {active === l.href && (
                  <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald" />
                )}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              to="/login"
              data-cursor="button"
              className="rounded-full border border-emerald/60 px-5 py-2 text-sm font-medium text-emerald transition-all hover:bg-emerald/10 hover:shadow-[0_0_24px_rgba(82,183,136,0.25)]"
            >
              Login
            </Link>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[#080808] px-8 py-6 md:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl text-white">Tymely</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <nav className="mt-16 flex flex-col gap-6">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl text-white opacity-0"
                style={{
                  animation: `fade-in 0.5s ease ${0.1 + i * 0.08}s forwards`,
                }}
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-8 inline-block rounded-full border border-emerald px-6 py-3 text-center text-emerald opacity-0"
              style={{ animation: `fade-in 0.5s ease ${0.5}s forwards` }}
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}