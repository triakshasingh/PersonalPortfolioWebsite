"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Metric = { label: string; value: string };

type Project = {
  name: string;
  category: string;
  description: string;
  bullets: string[];
  metrics?: Metric[];
  tech: string[];
  github?: string;
  accentColor: string;
};

const PROJECTS: Project[] = [
  {
    name: "Limit Order Book & Matching Engine",
    category: "Quant / Trading Systems",
    description:
      "Price-time priority limit order book with deterministic matching for market and limit orders, partial fills, and constant-time order lookup by ID.",
    bullets: [
      "O(log P) price-level updates and O(1) cancel via hash index + intrusive linked lists.",
      "Benchmarked 1,000,000 synthetic events — 102,056 events/sec; p50 5.29 μs, p95 13.18 μs, p99 20.33 μs (Python).",
      "Modular architecture separating order book state, matching logic, and benchmark harness.",
    ],
    metrics: [
      { label: "Throughput", value: "102K evt/s" },
      { label: "Latency p50", value: "5.29 μs" },
      { label: "Latency p99", value: "20.33 μs" },
    ],
    tech: ["Python", "Market Microstructure", "Order Flow", "Data Structures", "Benchmarking"],
    github: "https://github.com/triakshasingh/limitOrderBook",
    accentColor: "#00d4ff",
  },
  {
    name: "Volatility Estimator Toolkit",
    category: "Quant / Risk Systems",
    description:
      "Modular financial analytics engine for large-scale time-series processing with rolling-window and exponentially weighted statistical estimators.",
    bullets: [
      "Implemented EWMA and rolling-window estimators with configurable parameters — validated across varying input regimes.",
      "Optimized high-volume time-series computation using vectorized NumPy operations, eliminating iterative loops.",
      "Benchmarked estimator stability and computational trade-offs under simulated market shocks to evaluate robustness.",
    ],
    tech: ["Python", "NumPy", "pandas", "statsmodels", "EWMA", "Time Series", "Benchmarking"],
    github: "https://github.com/triakshasingh/volatility-estimator-",
    accentColor: "#8B5CF6",
  },
  {
    name: "Diabetes Prediction Model",
    category: "ML / Healthcare",
    description:
      "End-to-end machine learning pipeline for predicting diabetes using the Pima Indians Diabetes dataset — from preprocessing to single-user inference.",
    bullets: [
      "Standardized medical feature inputs using StandardScaler and applied stratified 80/20 train-test split to maintain class balance.",
      "Implemented linear SVM classifier; evaluated model performance using accuracy metrics on both training and test sets.",
      "Supports single-user predictions via manual feature input through a clean inference interface.",
    ],
    tech: ["Python", "scikit-learn", "NumPy", "pandas", "SVM", "StandardScaler"],
    github: "https://github.com/triakshasingh/Diabetes_Prediction-ML-",
    accentColor: "#00ff88",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <section id="projects" className="py-24 px-6 bg-[#070710]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <span className="font-mono text-xs text-[#6366F1] tracking-widest">03 /</span>
          <h2 className="text-3xl font-bold text-white">Projects</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#1A1A2E] to-transparent" />
        </div>
        <p className="font-mono text-[11px] text-[#9CA3AF] uppercase tracking-[0.16em] mb-10 ml-14">
          Built from first principles — benchmarked, not just described.
        </p>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {PROJECTS.map((project) => (
            <motion.article
              key={project.name}
              variants={item}
              whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 56px ${project.accentColor}22`;
                (e.currentTarget as HTMLElement).style.borderColor = `${project.accentColor}45`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.borderColor = "#1A1A2E";
              }}
              className="group relative flex flex-col rounded-xl border border-[#1A1A2E] bg-[#0D0D14] p-6 transition-colors duration-300"
            >
              {/* Accent top bar */}
              <div
                className="absolute top-0 left-6 right-6 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${project.accentColor}55, transparent)` }}
              />

              {/* Category */}
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] mb-3" style={{ color: project.accentColor }}>
                {project.category}
              </span>

              {/* Name */}
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white transition-colors">
                {project.name}
              </h3>

              {/* Description */}
              <p className="text-[15px] text-[#9CA3AF] leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Bullet points */}
              <ul className="space-y-2 mb-5">
                {project.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 text-[15px] text-[#C8CEDE] leading-relaxed">
                    <span style={{ color: project.accentColor }} className="mt-1 shrink-0 text-xs">▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Benchmark metrics */}
              {project.metrics && (
                <div
                  className="grid gap-px rounded-lg overflow-hidden mb-5"
                  style={{ gridTemplateColumns: `repeat(${project.metrics.length}, 1fr)`, border: `1px solid ${project.accentColor}18` }}
                >
                  {project.metrics.map(({ label, value }) => (
                    <div key={label} className="flex flex-col items-center py-2.5 px-2 bg-[#0A0A12]">
                      <p className="font-mono text-sm font-bold tabular-nums" style={{ color: project.accentColor }}>
                        {value}
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#9CA3AF] mt-0.5">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tech */}
              <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                {project.tech.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded font-mono text-[11px] bg-[#0A0A12] border border-[#1A1A2E] text-[#9CA3AF]">
                    {t}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-4 border-t border-[#111120] pt-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] text-[#9CA3AF] hover:text-[#A5B4FC] transition-colors font-mono"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0 1 12 5.803c.957.004 1.983.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0z" />
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
