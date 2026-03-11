"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, FileText, X, Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type Market = "hs" | "uw";

// ─── Types ──────────────────────────────────────────────────────────────────────
type HoldingStatus = "active" | "shipped" | "research" | "founded";

type HoldingItem = {
  type: "position" | "project";
  name: string;
  category: string;
  description: string;
  tech: string[];
  github?: string;
  status: HoldingStatus;
};

type MarketConfig = {
  id: Market;
  ticker: string;
  name: string;
  subname: string;
  period: string;
  nav: number;
  cagr: string;
  sharpe: string;
  alpha: string;
  positions: number;
  color: string;
  dimBg: string;
  border: string;
  glowShadow: string;
  holdings: HoldingItem[];
  description: string;
  spark: number[];
  status: "LIVE" | "CLOSED";
};

const STATUS_META: Record<HoldingStatus, { label: string; color: string }> = {
  active:   { label: "ACTIVE",   color: "#22C55E" },
  shipped:  { label: "SHIPPED",  color: "#22D3EE" },
  research: { label: "RESEARCH", color: "#F59E0B" },
  founded:  { label: "FOUNDED",  color: "#A855F7" },
};

// ─── Market data ────────────────────────────────────────────────────────────────
const MARKETS: MarketConfig[] = [
  {
    id: "uw",
    ticker: "$TRIAX.UW",
    name: "Univ. of Washington",
    subname: "COLLEGIATE MARKETS · CLASS OF 2028",
    period: "SEP 2024 — PRESENT",
    nav: 92.0,
    cagr: "+28.4%",
    sharpe: "3.07",
    alpha: "+24.2%",
    positions: 6,
    color: "#6366F1",
    dimBg: "rgba(99,102,241,0.04)",
    border: "rgba(99,102,241,0.16)",
    glowShadow: "0 0 48px rgba(99,102,241,0.08), 0 0 1px rgba(99,102,241,0.3)",
    holdings: [
      {
        type: "position",
        name: "Husky Robotics",
        category: "Robotics · Systems",
        description:
          "ROS2 autonomous navigation and control stack on real rover hardware. C++ control loops, sensor fusion, and SLAM integration for competitive university robotics.",
        tech: ["ROS2", "C++", "SLAM", "ESP32", "Linux"],
        status: "active",
      },
      {
        type: "position",
        name: "Inntech AI/ML",
        category: "ML Systems · Intern",
        description:
          "Production ML inference pipeline and IoT orchestration backend. FastAPI serving layer with real-time model deployment for edge devices at scale.",
        tech: ["FastAPI", "PyTorch", "Docker", "IoT", "REST APIs"],
        status: "shipped",
      },

      {
        type: "position",
        name: "Albitron Research",
        category: "BioEng · Research Intern",
        description:
          "Computational bioengineering research — signal processing, statistical modeling, and data pipelines for biological systems at Albitron Lab.",
        tech: ["Python", "MATLAB", "Signal Processing", "Statistics"],
        status: "research",
      },
      {
        type: "project",
        name: "Volatility Estimator",
        category: "Quant Engine",
        description:
          "Production-grade EWMA/GARCH volatility surface estimator. Real-time risk metrics for equity options — from academic paper to deployment.",
        tech: ["Python", "NumPy", "GARCH", "Options Math"],
        github: "#",
        status: "shipped",
      },
      {
        type: "project",
        name: "Limit Order Book",
        category: "Trading Systems",
        description:
          "High-performance LOB with price-time priority matching. O(log N) price-level operations with L2 market data feed simulation.",
        tech: ["Python", "Market Microstructure", "Order Flow"],
        github: "#",
        status: "shipped",
      },
      {
        type: "project",
        name: "Diabetes ML",
        category: "ML Pipeline",
        description:
          "End-to-end diabetes risk prediction pipeline. Feature engineering, ensemble methods (XGBoost + RF), and cross-validated model selection.",
        tech: ["Scikit-learn", "XGBoost", "Pandas", "Python"],
        github: "#",
        status: "shipped",
      },
    ],
    description:
      "Systems engineering with a quant infrastructure bias. Hardware-to-cloud work across robotics, bioengineering research, and production ML systems.",
    spark: [38, 40, 50, 55, 62, 58, 66, 72, 70, 78, 83, 88, 92],
    status: "LIVE",
  },
];

const TICKER_ITEMS = [
  { sym: "$TRIAX.UW", val: "92.00", chg: "+28.4%" },
  { sym: "POSITIONS", val: "6", chg: "TOTAL" },
  { sym: "PORTFOLIO.NAV", val: "92.00", chg: "+28.4%" },
  { sym: "SHARPE.UW", val: "3.07", chg: "RISK-ADJ" },
  { sym: "ALPHA.COMPOSITE", val: "+21.8%", chg: "VS BENCHMARK" },
  { sym: "DOMAINS", val: "4", chg: "ROBOTICS·ML·QUANT·BIOENG" },
];

const DOMAIN_TAGS = [
  "Robotics",
  "ML Systems",
  "Quant Engineering",
  "Computer Vision",
  "Trading Systems",
];

// ─── Sparkline (animated) ────────────────────────────────────────────────────────
function Sparkline({
  points,
  color,
  id,
  animDelay = 0,
}: {
  points: number[];
  color: string;
  id: string;
  animDelay?: number;
}) {
  const W = 280;
  const H = 64;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((v, i) => ({
    x: (i / (points.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 4) - 2,
  }));

  const linePath = coords
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath =
    `M 0 ${H} ` +
    coords.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") +
    ` L ${W} ${H} Z`;

  const lastX = coords[coords.length - 1].x;
  const lastY = coords[coords.length - 1].y;
  const dotDelay = animDelay + 1.6;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: H }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`spark-fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
        <filter id={`glow-${id}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Area fill */}
      <motion.path
        d={areaPath}
        fill={`url(#spark-fill-${id})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: animDelay + 1.2 }}
      />

      {/* Animated line draw */}
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 1.5, delay: animDelay, ease: "easeInOut" },
          opacity: { duration: 0.1, delay: animDelay },
        }}
      />

      {/* Glow dot at end */}
      <motion.circle
        cx={lastX}
        cy={lastY}
        r="3.5"
        fill={color}
        filter={`url(#glow-${id})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: dotDelay, duration: 0.3 }}
      />

      {/* Pulse ring */}
      <motion.circle
        cx={lastX}
        cy={lastY}
        r="3"
        fill="none"
        stroke={color}
        strokeWidth="1"
        initial={{ r: 3, opacity: 0.7 }}
        animate={{ r: 14, opacity: 0 }}
        transition={{
          delay: dotDelay + 0.2,
          duration: 1.6,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </svg>
  );
}

// ─── GitHub icon ─────────────────────────────────────────────────────────────────
function GitHubIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0 1 12 5.803c.957.004 1.983.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0z" />
    </svg>
  );
}

// ─── Live clock ──────────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      return (
        String(now.getUTCHours()).padStart(2, "0") +
        ":" +
        String(now.getUTCMinutes()).padStart(2, "0") +
        ":" +
        String(now.getUTCSeconds()).padStart(2, "0") +
        " UTC"
      );
    };
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-[11px] text-[#4B5563] tabular-nums">
      {time}
    </span>
  );
}

// ─── Holding card ─────────────────────────────────────────────────────────────────
function HoldingCard({
  holding,
  color,
}: {
  holding: HoldingItem;
  color: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[holding.status];

  return (
    <motion.div
      layout
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      className="rounded-lg border cursor-pointer overflow-hidden"
      style={{
        borderColor: expanded ? `${color}40` : "#12121E",
        background: expanded ? `${color}0A` : "rgba(8,8,16,0.5)",
        transition: "border-color 0.2s, background 0.2s",
      }}
      transition={{ layout: { duration: 0.18, ease: "easeInOut" } }}
    >
      {/* Header row */}
      <div className="flex items-start gap-2 px-3 py-2.5">
        <div className="flex-1 min-w-0">
          <p
            className="font-mono text-[11px] font-semibold leading-tight"
            style={{ color: expanded ? color : "#BFC5D4" }}
          >
            {holding.name}
          </p>
          <p className="font-mono text-[8.5px] uppercase tracking-[0.15em] text-[#3A3A5A] mt-0.5">
            {holding.category}
          </p>
        </div>
        <span
          className="shrink-0 font-mono text-[7.5px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-full mt-0.5"
          style={{
            color: meta.color,
            background: `${meta.color}16`,
            border: `1px solid ${meta.color}28`,
          }}
        >
          {meta.label}
        </span>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="px-3 pb-3 space-y-2 border-t"
              style={{ borderColor: `${color}12` }}
            >
              <p className="text-[10px] leading-[1.65] text-[#6B7280] pt-2">
                {holding.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {holding.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[8.5px] font-mono px-1.5 py-0.5 rounded"
                    style={{
                      color,
                      background: `${color}16`,
                      border: `1px solid ${color}25`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              {holding.github && holding.github !== "#" && (
                <a
                  href={holding.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[9px] text-[#4B5563] hover:text-white transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GitHubIcon size={10} />
                  <span>View Source</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Exchange card ────────────────────────────────────────────────────────────────
function ExchangeCard({
  market,
  onEnter,
  delay,
}: {
  market: MarketConfig;
  onEnter: (id: Market) => void;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const isLive = market.status === "LIVE";
  const retColor = market.cagr.startsWith("+") ? "#22C55E" : "#EF4444";
  const alphaColor = market.alpha.startsWith("+") ? "#22C55E" : "#EF4444";

  const corePositions = market.holdings.filter((h) => h.type === "position");
  const projects = market.holdings.filter((h) => h.type === "project");

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col rounded-xl border bg-[#06060E] overflow-hidden"
      style={{
        borderColor: hovered ? market.color : market.border,
        boxShadow: hovered ? market.glowShadow : "none",
        transition: "border-color 0.3s, box-shadow 0.3s, background 0.3s",
        background: hovered ? market.dimBg : "#06060E",
      }}
    >
      {/* Top accent line */}
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${market.color}55, transparent)`,
        }}
      />

      {/* Header strip */}
      <div className="flex items-center justify-between px-5 pt-3.5 pb-3 border-b border-[#0C0C1A]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75",
                isLive ? "animate-ping" : ""
              )}
              style={{ backgroundColor: isLive ? "#22C55E" : "#F59E0B" }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: isLive ? "#22C55E" : "#F59E0B" }}
            />
          </span>
          <span
            className="font-mono text-[9px] uppercase tracking-[0.22em] font-bold"
            style={{ color: isLive ? "#22C55E" : "#F59E0B" }}
          >
            {market.status}
          </span>
        </div>
        <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-[#20203A]">
          {market.subname}
        </span>
      </div>

      {/* Ticker + name */}
      <div className="px-5 pt-4 pb-1">
        <p
          className="font-mono text-[22px] font-bold tracking-tight leading-none"
          style={{ color: market.color }}
        >
          {market.ticker}
        </p>
        <p className="mt-1 text-[14px] font-semibold text-[#D4D8F2]">
          {market.name}
        </p>
        <p className="font-mono text-[10px] text-[#35355A] tracking-widest mt-0.5">
          {market.period}
        </p>
      </div>

      {/* Sparkline */}
      <div className="px-5 pt-2 pb-2">
        <Sparkline
          points={market.spark}
          color={market.color}
          id={market.id}
          animDelay={delay + 0.1}
        />
      </div>

      {/* NAV / CAGR / ALPHA strip */}
      <div
        className="mx-5 mb-4 grid grid-cols-3 rounded-lg overflow-hidden"
        style={{
          border: `1px solid ${market.color}15`,
          background: `${market.color}06`,
        }}
      >
        {[
          { label: "NAV", value: market.nav.toFixed(2), color: market.color },
          { label: "CAGR", value: market.cagr, color: retColor },
          { label: "ALPHA", value: market.alpha, color: alphaColor },
        ].map(({ label, value, color }, idx) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center py-2.5 px-1"
            style={{
              background: "#06060E",
              borderLeft: idx > 0 ? `1px solid ${market.color}10` : undefined,
            }}
          >
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#32325A]">
              {label}
            </p>
            <p
              className="font-mono text-[16px] font-bold tabular-nums mt-0.5"
              style={{ color }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Holdings ── */}
      <div className="px-5 pb-4">
        {/* Core Positions */}
        {corePositions.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#50507A] font-semibold">
                Core Positions · {corePositions.length}
              </p>
              <p className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-[#252542] italic">
                hover to explore
              </p>
            </div>
            <div className="space-y-1.5">
              {corePositions.map((h) => (
                <HoldingCard key={h.name} holding={h} color={market.color} />
              ))}
            </div>
          </div>
        )}

        {/* Alpha Projects */}
        {projects.length > 0 && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#50507A] font-semibold mb-2">
              Alpha Projects · {projects.length}
            </p>
            <div className="space-y-1.5">
              {projects.map((h) => (
                <HoldingCard key={h.name} holding={h} color={market.color} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sharpe / Positions footnote */}
      <div className="mx-5 mb-3 flex items-center justify-between rounded-lg border border-[#0C0C1C] bg-[#05050C] px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-[#32325A]">
            Sharpe
          </span>
          <span className="font-mono text-[12px] font-bold text-[#BFC5D4]">
            {market.sharpe}
          </span>
        </div>
        <div className="w-px h-4 bg-[#151530]" />
        <p className="text-[10px] leading-relaxed text-[#444460] text-right max-w-[180px]">
          {market.description}
        </p>
      </div>

      {/* CTA */}
      <div className="mt-auto border-t border-[#0C0C1A]">
        <button
          onClick={() => onEnter(market.id)}
          className="group w-full flex items-center justify-between px-5 py-4"
          style={{
            background: hovered ? `${market.color}0C` : "transparent",
            transition: "background 0.2s",
          }}
        >
          <span
            className="font-mono text-[11px] uppercase tracking-[0.22em] font-bold"
            style={{ color: market.color }}
          >
            View Equity Curve
          </span>
          <ArrowRight
            size={16}
            style={{ color: market.color }}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Contact modal ────────────────────────────────────────────────────────────────
function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", reason: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.reason) return;
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("sent");
  };

  const inputCls = cn(
    "w-full rounded-lg border border-[#1A1A30] bg-[#08080F] px-4 py-2.5",
    "font-mono text-[12px] text-[#D4D8F0] placeholder:text-[#2D2D4A]",
    "focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/30",
    "transition-colors duration-150"
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2,2,8,0.85)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-2xl border border-[#1A1A30] bg-[#06060D] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0F0F20] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#6366F1] opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6366F1]" />
            </span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-white">
              INITIATE CONTACT
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#3D3D5C] hover:text-[#9CA3AF] hover:bg-[#0F0F1A] transition-colors"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4 px-6 py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.1 }}
              >
                <CheckCircle size={44} className="text-[#22C55E]" />
              </motion.div>
              <div className="space-y-1.5">
                <p className="font-mono text-[13px] font-bold uppercase tracking-[0.18em] text-white">
                  MESSAGE TRANSMITTED
                </p>
                <p className="text-sm text-[#6B7280]">
                  I&apos;ll get back to you at{" "}
                  <span className="text-[#A5B4FC]">{form.email}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 rounded-lg border border-[#1A1A30] px-6 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF] hover:border-[#6366F1] hover:text-white transition-colors"
              >
                Close
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="px-5 py-5 space-y-4"
            >
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#4B5563]">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#4B5563]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#4B5563]">
                  Reason
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="U R CRACKED, U R HIRED !!"
                  value={form.reason}
                  onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                  className={cn(inputCls, "resize-none leading-relaxed")}
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-[10px] text-[#2D2D4A]">
                  tsingh05@uw.edu
                </span>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-200",
                    status === "sending"
                      ? "border border-[#2D2D50] text-[#4B5563] cursor-not-allowed"
                      : "border border-[#6366F1] bg-[#6366F1]/15 text-[#818CF8] hover:bg-[#6366F1]/25 hover:text-white"
                  )}
                >
                  {status === "sending" ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-3 h-3 border border-[#4B5563] border-t-[#6366F1] rounded-full"
                      />
                      Sending
                    </>
                  ) : (
                    <>
                      <Send size={12} />
                      Transmit
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────────
export function MarketSelect({ onSelect }: { onSelect: (market: Market) => void }) {
  const [contactOpen, setContactOpen] = useState(false);
  const allTicker = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative min-h-screen bg-[#03030A] text-[#F8F8FF] flex flex-col">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_25%,rgba(34,197,94,0.04),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_25%,rgba(99,102,241,0.05),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(34,211,238,0.02),transparent_50%)]" />
      </div>

      {/* Top bar */}
      <motion.header
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex items-center justify-between gap-4 px-6 border-b border-[#0E0E1E] bg-[#04040C]"
        style={{ minHeight: "52px" }}
      >
        {/* Left — branding */}
        <div className="flex items-center gap-3 py-3">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#6366F1] opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6366F1]" />
          </span>
          <span className="font-mono text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-white">
            Triaksha Singh
          </span>
          <span className="font-mono text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6366F1]">
            Capital Markets
          </span>
          <span className="hidden md:inline font-mono text-[10px] text-[#20203A] select-none">
            |
          </span>
          <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.16em] text-[#30305A]">
            Career Equity · Class of 2028
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3 py-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#161628] bg-[#080814] px-3 py-1">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22C55E]" />
            </span>
            <span className="font-mono text-[10px] text-[#22C55E] uppercase tracking-[0.2em]">
              Live
            </span>
            <span className="font-mono text-[10px] text-[#2E2E48]">·</span>
            <LiveClock />
          </div>

          <a
            href="https://github.com/triakshasingh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-[#181830] bg-[#080814] px-3 py-1.5 font-mono text-[11px] font-semibold text-[#7A7A96] uppercase tracking-[0.14em] hover:border-[#6366F1] hover:text-white transition-colors duration-200"
          >
            <GitHubIcon size={13} />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-[#6366F1] bg-[#6366F1]/10 px-3 py-1.5 font-mono text-[11px] font-semibold text-[#818CF8] uppercase tracking-[0.14em] hover:bg-[#6366F1]/20 hover:text-white transition-colors duration-200"
          >
            <FileText size={13} />
            <span className="hidden sm:inline">Resume</span>
          </a>

          <button
            onClick={() => setContactOpen(true)}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[#181830] bg-[#080814] px-3 py-1.5 font-mono text-[11px] font-semibold text-[#7A7A96] uppercase tracking-[0.14em] hover:border-[#22D3EE] hover:text-white transition-colors duration-200"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Contact
          </button>
        </div>
      </motion.header>

      {/* Ticker tape */}
      <div className="relative z-10 overflow-hidden border-b border-[#0A0A16] bg-[#03030B] py-1.5">
        <motion.div
          className="flex gap-0 whitespace-nowrap"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {allTicker.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-6">
              <span className="font-mono text-[10px] font-bold text-[#32325A] tracking-widest">
                {item.sym}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-[#555570]">
                {item.val}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-[#22C55E]">
                {item.chg}
              </span>
              <span className="font-mono text-[10px] text-[#141426] select-none">·</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-6 py-10">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 text-center max-w-xl"
        >
          <p className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-[#252548] mb-3">
            CAREER PORTFOLIO · 2020 — PRESENT
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#E0E4F6] leading-tight">
            Triaksha Singh
          </h1>
          <p
            className="mt-1 text-sm font-semibold"
            style={{
              background: "linear-gradient(90deg, #22C55E, #6366F1, #22D3EE)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Robotics · ML Systems · Quant Engineering
          </p>
          <p className="mt-3 text-[12px] leading-relaxed text-[#45456A]">
            Career modeled as a capital market. Each role is a{" "}
            <span className="text-[#606080]">position</span>. Each project is{" "}
            <span className="text-[#606080]">alpha</span>.{" "}
            Select an exchange to open the equity curve.
          </p>

          {/* Domain tags */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {DOMAIN_TAGS.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full font-mono text-[8.5px] uppercase tracking-[0.18em] border border-[#14142A] text-[#38385A] bg-[#07070F]"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Exchange cards */}
        <div className="w-full max-w-xl grid grid-cols-1 gap-5 items-start mx-auto">
          {MARKETS.map((market, i) => (
            <ExchangeCard
              key={market.id}
              market={market}
              onEnter={onSelect}
              delay={0.2 + i * 0.12}
            />
          ))}
        </div>

        {/* Aggregate bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 w-full max-w-5xl flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#0D0D1C] bg-[#05050C] px-6 py-3"
        >
          {[
            { label: "Total Positions", value: "6" },
            { label: "Portfolio NAV", value: "92.00" },
            { label: "Composite Alpha", value: "+24.2%" },
            { label: "Best Sharpe", value: "3.07 (UW)" },
            { label: "Exchange", value: "UW · Class of 2027" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-[#252548]">
                {label}
              </span>
              <span className="font-mono text-[12px] font-bold text-[#7A7A9A]">
                {value}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Contact modal */}
      <AnimatePresence>
        {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
