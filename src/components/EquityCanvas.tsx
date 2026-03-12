"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  timelineNodes,
  hsBounds,
  uwBounds,
  type CurveBounds,
  type TimelineNode,
} from "@/data/timelineNodes";
import { NodeSheet } from "@/components/NodeSheet";
import { ArrowLeft } from "lucide-react";

export type Market = "hs" | "uw";

type EquityCanvasProps = {
  market: Market;
  onBack: () => void;
  onNodeFocus?: (node: TimelineNode) => void;
};

// ─── Chart constants ───────────────────────────────────────────────────────────
const WIDTH = 1400;
const HEIGHT = 520;
const PAD_L = 64;
const PAD_R = 72;
const PAD_T = 44;
const PAD_B = 52;
const CHART_W = WIDTH - PAD_L - PAD_R;
const CHART_H = HEIGHT - PAD_T - PAD_B;
const VOL_H = 36;

// ─── Coordinate helpers (bounds-aware) ────────────────────────────────────────
function xYear2Px(year: number, b: CurveBounds): number {
  return PAD_L + ((year - b.minYear) / (b.maxYear - b.minYear)) * CHART_W;
}

function yVal2Px(val: number, b: CurveBounds): number {
  return PAD_T + (1 - (val - b.minY) / (b.maxY - b.minY)) * CHART_H;
}

function svgCoords(svgEl: SVGSVGElement, clientX: number, clientY: number, b: CurveBounds) {
  const rect = svgEl.getBoundingClientRect();
  const sx = ((clientX - rect.left) / rect.width) * WIDTH;
  const sy = ((clientY - rect.top) / rect.height) * HEIGHT;
  const year = b.minYear + ((sx - PAD_L) / CHART_W) * (b.maxYear - b.minYear);
  const val = b.minY + (1 - (sy - PAD_T) / CHART_H) * (b.maxY - b.minY);
  return { sx, sy, year, val: Math.max(b.minY, Math.min(b.maxY, val)) };
}

// ─── Market theme ──────────────────────────────────────────────────────────────
const THEME = {
  hs: {
    lineStart: "#22C55E",
    lineMid: "#16A34A",
    lineEnd: "#4ADE80",
    fillTop: "rgba(34,197,94,0.14)",
    fillBot: "rgba(10,10,15,0)",
    volTop: "rgba(34,197,94,0.22)",
    volBot: "rgba(34,197,94,0.02)",
    pillBg: "#051408",
    pillBorder: "rgba(34,197,94,0.28)",
    pillText: "rgba(34,197,94,0.85)",
    nodeBorder: "#1E3A2A",
    nodeHover: "#166534",
    nodeShadow: "rgba(34,197,94,0.45)",
    nodeInner: "rgba(34,197,94,0.2)",
    nodeRing: "rgba(34,197,94,0.4)",
    label: "High School Era",
    desc: "First principles to real systems. Quant infra, hardware, zero to functional.",
    tag: "$TRIAX.HS",
  },
  uw: {
    lineStart: "#5C6BFF",
    lineMid: "#7B5CFF",
    lineEnd: "#22D3EE",
    fillTop: "rgba(99,102,241,0.13)",
    fillBot: "rgba(10,10,15,0)",
    volTop: "rgba(99,102,241,0.25)",
    volBot: "rgba(99,102,241,0.03)",
    pillBg: "#071318",
    pillBorder: "rgba(34,211,238,0.28)",
    pillText: "rgba(34,211,238,0.82)",
    nodeBorder: "#2B2D46",
    nodeHover: "#4C51D6",
    nodeShadow: "rgba(99,102,241,0.45)",
    nodeInner: "rgba(99,102,241,0.2)",
    nodeRing: "rgba(99,102,241,0.4)",
    label: "Univ. of Washington",
    desc: "Systems engineering with a quant infrastructure bias. Hardware to cloud.",
    tag: "$TRIAX.UW",
  },
};

// ─── Types ─────────────────────────────────────────────────────────────────────
type HoverState = {
  sx: number;
  sy: number;
  year: number;
  val: number;
  nearNode: TimelineNode | null;
};

// ─── Component ─────────────────────────────────────────────────────────────────
export function EquityCanvas({ market, onBack, onNodeFocus }: EquityCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);

  const [activeNode, setActiveNode] = useState<TimelineNode | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hover, setHover] = useState<HoverState | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const theme = THEME[market];

  const bounds = useMemo(() => (market === "hs" ? hsBounds : uwBounds), [market]);

  // All nodes for this market
  const marketNodes = useMemo(
    () => timelineNodes.filter((n) => n.market === market),
    [market],
  );
  // Positions drive the equity curve path
  const positionNodes = useMemo(
    () => marketNodes.filter((n) => n.nodeType === "position"),
    [marketNodes],
  );
  // Projects render as bonus-share diamonds
  const projectNodes = useMemo(
    () => marketNodes.filter((n) => n.nodeType === "project"),
    [marketNodes],
  );
  const isEmpty = positionNodes.length === 0;

  // Draw progress driven by wheel/touch — no page scroll
  const [drawProgress, setDrawProgress] = useState(prefersReducedMotion ? 1 : 0);
  const accRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const TOTAL_DELTA = 900; // px of wheel delta to draw full curve

  // Lock body scroll while chart is mounted
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Reduced motion: show immediately
  useEffect(() => {
    if (prefersReducedMotion) {
      clipRectRef.current?.setAttribute("width", String(CHART_W));
      setDrawProgress(1);
    }
  }, [prefersReducedMotion]);

  // Reset on market change
  useEffect(() => {
    accRef.current = 0;
    if (!prefersReducedMotion) {
      clipRectRef.current?.setAttribute("width", "0");
      setDrawProgress(0);
    }
  }, [market, prefersReducedMotion]);

  // Wheel handler — drives the draw animation instead of page scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      accRef.current = Math.max(0, Math.min(TOTAL_DELTA, accRef.current + e.deltaY));
      const progress = accRef.current / TOTAL_DELTA;
      // Update clip rect directly for smooth rendering
      clipRectRef.current?.setAttribute("width", String(progress * CHART_W));
      // Update React state via RAF for node visibility
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setDrawProgress(progress);
        rafRef.current = null;
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [TOTAL_DELTA]);

  // Touch support
  const touchStartY = useRef<number | null>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (touchStartY.current === null) return;
      const deltaY = touchStartY.current - e.touches[0].clientY;
      touchStartY.current = e.touches[0].clientY;
      accRef.current = Math.max(0, Math.min(TOTAL_DELTA, accRef.current + deltaY * 2));
      const progress = accRef.current / TOTAL_DELTA;
      clipRectRef.current?.setAttribute("width", String(progress * CHART_W));
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setDrawProgress(progress);
        rafRef.current = null;
      });
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [TOTAL_DELTA]);

  // ─── Derived data ─────────────────────────────────────────────────────────
  const points = useMemo(() => {
    const { minYear, maxYear, minY, maxY } = bounds;
    const rangeX = maxYear - minYear;
    const rangeY = maxY - minY;
    const sorted = [...positionNodes].sort((a, b) => a.year - b.year);

    const normalized = sorted.map((node) => ({
      node,
      xPct: (node.year - minYear) / rangeX,
      yPct: 1 - (node.yValue - minY) / rangeY,
    }));

    const firstNode = sorted[0];
    const lastNode = sorted[sorted.length - 1];
    const startY = firstNode ? firstNode.yValue - 14 : 48;
    const endY = lastNode ? Math.min(maxY, lastNode.yValue + 2) : 94;

    const start = {
      xPct: 0,
      yPct: 1 - (startY - minY) / rangeY,
      node: null as TimelineNode | null,
    };
    const end = {
      xPct: 1,
      yPct: 1 - (endY - minY) / rangeY,
      node: null as TimelineNode | null,
    };

    return [start, ...normalized, end];
  }, [positionNodes, bounds]);

  const pathD = useMemo(
    () => buildSmoothPath(points.map((p) => ({ x: p.xPct, y: p.yPct }))),
    [points],
  );

  const lastPt = useMemo(() => {
    const real = points.filter((p) => p.node !== null);
    const last = real[real.length - 1];
    if (!last) return null;
    return { yPx: PAD_T + last.yPct * CHART_H, value: last.node!.yValue };
  }, [points]);

  const volumeBars = useMemo(() => {
    const barW = Math.max(8, CHART_W / 60);
    return points
      .filter((p) => p.node !== null)
      .map((p) => ({
        id: p.node!.id,
        x: PAD_L + p.xPct * CHART_W - barW / 2,
        h: ((p.node!.yValue - bounds.minY) / (bounds.maxY - bounds.minY)) * VOL_H,
        w: barW * 0.65,
      }));
  }, [points, bounds]);

  // Uncertainty band flanking the equity curve
  const bandPath = useMemo(() => {
    if (points.length < 2 || isEmpty) return "";
    const BAND = 0.026; // fraction of chart height
    const TIGHT = 0.35; // tighter at known nodes
    const upper = points.map((p) => ({
      x: p.xPct,
      y: Math.max(0, p.yPct - (p.node ? BAND * TIGHT : BAND)),
    }));
    const lower = [...points].reverse().map((p) => ({
      x: p.xPct,
      y: Math.min(1, p.yPct + (p.node ? BAND * TIGHT * 0.8 : BAND * 0.75)),
    }));
    const uPath = buildSmoothPath(upper);
    const lPath = buildSmoothPath(lower).replace(/^M/, "L");
    return `${uPath} ${lPath} Z`;
  }, [points, isEmpty]);

  // Pre-compute project flag positions with alternating heights to prevent label collision
  const projectFlagData = useMemo(() => {
    // Alternate offsets so adjacent diamonds never share the same height
    const OFFSETS = [60, 96, 68];
    return projectNodes.map((node, idx) => {
      const xPct = (node.year - bounds.minYear) / (bounds.maxYear - bounds.minYear);
      const yPct = 1 - (node.yValue - bounds.minY) / (bounds.maxY - bounds.minY);
      const xPx  = PAD_L + xPct * CHART_W;
      const yPx  = PAD_T + yPct * CHART_H;
      const offset  = OFFSETS[idx % OFFSETS.length];
      const flagYPx = Math.max(PAD_T + 12, yPx - offset);
      return { node, xPct, xPx, yPx, flagYPx };
    });
  }, [projectNodes, bounds]);

  // Green open / red close candles at start and end of each position
  const candleData = useMemo(() => {
    const out: Array<{ id: string; xPx: number; yPx: number; type: "start" | "end" }> = [];
    for (const node of positionNodes) {
      if (!node.volatilityTag) continue;
      const [startStr, endStr] = node.volatilityTag.split(" — ");
      const yPx = yVal2Px(node.yValue, bounds);
      const startFrac = parseMonYr(startStr ?? "");
      if (startFrac !== null) {
        out.push({ id: `${node.id}-open`, xPx: xYear2Px(startFrac, bounds), yPx, type: "start" });
      }
      if (endStr && endStr.trim() !== "Present") {
        const endFrac = parseMonYr(endStr.trim());
        if (endFrac !== null) {
          out.push({ id: `${node.id}-close`, xPx: xYear2Px(endFrac, bounds), yPx, type: "end" });
        }
      }
    }
    return out;
  }, [positionNodes, bounds]);

  // Candlestick-style wicks at each position node
  const wickData = useMemo(() => {
    return points
      .filter((p) => p.node !== null)
      .map((p) => {
        const xPx = PAD_L + p.xPct * CHART_W;
        const yPx = PAD_T + p.yPct * CHART_H;
        const wickH = CHART_H * 0.042;
        return { id: p.node!.id, x: xPx, yH: yPx - wickH, yL: yPx + wickH * 0.55 };
      });
  }, [points]);

  // Noisy polyline — adds micro-fluctuations for authentic stock-chart feel
  const noisyPathD = useMemo(() => {
    if (points.length < 2 || isEmpty) return pathD;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      pts.push({ x: PAD_L + p0.xPct * CHART_W, y: PAD_T + p0.yPct * CHART_H });
      const steps = 10;
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        const x = p0.xPct + (p1.xPct - p0.xPct) * t;
        const y = p0.yPct + (p1.yPct - p0.yPct) * t;
        const noise = Math.sin(x * 71.3 + y * 43.7 + i * 17.1) * 0.012 * CHART_H;
        pts.push({ x: PAD_L + x * CHART_W, y: PAD_T + y * CHART_H + noise });
      }
    }
    const last = points[points.length - 1];
    pts.push({ x: PAD_L + last.xPct * CHART_W, y: PAD_T + last.yPct * CHART_H });
    return (
      `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} ` +
      pts.slice(1).map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
    );
  }, [points, isEmpty, pathD]);

  const yTicks = useMemo(() => {
    const { minY, maxY } = bounds;
    const step = Math.round((maxY - minY) / 6);
    return Array.from({ length: 6 }, (_, i) => Math.round(minY + step * (i + 1)));
  }, [bounds]);

  const xLabels = useMemo(() => {
    const { minYear, maxYear } = bounds;
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const rangeYears = maxYear - minYear;
    // Denser months for shorter ranges (UW = 2yr), sparser for longer (HS = 5yr)
    const step = rangeYears <= 2.5 ? 1 : rangeYears <= 4 ? 2 : 3;
    const items: { key: string; frac: number; label: string; isJan: boolean; year: number }[] = [];
    for (let y = Math.floor(minYear); y <= Math.ceil(maxYear); y++) {
      for (let m = 0; m < 12; m += step) {
        const frac = y + m / 12;
        if (frac < minYear - 0.01 || frac > maxYear + 0.01) continue;
        items.push({ key: `${y}-${m}`, frac, label: MONTHS[m], isJan: m === 0, year: y });
      }
    }
    return items;
  }, [bounds]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleNodeSelect = useCallback(
    (node: TimelineNode) => {
      setActiveNode(node);
      setSheetOpen(true);
      onNodeFocus?.(node);
    },
    [onNodeFocus],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const { sx, sy, year, val } = svgCoords(svg, e.clientX, e.clientY, bounds);

      if (sx < PAD_L || sx > PAD_L + CHART_W || sy < PAD_T || sy > PAD_T + CHART_H) {
        setHover(null);
        return;
      }

      let nearNode: TimelineNode | null = null;
      let minDist = Infinity;
      for (const p of points) {
        if (!p.node) continue;
        const px = PAD_L + p.xPct * CHART_W;
        const py = PAD_T + p.yPct * CHART_H;
        const d = Math.hypot(sx - px, sy - py);
        if (d < minDist) { minDist = d; nearNode = p.node; }
      }
      if (minDist > 70) nearNode = null;

      setHover({ sx, sy, year, val, nearNode });
    },
    [points, bounds],
  );

  const handleMouseLeave = useCallback(() => setHover(null), []);

  // Unique gradient IDs per market to avoid SVG caching conflicts
  const lineGradId = `lineGrad-${market}`;
  const fillGradId = `fillGrad-${market}`;
  const volGradId  = `volGrad-${market}`;
  const bandGradId = `bandGrad-${market}`;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex flex-col"
      aria-labelledby="chart-title"
    >
      {/* Persistent top bar — always visible */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-none z-50 flex items-center gap-3 border-b px-5 h-11 bg-[#07070D]/98 backdrop-blur-md"
        style={{ borderColor: "#0F1020" }}
      >
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] hover:opacity-75 transition-opacity"
          style={{ color: theme.lineStart }}
        >
          <ArrowLeft size={11} />
          Markets
        </button>
        <div className="h-4 w-px bg-[#1A1A2E]" />
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[11px] font-medium" style={{ color: theme.lineStart }}>
            {theme.tag}
          </span>
          <span className="font-mono text-[10px] text-[#4B5563]">{theme.label}</span>
        </div>
        <div className="flex-1" />
        {lastPt && (
          <>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#4B5563]">NAV</span>
            <span className="font-mono text-[12px] font-semibold" style={{ color: theme.lineStart }}>
              {lastPt.value}
            </span>
            <div className="h-4 w-px bg-[#1A1A2E]" />
          </>
        )}
        <div className="flex items-center gap-1.5">
          <motion.div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: theme.lineStart }}
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="font-mono text-[9px] uppercase tracking-widest"
            style={{ color: theme.lineStart, opacity: 0.65 }}
          >
            Live
          </span>
        </div>
      </motion.div>

      {/* Chart area — fills remaining height */}
      <div className="relative flex-1 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F] via-[#0B0B13] to-[#05050A]" />
        <div className="absolute inset-0 opacity-[0.35]">
          <Gridlines />
        </div>

        {/* Accessible title (visually hidden — info lives in top bar) */}
        <h1 id="chart-title" className="sr-only">{theme.label} · Career equity curve</h1>

        {/* Chart layer */}
        <div className="absolute inset-0 z-10">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-full w-full min-h-0"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={`${theme.label} career equity curve`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: hover ? "crosshair" : "default" }}
          >
            <defs>
              <linearGradient id={lineGradId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={theme.lineStart} stopOpacity="0.95" />
                <stop offset="50%" stopColor={theme.lineMid} stopOpacity="0.9" />
                <stop offset="100%" stopColor={theme.lineEnd} stopOpacity="0.85" />
              </linearGradient>

              <linearGradient id={fillGradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.fillTop} />
                <stop offset="65%" stopColor="rgba(17,17,24,0.04)" />
                <stop offset="100%" stopColor={theme.fillBot} />
              </linearGradient>

              <linearGradient id={volGradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.volTop} />
                <stop offset="100%" stopColor={theme.volBot} />
              </linearGradient>

              <linearGradient id={bandGradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.lineStart} stopOpacity="0.10" />
                <stop offset="100%" stopColor={theme.lineStart} stopOpacity="0.02" />
              </linearGradient>

              <filter id="pillGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <clipPath id="revealClip">
                <rect ref={clipRectRef} x={PAD_L} y={0} height={HEIGHT} width={0} />
              </clipPath>
            </defs>

            {/* Background grid lines */}
            <g stroke="rgba(26,26,46,0.85)" strokeWidth="1">
              {[0.2, 0.4, 0.6, 0.8].map((t) => (
                <line
                  key={t}
                  x1={PAD_L} x2={PAD_L + CHART_W}
                  y1={PAD_T + t * CHART_H} y2={PAD_T + t * CHART_H}
                  strokeDasharray="2 6"
                />
              ))}
              {[0.25, 0.5, 0.75].map((t) => (
                <line
                  key={t}
                  x1={PAD_L + t * CHART_W} x2={PAD_L + t * CHART_W}
                  y1={PAD_T} y2={PAD_T + CHART_H}
                  strokeDasharray="2 10"
                />
              ))}
            </g>

            {/* Volume bars */}
            <g clipPath="url(#revealClip)" aria-hidden>
              {volumeBars.map((b) => (
                <rect
                  key={b.id}
                  x={b.x}
                  y={PAD_T + CHART_H - b.h}
                  width={b.w}
                  height={b.h}
                  fill={`url(#${volGradId})`}
                  rx={1.5}
                />
              ))}
            </g>

            {/* Uncertainty band */}
            <path
              d={bandPath}
              fill={`url(#${bandGradId})`}
              clipPath="url(#revealClip)"
            />

            {/* Area fill */}
            <path
              d={`${pathD} L ${PAD_L + CHART_W} ${PAD_T + CHART_H} L ${PAD_L} ${PAD_T + CHART_H} Z`}
              fill={`url(#${fillGradId})`}
              clipPath="url(#revealClip)"
            />

            {/* Noisy stock line */}
            <path
              d={noisyPathD}
              fill="none"
              stroke={`url(#${lineGradId})`}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              clipPath="url(#revealClip)"
            />

            {/* Candlestick wicks at position nodes */}
            <g clipPath="url(#revealClip)" aria-hidden>
              {wickData.map((w) => (
                <line
                  key={w.id}
                  x1={w.x} y1={w.yH}
                  x2={w.x} y2={w.yL}
                  stroke={theme.lineStart}
                  strokeWidth="1.5"
                  opacity="0.32"
                />
              ))}
            </g>

            {/* Career candles — green at role start, red at role end */}
            <g clipPath="url(#revealClip)" aria-hidden>
              {candleData.map((c) => {
                const isOpen = c.type === "start";
                const fill  = isOpen ? "#22C55E" : "#EF4444";
                const wire  = isOpen ? "#16A34A" : "#B91C1C";
                const BODY = 18;
                const WICK = 11;
                return (
                  <g key={c.id}>
                    <line
                      x1={c.xPx} y1={c.yPx - BODY / 2 - WICK}
                      x2={c.xPx} y2={c.yPx + BODY / 2 + WICK}
                      stroke={wire} strokeWidth="1" opacity="0.5"
                    />
                    <rect
                      x={c.xPx - 4} y={c.yPx - BODY / 2}
                      width={8} height={BODY}
                      fill={fill} fillOpacity="0.7"
                      stroke={wire} strokeWidth="0.75"
                      rx={1.5}
                    />
                  </g>
                );
              })}
            </g>

            {/* Project flag stems — dotted line from diamond down to curve y */}
            <g aria-hidden>
              {projectFlagData.map(({ node, xPct, xPx, yPx, flagYPx }) => {
                const visible = drawProgress >= xPct - 0.06 || !!prefersReducedMotion;
                if (!visible) return null;
                return (
                  <line
                    key={node.id}
                    x1={xPx} y1={flagYPx + 12}
                    x2={xPx} y2={yPx - 5}
                    stroke="#D97706"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    opacity="0.4"
                    clipPath="url(#revealClip)"
                  />
                );
              })}
            </g>

            {/* Last price dashed line + pill */}
            {lastPt && (
              <g aria-hidden>
                <line
                  x1={PAD_L} x2={PAD_L + CHART_W}
                  y1={lastPt.yPx} y2={lastPt.yPx}
                  stroke={theme.pillBorder}
                  strokeWidth="1"
                  strokeDasharray="3 7"
                />
                <rect
                  x={PAD_L + CHART_W + 5}
                  y={lastPt.yPx - 10}
                  width={42}
                  height={20}
                  rx={5}
                  fill={theme.pillBg}
                  stroke={theme.pillBorder}
                  strokeWidth="0.75"
                  filter="url(#pillGlow)"
                />
                <text
                  x={PAD_L + CHART_W + 26}
                  y={lastPt.yPx}
                  dy="0.34em"
                  fontSize="9.5"
                  fontFamily="var(--font-mono, monospace)"
                  fill={theme.pillText}
                  textAnchor="middle"
                >
                  {lastPt.value}
                </text>
              </g>
            )}

            {/* Y-axis ticks */}
            <g aria-hidden>
              {yTicks.map((val) => {
                const yPx = yVal2Px(val, bounds);
                return (
                  <g key={val}>
                    <line
                      x1={PAD_L + CHART_W} x2={PAD_L + CHART_W + 4}
                      y1={yPx} y2={yPx}
                      stroke="rgba(240,242,255,0.22)"
                      strokeWidth="1"
                    />
                    <text
                      x={PAD_L + CHART_W + 9}
                      y={yPx}
                      dy="0.34em"
                      fontSize="9.5"
                      fontFamily="var(--font-mono, monospace)"
                      fill="rgba(240,242,255,0.5)"
                      textAnchor="start"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* X-axis month + year labels */}
            <g aria-hidden>
              {xLabels.map((item) => {
                const xPx = xYear2Px(item.frac, bounds);
                return (
                  <g key={item.key}>
                    <line
                      x1={xPx} x2={xPx}
                      y1={PAD_T + CHART_H}
                      y2={PAD_T + CHART_H + (item.isJan ? 7 : 4)}
                      stroke={item.isJan ? "rgba(240,242,255,0.55)" : "rgba(240,242,255,0.18)"}
                      strokeWidth="1"
                    />
                    {/* Month label */}
                    <text
                      x={xPx}
                      y={PAD_T + CHART_H + 16}
                      fontSize="9"
                      fontFamily="var(--font-mono, monospace)"
                      fill={item.isJan ? "rgba(240,242,255,0.85)" : "rgba(240,242,255,0.45)"}
                      textAnchor="middle"
                    >
                      {item.label}
                    </text>
                    {/* Year label — only on January ticks */}
                    {item.isJan && (
                      <text
                        x={xPx}
                        y={PAD_T + CHART_H + 28}
                        fontSize="8.5"
                        fontFamily="var(--font-mono, monospace)"
                        fill="rgba(240,242,255,0.55)"
                        textAnchor="middle"
                      >
                        {item.year}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Crosshair */}
            {hover && !prefersReducedMotion && (
              <g aria-hidden style={{ pointerEvents: "none" }}>
                <line
                  x1={hover.sx} x2={hover.sx}
                  y1={PAD_T} y2={PAD_T + CHART_H}
                  stroke="rgba(148,163,184,0.2)"
                  strokeWidth="1"
                  strokeDasharray="2 5"
                />
                <line
                  x1={PAD_L} x2={PAD_L + CHART_W}
                  y1={hover.sy} y2={hover.sy}
                  stroke="rgba(148,163,184,0.13)"
                  strokeWidth="1"
                  strokeDasharray="2 5"
                />
                <circle cx={hover.sx} cy={hover.sy} r={2.5} fill="rgba(148,163,184,0.3)" />
              </g>
            )}
          </svg>

          {/* Tooltip */}
          <AnimatePresence>
            {hover && (
              <ChartTooltip key="tooltip" hover={hover} theme={theme} />
            )}
          </AnimatePresence>

          {/* Node handles */}
          {points
            .map((p, idx) => ({ ...p, idx }))
            .filter((p) => p.node)
            .map((p) => {
              const revealAt = (p.idx + 1) / points.length;
              const visible = drawProgress >= revealAt - 0.04 || !!prefersReducedMotion;
              const xPx = PAD_L + p.xPct * CHART_W;
              const yPx = PAD_T + p.yPct * CHART_H;
              const left = `${(xPx / WIDTH) * 100}%`;
              const top = `${(yPx / HEIGHT) * 100}%`;
              const node = p.node!;
              return (
                <motion.div
                  key={node.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: visible ? 1 : 0.8, opacity: visible ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ left, top }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <button
                    type="button"
                    onClick={() => handleNodeSelect(node)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNodeSelect(node);
                      }
                    }}
                    className="relative h-8 w-8 rounded-full border bg-[#0F111A]/80 backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05050A] transition-all duration-200"
                    style={{ borderColor: theme.nodeBorder }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = theme.nodeHover;
                      e.currentTarget.style.boxShadow = `0 0 12px ${theme.nodeShadow}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = theme.nodeBorder;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    aria-label={`Open ${node.label}`}
                  >
                    <span
                      className="absolute inset-0 rounded-full blur-[10px]"
                      style={{ background: theme.nodeInner }}
                      aria-hidden
                    />
                    <span
                      className="absolute inset-1 rounded-full border"
                      style={{ borderColor: theme.nodeRing }}
                      aria-hidden
                    />
                  </button>
                  <div className="mt-2 text-center" style={{ minWidth: 0 }}>
                    <p className="text-[10px] font-semibold text-[#E5E8F0] whitespace-nowrap max-w-[120px] truncate leading-tight">
                      {node.label}
                    </p>
                    <p className="text-[8px] font-mono uppercase tracking-[0.12em] text-[#4B5563] mt-0.5">
                      {node.volatilityTag?.split(" — ")[0]}
                    </p>
                  </div>
                </motion.div>
              );
            })}

          {/* Bonus-share diamond nodes — staggered heights above the curve */}
          {projectFlagData.map(({ node, xPct, xPx, flagYPx }) => {
            const left = `${(xPx / WIDTH) * 100}%`;
            const top  = `${(flagYPx / HEIGHT) * 100}%`;
            const visible = drawProgress >= xPct - 0.06 || !!prefersReducedMotion;
            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: visible ? 1 : 0.5, opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ left, top }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              >
                {/* Label above the diamond */}
                <div className="mb-1 text-center pointer-events-none" style={{ minWidth: 0 }}>
                  <p className="text-[9px] font-mono uppercase tracking-[0.13em] leading-none mb-0.5" style={{ color: "#D97706" }}>
                    ◆ project
                  </p>
                  <p className="text-[10px] font-semibold text-[#D4A845] leading-tight whitespace-nowrap max-w-[110px] truncate">
                    {node.label}
                  </p>
                </div>
                {/* Diamond button */}
                <button
                  type="button"
                  onClick={() => handleNodeSelect(node)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleNodeSelect(node);
                    }
                  }}
                  className="relative h-4 w-4 border bg-[#1A0F00]/90 backdrop-blur focus-visible:outline-none transition-all duration-200"
                  style={{ borderColor: "#92400E", transform: "rotate(45deg)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#F59E0B";
                    e.currentTarget.style.boxShadow = "0 0 10px rgba(245,158,11,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#92400E";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  aria-label={`Open ${node.label}`}
                />
              </motion.div>
            );
          })}

          {/* Empty market overlay */}
          {isEmpty && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="rounded-lg border px-8 py-6 text-center backdrop-blur-sm"
                style={{ borderColor: theme.pillBorder, background: `${theme.pillBg}cc` }}
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3"
                  style={{ color: theme.lineStart, opacity: 0.5 }}
                >
                  {theme.tag}
                </p>
                <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-[#E5E8F0]">
                  MARKET DATA PENDING
                </p>
                <p className="mt-2 font-mono text-[10px] tracking-[0.14em] text-[#4B5563]">
                  Historical data being compiled
                </p>
                <div className="mt-4 flex items-center justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-1 w-1 rounded-full"
                      style={{ background: theme.lineStart }}
                      animate={{ opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Scroll hint — fades out once drawing starts */}
          <AnimatePresence>
            {drawProgress < 0.04 && !prefersReducedMotion && (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
              >
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: theme.lineStart, opacity: 0.5 }}
                >
                  scroll to draw
                </span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="h-5 w-px"
                  style={{ background: `linear-gradient(to bottom, ${theme.lineStart}80, transparent)` }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <NodeSheet node={activeNode} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}

// ─── Tooltip ───────────────────────────────────────────────────────────────────
function ChartTooltip({
  hover,
  theme,
}: {
  hover: HoverState;
  theme: (typeof THEME)["hs"];
}) {
  const leftPct = (hover.sx / WIDTH) * 100;
  const topPct = (hover.sy / HEIGHT) * 100;
  const flipX = leftPct > 68;
  const flipY = topPct > 62;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: `translate(${flipX ? "calc(-100% - 14px)" : "14px"}, ${flipY ? "calc(-100% - 10px)" : "10px"})`,
        pointerEvents: "none",
        zIndex: 30,
      }}
      className="rounded-md border border-[#1A1C2E] bg-[#0C0E1A]/96 px-3 py-2 backdrop-blur-sm shadow-xl"
    >
      <div className="flex items-center gap-2 mb-0.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#4B5563]">
          {hover.year.toFixed(2)}
        </span>
        <span className="h-px w-2.5 bg-[#232540]" />
        <span className="font-mono text-[11px] font-medium text-[#E2E8F0]">
          {hover.val.toFixed(1)}
        </span>
      </div>
      {hover.nearNode && (
        <p
          className="font-mono text-[10px] truncate max-w-[170px] leading-tight"
          style={{ color: theme.lineStart }}
        >
          {hover.nearNode.label}
        </p>
      )}
    </motion.div>
  );
}

// ─── Background grid ───────────────────────────────────────────────────────────
function Gridlines() {
  return (
    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(99,102,241,0.05)" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid)" />
      <rect width="100" height="100" fill="url(#grid)" transform="scale(0.5)" opacity="0.18" />
    </svg>
  );
}

// ─── Month/year string → decimal year ─────────────────────────────────────────
function parseMonYr(s: string): number | null {
  const M: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4,  Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const parts = s.trim().split(" ");
  if (parts.length !== 2) return null;
  const [mon, yr] = parts;
  if (M[mon] === undefined || isNaN(+yr)) return null;
  return +yr + M[mon] / 12;
}

// ─── Path builder ──────────────────────────────────────────────────────────────
type Point = { x: number; y: number };

function buildSmoothPath(pts: Point[]): string {
  if (!pts.length) return "";
  const scaled = pts.map((p) => ({
    x: PAD_L + p.x * CHART_W,
    y: PAD_T + p.y * CHART_H,
  }));

  const d = [`M ${scaled[0].x} ${scaled[0].y}`];
  for (let i = 0; i < scaled.length - 1; i++) {
    const p0 = scaled[i === 0 ? i : i - 1];
    const p1 = scaled[i];
    const p2 = scaled[i + 1];
    const p3 = scaled[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }

  return d.join(" ");
}
