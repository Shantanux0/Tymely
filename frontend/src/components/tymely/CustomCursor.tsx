import { useEffect, useRef, useState } from "react";

type Variant = "default" | "button" | "image" | "link";

export function CustomCursor() {
  const followerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<Variant>("default");
  const [hidden, setHidden] = useState(true);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let trailX = mouseX;
    let trailY = mouseY;
    let raf = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setHidden(false);
    };

    const tick = () => {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      trailX += (mouseX - trailX) * 0.08;
      trailY += (mouseY - trailY) * 0.08;
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerX - 22}px, ${followerY - 22}px, 0)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailX - 40}px, ${trailY - 40}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const leave = () => setHidden(true);
    const enter = () => setHidden(false);

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t || !t.closest) return;
      if (t.closest("[data-cursor='button'], button, [role='button']")) setVariant("button");
      else if (t.closest("[data-cursor='image'], img")) setVariant("image");
      else if (t.closest("a, [data-cursor='link']")) setVariant("link");
      else setVariant("default");
    };

    const click = (e: MouseEvent) => {
      const id = Date.now() + Math.random();
      setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", click);
    window.addEventListener("mouseleave", leave);
    window.addEventListener("mouseenter", enter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", click);
      window.removeEventListener("mouseleave", leave);
      window.removeEventListener("mouseenter", enter);
    };
  }, []);

  const followerStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: 9999,
    border: "1px solid rgba(82,183,136,0.5)",
    background: "transparent",
    transition: "width .25s ease, height .25s ease, background .25s ease, border-color .25s ease, opacity .2s ease",
    opacity: hidden ? 0 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  };

  if (variant === "button") {
    followerStyle.width = 72;
    followerStyle.height = 72;
    followerStyle.background = "rgba(82,183,136,0.35)";
    followerStyle.border = "1px solid rgba(82,183,136,0.9)";
  } else if (variant === "image") {
    followerStyle.width = 80;
    followerStyle.height = 80;
    followerStyle.background = "rgba(82,183,136,0.25)";
    followerStyle.border = "1px solid rgba(82,183,136,0.8)";
  } else if (variant === "link") {
    followerStyle.width = 20;
    followerStyle.height = 20;
    followerStyle.background = "rgba(82,183,136,0.55)";
    followerStyle.border = "1px solid rgba(82,183,136,1)";
    followerStyle.animation = "pulse-emerald 1.2s ease-in-out infinite";
  }

  return (
    <>
      <div
        ref={trailRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 80,
          height: 80,
          borderRadius: 9999,
          background: "radial-gradient(circle, rgba(82,183,136,0.12) 0%, rgba(82,183,136,0) 70%)",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: hidden ? 0 : 1,
          transition: "opacity .3s ease",
        }}
      />
      <div
        ref={followerRef}
        style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999, ...followerStyle }}
      >
        {variant === "image" ? "View" : null}
      </div>

      {ripples.map((r) => (
        <div
          key={r.id}
          className="ripple"
          style={{
            position: "fixed",
            top: r.y - 10,
            left: r.x - 10,
            width: 20,
            height: 20,
            borderRadius: 9999,
            border: "1px solid rgba(82,183,136,0.7)",
            pointerEvents: "none",
            zIndex: 9997,
          }}
        />
      ))}
    </>
  );
}