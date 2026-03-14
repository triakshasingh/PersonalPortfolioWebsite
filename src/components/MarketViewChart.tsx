"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { SiPython, SiCplusplus, SiNumpy, SiPandas, SiScikitlearn, SiPytorch, SiR3, SiMysql } from "react-icons/si";
import { IconType } from "react-icons";

// ─── Types ──────────────────────────────────────────────────────────────────

interface RoleData {
  ticker: string;
  label: string;   // role title
  company: string;
  location: string;
  type: string;
  detail: string;
  bullets: string[];
  tags: string[];
  color: string;
  start: string;
  end: string | null;
}

interface ProjectData {
  ticker: string;
  label: string;   // project name
  category: string;
  detail: string;
  bullets: string[];
  tags: string[];
  color: string;
  date: string;
  github: string;
}

type SelectedItem =
  | { type: "role"; data: RoleData }
  | { type: "project"; data: ProjectData };

// ─── Data ───────────────────────────────────────────────────────────────────

const BASE_DATA: { date: string; base: number }[] = [
  { date: "2024-07", base: 56 },
  { date: "2024-08", base: 59 },
  { date: "2024-09", base: 61 },
  { date: "2024-10", base: 65 },
  { date: "2024-11", base: 66 },
  { date: "2024-12", base: 68 },
  { date: "2025-01", base: 70 },
  { date: "2025-02", base: 71 },
  { date: "2025-03", base: 72 },
  { date: "2025-04", base: 73 },
  { date: "2025-05", base: 75 },
  { date: "2025-06", base: 78 },
  { date: "2025-07", base: 79 },
  { date: "2025-08", base: 80 },
  { date: "2025-09", base: 82 },
  { date: "2025-10", base: 83 },
  { date: "2025-11", base: 84 },
  { date: "2025-12", base: 85 },
  { date: "2026-01", base: 88 },
  { date: "2026-02", base: 90 },
  { date: "2026-03", base: 92 },
];

const ROLES: RoleData[] = [
  {
    ticker: "HSKY",
    label: "Mechatronics Engineer",
    company: "UW Husky Robotics Team",
    location: "Seattle, WA",
    type: "Research",
    detail: "Drone software subteam — autonomous flight systems and servo integration.",
    bullets: [
      "Built performance-critical distributed ROS2 services in C++/Python on Linux, reducing end-to-end control latency by ~30% through asynchronous messaging and execution profiling.",
      "Integrated Betaflight flight-control stack to establish deterministic servo signal pipelines between transmitter input and actuator output.",
      "Debugged cross-layer failures across embedded firmware, Linux services, and hardware interfaces to ensure stable real-time system behavior.",
    ],
    tags: ["ROS2", "C++", "Python", "Linux", "Betaflight", "Embedded Firmware", "Profiling"],
    color: "#6366F1",
    start: "2024-10",
    end: "2025-05",
  },
  {
    ticker: "INNO",
    label: "AI/ML Intern",
    company: "Inntech",
    location: "Muscat, Oman",
    type: "Internship",
    detail: "Built and deployed ML pipelines for predictive analytics.",
    bullets: [
      "Engineered modular Python data-processing pipelines for structured datasets, reducing manual overhead by ~40% while improving computational reliability and system maintainability.",
      "Designed and validated predictive computation workflows with rigorous error analysis and cross-validation, integrating outputs into backend systems with clean, scalable architecture.",
    ],
    tags: ["Python", "Scikit-learn", "Pandas", "NumPy", "statsmodels", "Data Pipelines"],
    color: "#22D3EE",
    start: "2025-06",
    end: "2025-08",
  },
  {
    ticker: "BIOE",
    label: "Research Intern",
    company: "Allbritton Lab – UW Bioengineering",
    location: "Seattle, WA",
    type: "Research",
    detail: "Embedded systems and software integration for biomedical research hardware.",
    bullets: [
      "Architected end-to-end communication pipeline between ESP32 firmware and Raspberry Pi controller using WiFi + structured JSON messaging, enabling reliable real-time device-to-server synchronization.",
      "Designed and implemented distributed device state management logic across firmware, backend agents, and web dashboard — consistent execution of multi-stage workflows under concurrent user access.",
      "Debugged and integrated multi-layer system components (embedded firmware, Linux-based controller, Node.js backend, MongoDB, Socket.IO telemetry) to centralize communication flows.",
    ],
    tags: ["ESP32", "Raspberry Pi", "Node.js", "MongoDB", "Socket.IO", "Linux", "WiFi", "JSON"],
    color: "#10B981",
    start: "2026-01",
    end: null,
  },
];

const PROJECTS: ProjectData[] = [
  {
    ticker: "DIAB",
    label: "Diabetes Prediction Model",
    category: "ML / Healthcare",
    detail: "End-to-end ML pipeline for predicting diabetes — from preprocessing to single-user inference.",
    bullets: [
      "Standardized medical feature inputs using StandardScaler and applied stratified 80/20 train-test split to maintain class balance.",
      "Implemented linear SVM classifier; evaluated model performance using accuracy metrics on both training and test sets.",
      "Supports single-user predictions via manual feature input through a clean inference interface.",
    ],
    tags: ["Python", "scikit-learn", "NumPy", "pandas", "SVM", "StandardScaler"],
    color: "#f59e0b",
    date: "2025-09",
    github: "https://github.com/triakshasingh/Diabetes_Prediction-ML-",
  },
  {
    ticker: "VOLX",
    label: "Volatility Estimator Toolkit",
    category: "Quant / Risk Systems",
    detail: "Modular financial analytics engine for large-scale time-series processing with rolling-window and EWMA estimators.",
    bullets: [
      "Implemented EWMA and rolling-window estimators with configurable parameters — validated across varying input regimes.",
      "Optimized high-volume time-series computation using vectorized NumPy operations, eliminating iterative loops.",
      "Benchmarked estimator stability and computational trade-offs under simulated market shocks to evaluate robustness.",
    ],
    tags: ["Python", "NumPy", "pandas", "statsmodels", "EWMA", "Time Series"],
    color: "#f59e0b",
    date: "2026-02",
    github: "https://github.com/triakshasingh/volatility-estimator-",
  },
  {
    ticker: "LOBE",
    label: "Limit Order Book & Matching Engine",
    category: "Quant / Trading Systems",
    detail: "Price-time priority limit order book with deterministic matching for market and limit orders.",
    bullets: [
      "O(log P) price-level updates and O(1) cancel via hash index + intrusive linked lists.",
      "Benchmarked 1,000,000 synthetic events — 102,056 events/sec; p50 5.29 μs, p95 13.18 μs, p99 20.33 μs.",
      "Modular architecture separating order book state, matching logic, and benchmark harness.",
    ],
    tags: ["Python", "C++", "Market Microstructure", "Order Flow", "Benchmarking"],
    color: "#f59e0b",
    date: "2026-03",
    github: "https://github.com/triakshasingh/limitOrderBook",
  },
];

// ─── Contact + Stack data ────────────────────────────────────────────────────

const CONTACT_PHONE = "+1 (206) 605-6394";

const QUANT_STACK: { label: string; Icon: IconType; color: string }[] = [
  { label: "Python",       Icon: SiPython,      color: "#3B82F6" },
  { label: "C++",          Icon: SiCplusplus,   color: "#00599C" },
  { label: "NumPy",        Icon: SiNumpy,        color: "#4DABCF" },
  { label: "pandas",       Icon: SiPandas,       color: "#8B5CF6" },
  { label: "scikit-learn", Icon: SiScikitlearn,  color: "#F7931E" },
  { label: "PyTorch",      Icon: SiPytorch,      color: "#EE4C2C" },
  { label: "R",            Icon: SiR3,           color: "#276DC3" },
  { label: "MySQL",        Icon: SiMysql,        color: "#4479A1" },
];

const QUANT_TEXT = ["EWMA", "Time Series", "statsmodels", "Market Micro.", "Order Flow", "Benchmarking"];

// ─── Layout constants (module-level — never change) ──────────────────────────

const PAD_LEFT = 64;
const PAD_RIGHT = 84;
const PAD_TOP = 24;
const PRICE_H = 220;
const ROLE_H = 26;
const PROJ_H = 54;
const X_AXIS_H = 32;
const GAP = 8;
const Y_MIN = 50;
const Y_MAX = 98;

const priceTop = PAD_TOP;
const priceBot = priceTop + PRICE_H;
const roleTop = priceBot + GAP;
const roleBot = roleTop + ROLE_H;
const projTop = roleBot + GAP;
const projBot = projTop + PROJ_H;
const xAxisTop = projBot + GAP;
const SVG_H = xAxisTop + X_AXIS_H + 12;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTH_ABBR = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function parseDateToIdx(d: string): number {
  const [yr, mo] = d.split("-").map(Number);
  return (yr - 2024) * 12 + (mo - 7);
}

function fmtDate(d: string): string {
  const [yr, mo] = d.split("-").map(Number);
  return `${MONTH_ABBR[mo - 1]} ${yr}`;
}

function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MarketViewChart({ onBack }: { onBack: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(900);
  const [crosshair, setCrosshair] = useState<{ x: number; y: number; v: number } | null>(null);
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<SelectedItem | null>(null);
  const [now, setNow] = useState<Date>(() => new Date());
  const [showContact, setShowContact] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [animFrac, setAnimFrac] = useState(0);
  const animStarted = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 900;
      if (w > 0) setCw(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Draw-in animation — runs once when container width is measured
  useEffect(() => {
    if (cw < 100 || animStarted.current) return;
    animStarted.current = true;
    const DURATION = 2600;
    let start: number | null = null;
    const ease = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const raw = Math.min((ts - start) / DURATION, 1);
      setAnimFrac(ease(raw));
      if (raw < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [cw]);

  const cLeft = PAD_LEFT;
  const cRight = cw - PAD_RIGHT;
  const cWidth = Math.max(cRight - cLeft, 1);
  const N = BASE_DATA.length;

  const toY = (v: number) =>
    priceTop + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * PRICE_H;
  const toX = (i: number) => cLeft + (i / (N - 1)) * cWidth;
  const dateToX = (d: string) => toX(parseDateToIdx(d));

  const pricePoints = useMemo(() => {
    const _toY = (v: number) =>
      priceTop + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * PRICE_H;
    const rand = mulberry32(42);
    const pts: { x: number; y: number; v: number }[] = [];
    let momentum = 0;
    for (let i = 0; i < N; i++) {
      const base = BASE_DATA[i].base;
      if (i === N - 1) {
        pts.push({ x: cLeft + cWidth, y: _toY(base), v: base });
        break;
      }
      const nextBase = BASE_DATA[i + 1].base;
      for (let j = 0; j < 6; j++) {
        const t = j / 6;
        const interp = base + (nextBase - base) * t;
        const amp = j === 0 ? 0.3 : 2.2;
        const raw = (rand() - 0.5) * 2 * amp;
        const noise = raw + momentum * 0.25;
        momentum = noise;
        const v = Math.max(Y_MIN + 0.5, Math.min(Y_MAX - 0.5, interp + noise));
        const mf = i + t;
        pts.push({ x: cLeft + (mf / (N - 1)) * cWidth, y: _toY(v), v });
      }
    }
    return pts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cLeft, cWidth]);

  const priceYAtX = (x: number): number => {
    let nearest = pricePoints[0];
    let minD = Infinity;
    for (const pt of pricePoints) {
      const d = Math.abs(pt.x - x);
      if (d < minD) { minD = d; nearest = pt; }
    }
    return nearest.y;
  };

  const polyPts = pricePoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = [
    `M ${pricePoints[0].x.toFixed(1)},${priceBot}`,
    ...pricePoints.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`),
    `L ${pricePoints[pricePoints.length - 1].x.toFixed(1)},${priceBot}`,
    "Z",
  ].join(" ");

  const firstBase = BASE_DATA[0].base;
  const lastBase = BASE_DATA[N - 1].base;
  const retPct = (((lastBase - firstBase) / firstBase) * 100).toFixed(1);
  const retAbs = (lastBase - firstBase).toFixed(1);
  const activeCount = ROLES.filter((r) => !r.end).length;

  const yTicks = [55, 60, 65, 70, 75, 80, 85, 90];
  const yearSeps = [{ i: 6, yr: "2025" }, { i: 18, yr: "2026" }];

  const xLabels = BASE_DATA
    .map(({ date }, i) => {
      const [yr, mo] = date.split("-").map(Number);
      if ((mo - 1) % 3 === 0 || i === N - 1)
        return { date, x: toX(i), isJan: mo === 1, yr };
      return null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    if (mx < cLeft - 6 || mx > cRight + 6) { setCrosshair(null); setHoveredItem(null); return; }
    let nearest = pricePoints[0];
    let minD = Infinity;
    for (const pt of pricePoints) {
      const d = Math.abs(pt.x - mx);
      if (d < minD) { minD = d; nearest = pt; }
    }
    setCrosshair({ x: nearest.x, y: nearest.y, v: nearest.v });

    // Project dot proximity takes priority (within 10px)
    let foundProj: ProjectData | null = null;
    for (const proj of PROJECTS) {
      if (Math.abs(mx - dateToX(proj.date)) <= 10) { foundProj = proj; break; }
    }
    if (foundProj) { setHoveredItem({ type: "project", data: foundProj }); return; }

    // Auto-highlight the role whose time window contains the cursor X
    let found: RoleData | null = null;
    for (const role of ROLES) {
      const rx1 = dateToX(role.start);
      const rx2 = role.end ? dateToX(role.end) : cRight;
      if (mx >= rx1 && mx <= rx2) { found = role; break; }
    }
    setHoveredItem(found ? { type: "role", data: found } : null);
  }

  const clockStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false, timeZone: "America/New_York",
  });

  const mono = "'JetBrains Mono', 'Courier New', monospace";

  return (
    <div style={{ background: "#070b12", minHeight: "100vh", fontFamily: mono, color: "#e2e8f0", display: "flex", flexDirection: "column" }}>

      {/* ── BAR 1 ── */}
      <div style={{ height: 38, flexShrink: 0, background: "#060d16", borderBottom: "1px solid #1a2235", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", fontSize: 11 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <button
            onClick={onBack}
            style={{ color: "#94a3b8", background: "none", border: "none", fontFamily: mono, fontSize: 11, cursor: "pointer", letterSpacing: "0.07em", padding: 0 }}
          >
            ← PORTFOLIO
          </button>
          <span style={{ color: "#2d3f55" }}>│</span>
          <span style={{ color: "#94a3b8", letterSpacing: "0.14em", fontSize: 10 }}>
            TS · MARKET VIEW TERMINAL
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ color: "#64748b", fontVariantNumeric: "tabular-nums", fontSize: 10, letterSpacing: "0.04em" }}>
            {clockStr} EST
          </span>
          <span style={{ color: "#00ff88", fontSize: 10, letterSpacing: "0.1em" }}>● LIVE</span>
        </div>
      </div>

      {/* ── BAR 2 ── */}
      <div style={{ height: 32, flexShrink: 0, background: "#050a10", borderBottom: "1px solid #1a2235", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", fontSize: 10 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ color: "#64748b", letterSpacing: "0.14em" }}>MARKETS</span>
          <span style={{ color: "#22d3ee", fontWeight: 700, letterSpacing: "0.08em" }}>$TRIAX.UW</span>
          <span style={{ color: "#2d3f55" }}>·</span>
          <span style={{ color: "#94a3b8" }}>Univ. of Washington · ECE/CS</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ color: "#e2e8f0", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
            {lastBase.toFixed(2)}
          </span>
          <span style={{ color: "#00ff88", fontVariantNumeric: "tabular-nums" }}>
            +{retAbs} (+{retPct}%)
          </span>
          <span style={{ color: "#00ff88" }}>● LIVE</span>
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* Chart */}
        <div ref={containerRef} style={{ flex: 1, padding: "20px 0 0 0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <svg
            width={cw}
            height={SVG_H}
            style={{ display: "block", overflow: "visible", flexShrink: 0 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { setCrosshair(null); setHoveredItem(null); }}
          >
            <defs>
              <linearGradient id="mvAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"    />
              </linearGradient>
              <linearGradient id="mvProjBg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#0c1526" />
                <stop offset="100%" stopColor="#070b12" />
              </linearGradient>
              {/* Animation clip — expands left→right as animFrac goes 0→1; +20 lets edge diamonds overflow without clipping */}
              <clipPath id="mvDrawClip">
                <rect x={cLeft} y={priceTop - 10} width={cWidth * animFrac + 20} height={SVG_H + 20} />
              </clipPath>
              {/* Per-role text clips — constrain label to within each role block */}
              {ROLES.map((role) => {
                const rx1 = dateToX(role.start);
                const rx2 = role.end ? dateToX(role.end) : cRight;
                return (
                  <clipPath key={`rclip-${role.ticker}`} id={`mvRoleClip-${role.ticker}`}>
                    <rect x={rx1 + 5} y={roleTop} width={Math.max(rx2 - rx1 - 10, 0)} height={ROLE_H} />
                  </clipPath>
                );
              })}
            </defs>

            {/* Horizontal grid lines */}
            {yTicks.map((v) => (
              <g key={v}>
                <line x1={cLeft} y1={toY(v)} x2={cRight} y2={toY(v)} stroke="#0d1a2e" strokeWidth={1} />
                <text x={cRight + 6} y={toY(v) + 3.5} fill="#94a3b8" fontSize={11} fontFamily={mono}>{v}</text>
              </g>
            ))}

            {/* Year separator verticals */}
            {yearSeps.map(({ i, yr }) => (
              <line key={yr} x1={toX(i)} y1={priceTop} x2={toX(i)} y2={xAxisTop + X_AXIS_H} stroke="#1a2840" strokeWidth={1} strokeDasharray="3 3" />
            ))}

            {/* Area fill */}
            <path d={areaPath} fill="url(#mvAreaGrad)" clipPath="url(#mvDrawClip)" />

            {/* Price polyline */}
            <polyline points={polyPts} fill="none" stroke="#3b82f6" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" clipPath="url(#mvDrawClip)" />

            {/* Dashed reference + badge — only after animation completes */}
            {animFrac >= 0.99 && (
              <g>
                <line x1={cLeft} y1={toY(lastBase)} x2={cRight} y2={toY(lastBase)} stroke="#3b82f6" strokeWidth={0.8} strokeDasharray="5 4" strokeOpacity={0.25} />
                <rect x={cRight + 4} y={toY(lastBase) - 9} width={54} height={18} rx={2} fill="#1d3461" />
                <text x={cRight + 31} y={toY(lastBase) + 4.5} fill="#93c5fd" fontSize={9.5} fontFamily={mono} textAnchor="middle" fontWeight={600}>
                  {lastBase.toFixed(1)}
                </text>
              </g>
            )}

            {/* ── ROLE STRIP ── */}
            <text x={cLeft - 6} y={roleTop + 14} fill="#94a3b8" fontSize={11} fontFamily={mono} textAnchor="end" fontWeight={600}>ROLE</text>
            <rect x={cLeft} y={roleTop} width={cWidth} height={ROLE_H} fill="#090f1c" rx={1} />

            <g clipPath="url(#mvDrawClip)">
              {ROLES.map((role) => {
                const rx1 = dateToX(role.start);
                const rx2 = role.end ? dateToX(role.end) : cRight;
                const ongoing = !role.end;
                const isActive = selected?.data === role || hoveredItem?.data === role;
                return (
                  <g key={role.ticker} style={{ cursor: "pointer" }} onClick={() => setSelected({ type: "role", data: role })}>
                    <rect x={rx1} y={roleTop} width={Math.max(rx2 - rx1, 2)} height={ROLE_H} rx={2} fill={role.color} fillOpacity={isActive ? 0.5 : 0.15} stroke={role.color} strokeWidth={isActive ? 1 : 0.6} strokeOpacity={0.7} />
                    {!ongoing && (
                      <>
                        <line x1={rx2} y1={roleTop} x2={rx2} y2={roleBot} stroke="#ff6b6b" strokeWidth={1.5} strokeDasharray="2 2" />
                        <circle cx={rx2} cy={(roleTop + roleBot) / 2} r={4} fill="#ff6b6b" stroke="#070b12" strokeWidth={1} />
                      </>
                    )}
                    <g clipPath={`url(#mvRoleClip-${role.ticker})`}>
                      <text x={rx1 + 6} y={roleTop + 10} fill={role.color} fontSize={8} fontFamily={mono} fontWeight={700} opacity={0.7}>
                        {role.ticker}{ongoing ? " ▶" : ""}
                      </text>
                      <text x={rx1 + 6} y={roleTop + 20} fill={role.color} fontSize={9} fontFamily={mono} fontWeight={600}>
                        {role.company}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* ── PROJECT LANE ── */}
            <rect x={cLeft} y={projTop} width={cWidth} height={PROJ_H} fill="url(#mvProjBg)" rx={2} />
            <text x={cLeft - 6} y={projTop + 14} fill="#94a3b8" fontSize={11} fontFamily={mono} textAnchor="end" fontWeight={600}>PROJ</text>

            <g clipPath="url(#mvDrawClip)">
              {PROJECTS.map((proj) => {
                const px = dateToX(proj.date);
                const cy = projTop + PROJ_H / 2;
                const ds = 11;
                const isSel = selected?.data === proj;
                const dotY = priceYAtX(px);
                const isProjHov = hoveredItem?.type === "project" && hoveredItem.data === proj;
                return (
                  <g key={proj.ticker} style={{ cursor: "pointer" }} onClick={() => setSelected({ type: "project", data: proj })}>
                    {/* Vertical dotted line: price chart → diamond */}
                    <line x1={px} y1={dotY} x2={px} y2={cy - ds - 3} stroke={proj.color} strokeWidth={1} strokeOpacity={0.45} strokeDasharray="3 3" />

                    {/* Dot on price line */}
                    <circle cx={px} cy={dotY} r={isProjHov ? 5.5 : 4} fill={proj.color} stroke="#070b12" strokeWidth={1.5} />
                    {/* Invisible wider hit area on dot */}
                    <circle cx={px} cy={dotY} r={10} fill="transparent" />

                    {/* Glow halo */}
                    <polygon points={`${px},${cy - ds - 3} ${px + ds + 3},${cy} ${px},${cy + ds + 3} ${px - ds - 3},${cy}`} fill={proj.color} fillOpacity={0.08} />
                    {/* Diamond */}
                    <polygon points={`${px},${cy - ds} ${px + ds},${cy} ${px},${cy + ds} ${px - ds},${cy}`} fill={isSel || isProjHov ? proj.color : `${proj.color}30`} stroke={proj.color} strokeWidth={isSel || isProjHov ? 0 : 1.5} />
                    <text x={px} y={cy + ds + 14} fill={proj.color} fontSize={9} fontFamily={mono} textAnchor="middle" fontWeight={600}>{proj.ticker}</text>
                  </g>
                );
              })}
            </g>

            {/* ── X-AXIS ── */}
            <line x1={cLeft} y1={xAxisTop} x2={cRight} y2={xAxisTop} stroke="#1a2235" strokeWidth={0.5} />
            {xLabels.map((item) => {
              const [moStr, yrStr] = fmtDate(item.date).split(" ");
              return (
                <g key={item.date}>
                  <line x1={item.x} y1={xAxisTop} x2={item.x} y2={xAxisTop + 4} stroke="#334155" strokeWidth={0.8} />
                  <text x={item.x} y={xAxisTop + 16} fill={item.isJan ? "#e2e8f0" : "#94a3b8"} fontSize={11} fontFamily={mono} textAnchor="middle" fontWeight={item.isJan ? 700 : 400}>
                    {moStr}
                  </text>
                  {item.isJan && (
                    <text x={item.x} y={xAxisTop + 28} fill="#64748b" fontSize={10} fontFamily={mono} textAnchor="middle">
                      {yrStr}
                    </text>
                  )}
                </g>
              );
            })}

            {/* ── CROSSHAIR ── */}
            {crosshair && (
              <g>
                <line x1={crosshair.x} y1={priceTop} x2={crosshair.x} y2={priceBot} stroke="#475569" strokeWidth={0.8} strokeDasharray="4 3" strokeOpacity={0.7} />
                <line x1={cLeft} y1={crosshair.y} x2={cRight} y2={crosshair.y} stroke="#475569" strokeWidth={0.8} strokeDasharray="4 3" strokeOpacity={0.45} />
                <circle cx={crosshair.x} cy={crosshair.y} r={3.5} fill="#3b82f6" stroke="#070b12" strokeWidth={1.5} />
                <rect x={cRight + 4} y={crosshair.y - 9} width={54} height={18} rx={2} fill="#0f172a" stroke="#334155" strokeWidth={0.8} />
                <text x={cRight + 31} y={crosshair.y + 4.5} fill="#94a3b8" fontSize={9} fontFamily={mono} textAnchor="middle">
                  {crosshair.v.toFixed(1)}
                </text>
              </g>
            )}
          </svg>

          {/* ── INVESTMENT THESIS ── */}
          <div style={{ flex: 1, padding: "20px 24px 16px", overflowY: "auto", borderTop: "1px solid #1a2235" }}>
            <div style={{ fontFamily: mono, fontSize: 13, color: "#6366F1", letterSpacing: "0.18em", marginBottom: 14, fontWeight: 700 }}>
              WHY I&apos;M A GOOD STOCK TO INVEST IN
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {([
                { label: "STRONG FUNDAMENTALS", value: "UW ECE — rigorous quant foundation in signals, systems & CS", color: "#00d4ff" },
                { label: "EARLY STAGE, HIGH UPSIDE", value: "2nd-year undergrad already shipping real products & research — asymmetric growth curve", color: "#00ff88" },
                { label: "PROVEN ALPHA GENERATION", value: "Built quant tools & research systems from scratch — not just theory", color: "#6366F1" },
                { label: "DIVERSIFIED EXPOSURE", value: "Bioengineering research, robotics, fintech & AI — multi-sector operator with deep focus", color: "#8B5CF6" },
                { label: "LOW OVERHEAD", value: "Self-directed, fast learner, no ego — ships fast and iterates faster", color: "#22D3EE" },
                { label: "LONG INVESTMENT HORIZON", value: "3+ years of compounding experience ahead — best entry point is now", color: "#F59E0B" },
              ] as { label: string; value: string; color: string }[]).map(({ label, value, color }) => (
                <div key={label} style={{ background: "#070d1a", border: `1px solid ${color}18`, borderLeft: `2px solid ${color}`, borderRadius: 6, padding: "10px 12px" }}>
                  <div style={{ fontFamily: mono, fontSize: 9, color, letterSpacing: "0.14em", marginBottom: 5 }}>{label}</div>
                  <div style={{ fontFamily: mono, fontSize: 11, color: "#94a3b8", lineHeight: 1.55 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── BOTTOM: QUANT STACK + CONTACT ── */}
          <div style={{ padding: "16px 20px 18px", borderTop: "1px solid #1a2235", position: "relative", flexShrink: 0 }}>
            <div style={{ color: "#64748b", fontSize: 11, letterSpacing: "0.18em", marginBottom: 10, fontFamily: mono }}>QUANT STACK</div>

            {/* Icon grid — 4 columns × 2 rows */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5, marginBottom: 8 }}>
              {QUANT_STACK.map(({ label, Icon, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", border: "1px solid #1a2235", borderRadius: 5, background: "#090f1c" }}>
                  <Icon size={17} style={{ color, flexShrink: 0 }} />
                  <span style={{ fontFamily: mono, fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Text-only quant items */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
              {QUANT_TEXT.map((t) => (
                <span key={t} style={{ fontFamily: mono, fontSize: 11, color: "#64748b", border: "1px solid #1a2235", background: "#070b12", padding: "3px 9px", borderRadius: 3 }}>
                  {t}
                </span>
              ))}
            </div>

            {/* Contact button */}
            <button
              onClick={() => setShowContact((v) => !v)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: mono, fontSize: 12, color: showContact ? "#e2e8f0" : "#94a3b8", border: `1px solid ${showContact ? "#6366F1" : "#1a2235"}`, borderRadius: 4, padding: "6px 16px", background: showContact ? "#6366F115" : "#060d16", letterSpacing: "0.12em", cursor: "pointer" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              CONTACT
            </button>

            {/* Contact card */}
            {showContact && (
              <div style={{ position: "absolute", bottom: "calc(100% + 10px)", left: 20, background: "#07101e", border: "1px solid #6366F1", borderRadius: 10, padding: "20px 22px", width: 380, zIndex: 20, boxShadow: "0 -8px 40px rgba(99,102,241,0.18), 0 -4px 20px rgba(0,0,0,0.8)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontFamily: mono, fontSize: 11, color: "#8B5CF6", letterSpacing: "0.18em" }}>CONTACT INFO</span>
                  <button onClick={() => setShowContact(false)} style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer", fontFamily: mono, fontSize: 14, padding: 0, lineHeight: 1 }}>✕</button>
                </div>

                {([
                  { label: "EMAIL",    value: "triakshasingh@gmail.com",    href: "mailto:triakshasingh@gmail.com",         copyable: true  },
                  { label: "SCHOOL",   value: "tsingh05@uw.edu",            href: "mailto:tsingh05@uw.edu",                 copyable: true  },
                  { label: "PHONE",    value: CONTACT_PHONE,                href: "tel:+12066056394",                       copyable: false },
                  { label: "LINKEDIN", value: "in/triakshasingh",           href: "https://linkedin.com/in/triakshasingh/", copyable: false },
                  { label: "GITHUB",   value: "github.com/triakshasingh",   href: "https://github.com/triakshasingh",       copyable: false },
                ] as { label: string; value: string; href: string; copyable: boolean }[]).map(({ label, value, href, copyable }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #0d1a2e" }}>
                    <span style={{ fontFamily: mono, fontSize: 10, color: "#6366F1", letterSpacing: "0.16em", minWidth: 70 }}>{label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        style={{ fontFamily: mono, fontSize: 12, color: "#c4c9d4", textDecoration: "none" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#e2e8f0"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#c4c9d4"; }}
                      >
                        {value}
                      </a>
                      {copyable && (
                        <button
                          onClick={() => { navigator.clipboard.writeText(value); setCopiedField(label); setTimeout(() => setCopiedField(null), 1800); }}
                          title="Copy"
                          style={{ color: copiedField === label ? "#00ff88" : "#475569", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: mono, fontSize: 12, lineHeight: 1 }}
                        >
                          {copiedField === label ? "✓" : "⎘"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── DETAIL PANEL ── */}
        <div style={{ width: 340, flexShrink: 0, background: "#060d16", borderLeft: "1px solid #1a2235", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ flex: 1, padding: "16px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
            {(hoveredItem ?? selected) ? (
              <SelectedPanel
                selected={(hoveredItem ?? selected)!}
                onClear={() => setSelected(null)}
                isHover={!!hoveredItem}
              />
            ) : (
              <IdlePanel />
            )}
          </div>

          {/* Stats footer */}
          <div style={{ flexShrink: 0, borderTop: "1px solid #1a2235", padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 8px" }}>
            {[
              { label: "ROLES",    value: String(ROLES.length),               color: "#e2e8f0" },
              { label: "ACTIVE",   value: `${activeCount} / ${ROLES.length}`, color: "#00ff88" },
              { label: "PROJECTS", value: String(PROJECTS.length),            color: "#e2e8f0" },
              { label: "RETURN",   value: `+${retPct}%`,                      color: "#00ff88" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div style={{ color: "#64748b", fontSize: 8, marginBottom: 3, letterSpacing: "0.14em" }}>{label}</div>
                <div style={{ color, fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────


function IdlePanel() {
  return (
    <>
      <p style={{ color: "#94a3b8", fontSize: 10, lineHeight: 1.7, margin: 0 }}>
        Click a role band or project marker to view details.
      </p>
      <div style={{ borderTop: "1px solid #1a2235", paddingTop: 12 }}>
        <div style={{ color: "#64748b", fontSize: 8, marginBottom: 8, letterSpacing: "0.16em" }}>LEGEND</div>
        {[
          { sym: "▬", color: "#00d4ff", label: "Role / employment" },
          { sym: "◆", color: "#f59e0b", label: "Project shipped"   },
          { sym: "▶", color: "#00ff88", label: "Currently active"  },
          { sym: "●", color: "#ff6b6b", label: "Role ended"        },
        ].map(({ sym, color, label }) => (
          <div key={label} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 10, marginBottom: 7 }}>
            <span style={{ color, width: 14 }}>{sym}</span>
            <span style={{ color: "#94a3b8" }}>{label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

const TYPE_COLORS: Record<string, string> = {
  Internship: "#22D3EE",
  Research:   "#10B981",
  Startup:    "#00ff88",
};

function SelectedPanel({ selected, onClear, isHover: _isHover }: { selected: SelectedItem; onClear: () => void; isHover?: boolean }) {
  const mono = "'JetBrains Mono', 'Courier New', monospace";

  if (selected.type === "role") {
    const d = selected.data;
    const isActive = !d.end;
    const typeColor = TYPE_COLORS[d.type] ?? "#9CA3AF";
    const startStr = fmtDate(d.start);
    const endStr   = d.end ? fmtDate(d.end) : "PRESENT";

    return (
      <>
        {/* Clear button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClear} style={{ color: "#94a3b8", background: "none", border: "1px solid #2d3f55", borderRadius: 2, padding: "2px 8px", fontSize: 8, cursor: "pointer", fontFamily: mono, letterSpacing: "0.12em" }}>
            CLEAR
          </button>
        </div>

        {/* Role + type badge */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 600 }}>{d.label}</span>
          <span style={{ fontFamily: mono, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.14em", padding: "2px 6px", borderRadius: 3, color: typeColor, background: `${typeColor}18`, border: `1px solid ${typeColor}30` }}>
            {d.type}
          </span>
          <span style={{ fontFamily: mono, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.14em", padding: "2px 6px", borderRadius: 3, color: isActive ? "#00ff88" : "#ff6b6b", background: isActive ? "rgba(0,255,136,0.08)" : "rgba(255,107,107,0.08)", border: `1px solid ${isActive ? "#00ff8830" : "#ff6b6b30"}` }}>
            {isActive ? "ACTIVE" : "CLOSED"}
          </span>
        </div>

        {/* Company */}
        <div style={{ color: "#A5B4FC", fontSize: 13, fontWeight: 500 }}>{d.company}</div>

        {/* Period + location */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: mono, fontSize: 11, color: "#9CA3AF" }}>{startStr} → {endStr}</span>
          <span style={{ fontFamily: mono, fontSize: 10, color: "#6B7280" }}>{d.location}</span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#1a2235" }} />

        {/* Bullets */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {d.bullets.map((b, i) => (
            <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "#C8CEDE", lineHeight: 1.6 }}>
              <span style={{ color: d.color, flexShrink: 0, marginTop: 2, fontSize: 10 }}>▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Tech stack */}
        <div style={{ borderTop: "1px solid #1a2235", paddingTop: 10 }}>
          <div style={{ fontFamily: mono, color: "#64748b", fontSize: 8, marginBottom: 7, letterSpacing: "0.16em" }}>STACK</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {d.tags.map((tag) => (
              <span key={tag} style={{ fontFamily: mono, border: "1px solid #1a2235", background: "#0a0a12", color: "#9CA3AF", padding: "2px 7px", borderRadius: 3, fontSize: 10 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Project
  const d = selected.data;
  const shipStr = fmtDate(d.date);

  return (
    <>
      {/* Clear button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClear} style={{ color: "#94a3b8", background: "none", border: "1px solid #2d3f55", borderRadius: 2, padding: "2px 8px", fontSize: 8, cursor: "pointer", fontFamily: mono, letterSpacing: "0.12em" }}>
          CLEAR
        </button>
      </div>

      {/* Category + shipped badge */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: mono, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: d.color }}>{d.category}</span>
        <span style={{ fontFamily: mono, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", padding: "2px 6px", borderRadius: 3, color: "#f59e0b", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
          SHIPPED
        </span>
      </div>

      {/* Project name */}
      <div style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{d.label}</div>

      {/* Ship date */}
      <div style={{ fontFamily: mono, fontSize: 11, color: "#9CA3AF" }}>Shipped {shipStr}</div>

      {/* Description */}
      <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.65 }}>{d.detail}</div>

      {/* Divider */}
      <div style={{ height: 1, background: "#1a2235" }} />

      {/* Bullets */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {d.bullets.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "#C8CEDE", lineHeight: 1.6 }}>
            <span style={{ color: d.color, flexShrink: 0, marginTop: 2, fontSize: 10 }}>▸</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* Tech stack + GitHub */}
      <div style={{ borderTop: "1px solid #1a2235", paddingTop: 10 }}>
        <div style={{ fontFamily: mono, color: "#64748b", fontSize: 8, marginBottom: 7, letterSpacing: "0.16em" }}>STACK</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {d.tags.map((tag) => (
            <span key={tag} style={{ fontFamily: mono, border: "1px solid #1a2235", background: "#0a0a12", color: "#9CA3AF", padding: "2px 7px", borderRadius: 3, fontSize: 10 }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <a
        href={d.github}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: mono, fontSize: 10, color: "#9CA3AF", textDecoration: "none", border: "1px solid #1a2235", borderRadius: 4, padding: "4px 10px", background: "#0a0a12" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#A5B4FC"; (e.currentTarget as HTMLElement).style.borderColor = "#6366F1"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLElement).style.borderColor = "#1a2235"; }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0 1 12 5.803c.957.004 1.983.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0z"/></svg>
        View on GitHub
      </a>
    </>
  );
}
