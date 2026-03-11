"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const FOCUS_AREAS = [
  {
    icon: "◈",
    title: "ML Systems",
    description:
      "Modular data-processing pipelines, cross-validated predictive workflows, and production inference systems. Scikit-learn, PyTorch, statsmodels.",
    color: "#6366F1",
  },
  {
    icon: "⬡",
    title: "Quant Engineering",
    description:
      "Limit order book engines, EWMA/rolling volatility estimators, vectorized NumPy time-series. Built to production benchmarks from first principles.",
    color: "#8B5CF6",
  },
  {
    icon: "⬢",
    title: "Embedded & Robotics",
    description:
      "ESP32 firmware, Raspberry Pi orchestration, ROS2 distributed services in C++/Python. Real hardware debugging across firmware, Linux, and network layers.",
    color: "#22D3EE",
  },
  {
    icon: "◇",
    title: "Distributed Systems",
    description:
      "Multi-layer system integration: firmware ↔ backend ↔ web. WiFi + JSON messaging, MongoDB state management, Socket.IO telemetry.",
    color: "#10B981",
  },
];

const STATS = [
  { value: "3", label: "Roles" },
  { value: "3.6", label: "GPA" },
  { value: "2027", label: "Graduation" },
  { value: "2026", label: "Available" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <section id="about" className="py-24 px-6 bg-[#070710]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <span className="font-mono text-xs text-[#6366F1] tracking-widest">01 /</span>
          <h2 className="text-2xl font-bold text-white">About</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#1A1A2E] to-transparent" />
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="space-y-10"
        >
          {/* Bio + education */}
          <motion.div variants={item} className="max-w-2xl space-y-4">
            <p className="text-lg text-[#C8CEDE] leading-relaxed">
              ECE student at the University of Washington (GPA 3.6) building production systems
              that hold up under real constraints — latency budgets, hardware limits, and
              concurrent user access.
            </p>
            <p className="text-[#7B8098] leading-relaxed">
              I work across the full stack from embedded firmware to ML inference backends,
              with a strong bias toward measurable performance. My quant projects are benchmarked,
              my distributed systems are debugged at the hardware layer, and my ML pipelines are
              cross-validated before they ship.
            </p>
            <p className="text-[#7B8098] leading-relaxed">
              I'm drawn to problems at the boundary of hardware and software — where the code
              has to be right because the system doesn't have a retry button.
            </p>
            {/* Education pill */}
            <div className="inline-flex items-center gap-3 rounded-lg border border-[#1A1A2E] bg-[#0D0D14] px-4 py-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
              <span className="font-mono text-xs text-[#9CA3AF]">
                University of Washington · BS ECE · GPA 3.6 · Sep 2024 – Jun 2027
              </span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={item}
            className="flex flex-wrap gap-8 pt-2 border-t border-[#111120]"
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="space-y-0.5">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4B5563]">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Focus areas */}
          <motion.div
            variants={item}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {FOCUS_AREAS.map((area) => (
              <div
                key={area.title}
                className="rounded-xl border border-[#1A1A2E] bg-[#0D0D14] p-5 hover:border-[#6366F1]/30 transition-colors duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg" style={{ color: area.color }}>
                    {area.icon}
                  </span>
                  <h3 className="font-semibold text-[#C8CEDE] text-sm">{area.title}</h3>
                </div>
                <p className="text-xs text-[#555570] leading-relaxed">{area.description}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
