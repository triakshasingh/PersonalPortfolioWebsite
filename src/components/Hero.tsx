"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, FileText } from "lucide-react";

export default function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const start = window.scrollY;
    const end = target.getBoundingClientRect().top + start - 80; // offset for fixed nav
    const distance = end - start;
    const duration = 1100; // ms — slow, premium feel
    let startTime: number | null = null;

    const easeInOutQuart = (t: number) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + distance * easeInOutQuart(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 overflow-hidden"
    >
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[#00d4ff]/4 blur-[130px]"
          style={{ transform: `translate(${mouse.x * 0.6}px, ${mouse.y * 0.6}px)`, transition: "transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[#6366F1]/5 blur-[100px]"
          style={{ transform: `translate(${mouse.x * -0.4}px, ${mouse.y * -0.4}px)`, transition: "transform 1s cubic-bezier(0.25,0.46,0.45,0.94)" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-[#00ff88]/3 blur-[90px]"
          style={{ transform: `translate(${mouse.x * 0.3}px, ${mouse.y * 0.3}px)`, transition: "transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94)" }}
        />
      </div>

      <div className="relative z-10 max-w-3xl w-full text-center space-y-6">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-2"
        >
          <span className="w-6 h-px bg-[#00d4ff]/60" />
          <span className="font-mono text-[13px] uppercase tracking-[0.3em] text-[#00d4ff]">
            ECE · University of Washington · GPA 3.6 · Class of 2027
          </span>
          <span className="w-6 h-px bg-[#00d4ff]/60" />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05]"
        >
          Triaksha{" "}
          <span className="gradient-text">Singh</span>
        </motion.h1>

        {/* Headline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-xl sm:text-2xl text-[#C8CEDE] max-w-2xl mx-auto leading-relaxed"
        >
          Systems engineer building{" "}
          <span className="text-[#00d4ff] font-medium">ML</span>,{" "}
          <span className="text-[#00d4ff] font-medium">real-time systems</span>, and{" "}
          <span className="text-[#00ff88] font-medium">trading infrastructure</span>.
        </motion.p>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          className="font-mono text-sm text-[#9CA3AF]"
        >
          Electrical &amp; Computer Engineering — University of Washington
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.52 }}
          className="flex flex-col items-center gap-3"
        >
          {/* Row 1: section nav */}
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#projects"
              onClick={scrollTo("projects")}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #00d4ff22, #00d4ff11)", border: "1px solid #00d4ff55", color: "#00d4ff" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "linear-gradient(135deg, #00d4ff33, #00d4ff22)";
                el.style.borderColor = "#00d4ff99";
                el.style.color = "#fff";
                el.style.boxShadow = "0 0 24px #00d4ff22";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "linear-gradient(135deg, #00d4ff22, #00d4ff11)";
                el.style.borderColor = "#00d4ff55";
                el.style.color = "#00d4ff";
                el.style.boxShadow = "none";
              }}
            >
              Projects →
            </a>
            <a
              href="#experience"
              onClick={scrollTo("experience")}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #6366F122, #6366F111)", border: "1px solid #6366F155", color: "#6366F1" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "linear-gradient(135deg, #6366F133, #6366F122)";
                el.style.borderColor = "#6366F199";
                el.style.color = "#fff";
                el.style.boxShadow = "0 0 24px #6366F122";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "linear-gradient(135deg, #6366F122, #6366F111)";
                el.style.borderColor = "#6366F155";
                el.style.color = "#6366F1";
                el.style.boxShadow = "none";
              }}
            >
              Experience →
            </a>
            <a
              href="#skills"
              onClick={scrollTo("skills")}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #00ff8822, #00ff8811)", border: "1px solid #00ff8855", color: "#00ff88" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "linear-gradient(135deg, #00ff8833, #00ff8822)";
                el.style.borderColor = "#00ff8899";
                el.style.color = "#fff";
                el.style.boxShadow = "0 0 24px #00ff8822";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "linear-gradient(135deg, #00ff8822, #00ff8811)";
                el.style.borderColor = "#00ff8855";
                el.style.color = "#00ff88";
                el.style.boxShadow = "none";
              }}
            >
              Tech Stack →
            </a>
          </div>

          {/* Row 2: external links */}
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://github.com/triakshasingh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-[#1A1A2E] text-[#D4D8F0] font-semibold text-sm hover:border-[#6366F1]/60 hover:text-white transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0 1 12 5.803c.957.004 1.983.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0z" />
              </svg>
              GitHub
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-[#1A1A2E] text-[#D4D8F0] font-semibold text-sm hover:border-[#8B5CF6]/60 hover:text-white transition-all duration-200"
            >
              <FileText size={14} />
              Resume
            </a>
          </div>
        </motion.div>

        {/* Availability */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00ff88]" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">
            Available · Summer 2026
          </span>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ArrowDown size={16} className="text-[#475569] animate-bounce" />
      </motion.div>
    </section>
  );
}
