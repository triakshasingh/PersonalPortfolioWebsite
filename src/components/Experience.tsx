"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EXPERIENCE = [
  {
    role: "Research Intern",
    company: "Allbritton Lab – UW Bioengineering",
    period: "Feb 2026 — Present",
    location: "Seattle, WA",
    type: "Research",
    bullets: [
      "Architected end-to-end communication pipeline between ESP32 firmware and Raspberry Pi controller using WiFi + structured JSON messaging, enabling reliable real-time device-to-server synchronization.",
      "Designed and implemented distributed device state management logic across firmware, backend agents, and web dashboard — consistent execution of multi-stage workflows under concurrent user access.",
      "Debugged and integrated multi-layer system components (embedded firmware, Linux-based controller, Node.js backend, MongoDB, Socket.IO telemetry) to centralize communication flows.",
    ],
    tech: ["ESP32", "Raspberry Pi", "Node.js", "MongoDB", "Socket.IO", "Linux", "WiFi", "JSON"],
    color: "#10B981",
  },
  {
    role: "AI/ML Intern",
    company: "Inntech",
    period: "Jun 2025 — Sep 2025",
    location: "Muscat, Oman",
    type: "Internship",
    bullets: [
      "Engineered modular Python data-processing pipelines for structured datasets, reducing manual overhead by ~40% while improving computational reliability and system maintainability.",
      "Designed and validated predictive computation workflows with rigorous error analysis and cross-validation, integrating outputs into backend systems with clean, scalable architecture.",
    ],
    tech: ["Python", "Scikit-learn", "Pandas", "NumPy", "statsmodels", "Data Pipelines"],
    color: "#22D3EE",
  },
  {
    role: "Mechatronics Engineer",
    company: "UW Husky Robotics Team",
    period: "Oct 2024 — May 2025",
    location: "Seattle, WA",
    type: "Research",
    bullets: [
      "Built performance-critical distributed ROS2 services in C++/Python on Linux, reducing end-to-end control latency by ~30% through asynchronous messaging and execution profiling.",
      "Integrated Betaflight flight-control stack to establish deterministic servo signal pipelines between transmitter input and actuator output.",
      "Debugged cross-layer failures across embedded firmware, Linux services, and hardware interfaces to ensure stable real-time system behavior.",
    ],
    tech: ["ROS2", "C++", "Python", "Linux", "Betaflight", "Embedded Firmware", "Profiling"],
    color: "#6366F1",
  },
];

const TYPE_COLORS: Record<string, string> = {
  Internship: "#22D3EE",
  Research: "#10B981",
  Startup: "#00ff88",
};

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const item = {
    hidden: { opacity: 0, x: -16 },
    show: { opacity: 1, x: 0, transition: { duration: 0.45 } },
  };

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <span className="font-mono text-xs text-[#6366F1] tracking-widest">02 /</span>
          <h2 className="text-3xl font-bold text-white">Experience</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#1A1A2E] to-transparent" />
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute left-4 top-3 bottom-3 w-px bg-gradient-to-b from-[#6366F1]/40 via-[#1A1A2E] to-transparent" />

          <div className="space-y-8">
            {EXPERIENCE.map((exp, i) => (
              <motion.div key={i} variants={item} className="relative flex gap-6">
                {/* Dot */}
                <div
                  className="relative z-10 mt-1.5 flex-none w-8 h-8 rounded-full border bg-[#0A0A0F] flex items-center justify-center"
                  style={{ borderColor: `${exp.color}45` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: exp.color }} />
                </div>

                {/* Card */}
                <motion.div
                  className="flex-1 rounded-xl border border-[#1A1A2E] bg-[#0D0D14] p-5 transition-colors duration-300"
                  whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px ${exp.color}1a`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${exp.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.borderColor = "#1A1A2E";
                  }}
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                        <span
                          className="font-mono text-[10px] uppercase tracking-[0.16em] px-1.5 py-0.5 rounded"
                          style={{
                            color: TYPE_COLORS[exp.type] ?? "#9CA3AF",
                            background: `${TYPE_COLORS[exp.type] ?? "#9CA3AF"}15`,
                            border: `1px solid ${TYPE_COLORS[exp.type] ?? "#9CA3AF"}28`,
                          }}
                        >
                          {exp.type}
                        </span>
                      </div>
                      <p className="text-[15px] font-medium text-[#A5B4FC] mt-0.5">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-[#9CA3AF] whitespace-nowrap">{exp.period}</p>
                      <p className="font-mono text-[11px] text-[#6B7280]">{exp.location}</p>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <ul className="space-y-2 mb-4">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2 text-[15px] text-[#C8CEDE] leading-relaxed">
                        <span className="text-[#6366F1] mt-1 shrink-0 text-xs">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#111120]">
                    {exp.tech.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded font-mono text-[11px] bg-[#0A0A12] border border-[#1A1A2E] text-[#9CA3AF]">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
