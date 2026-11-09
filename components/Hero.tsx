"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// R3F must load client-side only (per Next.js lazy-loading docs:
// `ssr: false` is only supported in Client Components).
const Robot3D = dynamic(() => import("./Robot3D"), { ssr: false });

type Particle = {
  x: number;
  y: number;
  r: number;
  depth: number;
  vx: number;
  tw: number;
  hue: number;
};

const WISPS: { cls: string; style: React.CSSProperties }[] = [
  { cls: "wisp", style: { width: "46vw", height: "26vh", top: "4%", left: "-8%", ["--d" as string]: "27s", ["--dl" as string]: "-7s" } },
  { cls: "wisp w-blue", style: { width: "38vw", height: "22vh", top: "32%", left: "-12%", ["--d" as string]: "33s", ["--dl" as string]: "-19s" } },
  { cls: "wisp", style: { width: "54vw", height: "30vh", top: "56%", left: "-6%", ["--d" as string]: "30s", ["--dl" as string]: "-13s" } },
  { cls: "wisp w-blue", style: { width: "30vw", height: "18vh", top: "14%", left: "6%", ["--d" as string]: "23s", ["--dl" as string]: "-4s" } },
  { cls: "wisp", style: { width: "34vw", height: "20vh", top: "74%", left: "0%", ["--d" as string]: "25s", ["--dl" as string]: "-21s" } },
  { cls: "wisp w-blue", style: { width: "42vw", height: "24vh", top: "22%", left: "-14%", ["--d" as string]: "36s", ["--dl" as string]: "-27s" } },
  { cls: "wisp", style: { width: "28vw", height: "16vh", top: "64%", left: "10%", ["--d" as string]: "21s", ["--dl" as string]: "-10s" } },
];

/**
 * Hero — v2 sample 1, cinematic nebula (approved 2026-11-08).
 * Nebula picture NEVER moves; blue smoke flows right like water (CSS
 * sheets + wisps); particles always flow LEFT, one direction only.
 * Robot stays fixed in place; head + body rotate 360° together on the
 * alternating 3s/4s cycle. Big light-blue boost glow comes directly
 * from the round engine disc in the artwork — no added nozzle.
 * Framer Motion drives the copy entrance; the R3F canvas takes over
 * the figure once its textures are ready, otherwise the layered
 * images + CSS spin stay — the robot can never disappear.
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glOn, setGlOn] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let parts: Particle[] = [];
    let cw = 0;
    let ch = 0;
    let raf = 0;
    let lastT = 0;

    const sizeCanvas = () => {
      const r = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = r.width;
      ch = r.height;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(130, Math.max(45, (cw * ch) / 16000)));
      parts = [];
      for (let i = 0; i < count; i++) {
        const depth = 0.3 + Math.random() * 0.7;
        parts.push({
          x: Math.random() * cw,
          y: Math.random() * ch,
          r: 0.6 + Math.random() * 1.7,
          depth,
          vx: -(0.35 + depth * 1.05), // constant leftward speed, never reverses
          tw: Math.random() * Math.PI * 2,
          hue: Math.random(),
        });
      }
    };

    const draw = (t: number) => {
      const dt = Math.min(50, lastT ? t - lastT : 16.7);
      lastT = t;
      ctx.clearRect(0, 0, cw, ch);
      for (const p of parts) {
        p.x += p.vx * (dt / 16.7);
        if (p.x < -5) {
          p.x = cw + 5;
          p.y = Math.random() * ch;
        }
        const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(p.tw + t * 0.0011));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          p.hue > 0.82
            ? `rgba(190,235,255,${0.75 * tw})`
            : p.hue > 0.6
              ? `rgba(70,170,235,${0.6 * tw})`
              : `rgba(45,230,205,${0.65 * tw})`;
        ctx.fill();
      }
    };

    const frame = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(frame);
    };

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(frame);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sizeCanvas);
    };
  }, []);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="layer-nebula" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="nebula-base" src="/nebula-bg.webp" alt="" />
        <div className="smoke-sheet s-back" />
        <div className="smoke-sheet s-mid" />
        <div className="smoke-sheet s-low" />
        {WISPS.map((w, i) => (
          <div key={i} className={w.cls} style={w.style} />
        ))}
      </div>
      <div className="layer-particles" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
      <div className="hero-veil" aria-hidden="true" />

      <div className="hero-inner">
        <motion.div
          className="hero-copy"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        >
          <h1>
            <span className="accent">Empowering</span>
            <br />
            The Future With
            <br />
            AI &amp; Robotics
          </h1>
          <div className="hero-cta">
            <a className="btn-explore" href="#">
              Explore Now
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </a>
            <div className="stat">
              <div className="stat-num">
                200 <span className="plus">+</span>
              </div>
              <div className="stat-label">Trusted Companies</div>
            </div>
          </div>
        </motion.div>

        <div className="robot-stage">
          <div className="robot-float">
            <div className={`robot-figure${glOn ? " gl-on" : ""}`}>
              <div className="robot-halo" aria-hidden="true" />
              <div id="robotGL" aria-hidden="true">
                <Robot3D onReady={() => setGlOn(true)} />
              </div>
              <div className="robot-layer robot-body-layer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/robot-body.png"
                  alt="Vexon robot — a friendly rounded silver-white bot with glowing teal visor eyes and a glowing blue chest core"
                />
              </div>
              <div className="robot-layer robot-head-layer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/robot-head.png" alt="" />
              </div>
              <div className="engine-boost" aria-hidden="true">
                <div className="flame">
                  <div className="flame-aura" />
                  <svg viewBox="0 0 200 205" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="flOuter" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#eafcff" stopOpacity="0.95" />
                        <stop offset="0.35" stopColor="#a8e4ff" stopOpacity="0.8" />
                        <stop offset="0.7" stopColor="#6fc8ff" stopOpacity="0.35" />
                        <stop offset="1" stopColor="#6fc8ff" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="flMid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#ffffff" />
                        <stop offset="0.5" stopColor="#c9f1ff" stopOpacity="0.9" />
                        <stop offset="1" stopColor="#7fd4ff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <g className="flame-inner">
                      <path
                        d="M100 2 C90 52 64 108 40 152 C26 178 44 200 100 200 C156 200 174 178 160 152 C136 108 110 52 100 2 Z"
                        fill="url(#flOuter)"
                      />
                      <path
                        d="M100 4 C95 44 82 92 68 132 C60 156 72 172 100 172 C128 172 140 156 132 132 C118 92 105 44 100 4 Z"
                        fill="url(#flMid)"
                      />
                      <path
                        d="M100 6 C97 34 91 66 86 96 C83 118 88 132 100 132 C112 132 117 118 114 96 C109 66 103 34 100 6 Z"
                        fill="#ffffff"
                        opacity="0.95"
                      />
                      <ellipse cx="100" cy="8" rx="30" ry="9" fill="#ffffff" opacity="0.85" />
                    </g>
                  </svg>
                </div>
              </div>
              <div className="engine-glow" aria-hidden="true" />
              <div className="robot-glow" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
