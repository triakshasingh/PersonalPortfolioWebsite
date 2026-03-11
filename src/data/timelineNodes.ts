/**
 * Single source of truth for the career equity curve.
 * Two markets: "hs" (High School, 2020–Aug 2024) and "uw" (UW, Sep 2024–present).
 *
 * nodeType:
 *   "position" — main experience/role; drives the equity curve path
 *   "project"  — bonus share; rendered as a diamond overlay above the line
 */

export type TimelineMetric = {
  label: string;
  value: string;
  detail?: string;
};

export type TimelineLinks = {
  github?: string;
  demo?: string;
  writeup?: string;
};

export type CurveBounds = {
  minYear: number;
  maxYear: number;
  minY: number;
  maxY: number;
};

export type TimelineNode = {
  id: string;
  year: number;
  label: string;
  summary: string;
  yValue: number;
  market: "hs" | "uw";
  /** "position" drives the main equity curve; "project" renders as a bonus-share diamond */
  nodeType: "position" | "project";
  problem: string;
  architecture: string[];
  highlights: string[];
  metrics: TimelineMetric[];
  tech: string[];
  links: TimelineLinks;
  /** Displayed as the date range / tag under the node */
  volatilityTag?: string;
};

// ─── HIGH SCHOOL ERA — empty for now ─────────────────────────────────────────
// Nodes will be added in a future update.
export const hsNodes: TimelineNode[] = [];

// ─── UNIVERSITY OF WASHINGTON ─────────────────────────────────────────────────

// ── Positions (main equity curve) ────────────────────────────────────────────
const uwPositions: TimelineNode[] = [
  {
    id: "husky-robotics",
    year: 2024.75, // Oct 2024
    label: "Husky Robotics",
    summary: "Systems engineer on UW's competitive robotics team — embedded control, ROS2 pipelines, and HIL validation.",
    yValue: 68,
    market: "uw",
    nodeType: "position",
    volatilityTag: "Oct 2024 — May 2025",
    problem:
      "Build reliable, low-latency embedded control for a competition rover under strict weight and power budgets — then verify it actually works with hardware-in-the-loop before match day.",
    architecture: [
      "Async ROS2 pub/sub for the critical control loop; blocking service calls moved to telemetry side-channel.",
      "Timing instrumentation across transmitter → flight controller → actuator to locate real bottlenecks.",
      "Betaflight PWM pipeline tuned to ±5µs jitter budget.",
      "Hardware-in-loop validation using oscilloscope traces against commanded step references.",
    ],
    highlights: [
      "Achieved −30% end-to-end control latency without sacrificing determinism.",
      "DMA buffer delay root-caused and fixed via SPI clock + flush tuning.",
      "Latency budget tracked per hop; visualized in rqt_graph for the full team.",
    ],
    metrics: [
      { label: "Latency reduction", value: "−30%" },
      { label: "Architecture", value: "Async ROS2" },
      { label: "Validation", value: "HiL oscilloscope" },
      { label: "Team", value: "Husky Robotics UW" },
    ],
    tech: ["C++", "Python", "ROS2", "Linux", "Betaflight", "CMake"],
    links: { github: "https://github.com/triakshasingh" },
  },
  {
    id: "inntech-intern",
    year: 2025.42, // Jun 2025
    label: "AI/ML Intern · Inntech",
    summary: "Built and shipped production ML inference pipelines — feature engineering, model versioning, and typed FastAPI endpoints.",
    yValue: 80,
    market: "uw",
    nodeType: "position",
    volatilityTag: "Jun 2025 — Sep 2025",
    problem:
      "Ship ML models from notebook to production with a sane contract: validated inputs, reproducible versioning, async-where-it-matters, and SLO-ready health probes.",
    architecture: [
      "Scikit-learn pipelines with automated feature engineering steps and train/val splits.",
      "FastAPI endpoints with Pydantic schemas and structured error responses.",
      "Semantic versioning for model artifacts; deterministic re-run from any checkpoint.",
      "Health + latency probes instrumented for service-level objective tracking.",
    ],
    highlights: [
      "Reduced manual pipeline overhead ~40% by automating feature-engineering steps.",
      "Kept compute endpoints synchronous to avoid context-switch overhead; async only on IO paths.",
      "Clean separation between training and inference modules — no shared mutable state.",
    ],
    metrics: [
      { label: "Pipeline overhead", value: "−40%" },
      { label: "API framework", value: "FastAPI" },
      { label: "Validation", value: "Pydantic v2" },
      { label: "Duration", value: "Jun–Sep 2025" },
    ],
    tech: ["Python", "FastAPI", "Pydantic", "scikit-learn", "pandas", "NumPy", "Docker"],
    links: { github: "https://github.com/triakshasingh" },
  },
  {
    id: "albitron-research",
    year: 2026.08, // Feb 2026
    label: "Research Intern · Albitron Lab",
    summary: "Distributed lab-automation system — firmware-to-cloud telemetry, concurrent state management, and reproducible experiment workflows.",
    yValue: 92,
    market: "uw",
    nodeType: "position",
    volatilityTag: "Feb 2026 — Present",
    problem:
      "Make multi-stage lab automation resilient: shared telemetry, concurrent user access, and debuggability across firmware, Linux services, and the web front-end.",
    architecture: [
      "Full chain: ESP32 ↔ Raspberry Pi ↔ Node.js ↔ MongoDB ↔ Socket.IO ↔ browser UI.",
      "Workflow state machine with idempotent steps — safe under packet drop and retransmit.",
      "Optimistic locking on MongoDB under concurrent Socket.IO sessions.",
      "Unified debug surface: firmware logs, Linux service traces, API events, UI telemetry.",
    ],
    highlights: [
      "State snapshots enable full replay of lab runs without physical devices attached.",
      "Firmware heartbeat + watchdog catches stuck actuators before they stall experiments.",
      "Reliability treated as a first-class product requirement from day one.",
    ],
    metrics: [
      { label: "Stack depth", value: "5 layers", detail: "firmware → cloud" },
      { label: "Concurrent users", value: "Multi-user" },
      { label: "Reliability", value: "Idempotent state" },
      { label: "Status", value: "Active" },
    ],
    tech: ["ESP32", "C++", "Node.js", "MongoDB", "Socket.IO", "Linux", "Python"],
    links: { github: "https://github.com/triakshasingh" },
  },
];

// ── Projects / Bonus Shares ───────────────────────────────────────────────────
const uwProjects: TimelineNode[] = [
  {
    id: "diabetes-ml",
    year: 2025.92, // Dec 2025
    label: "Diabetes ML Predictor",
    summary: "End-to-end classification pipeline — feature engineering, stratified k-fold, and a typed FastAPI inference endpoint.",
    yValue: 83,
    market: "uw",
    nodeType: "project",
    volatilityTag: "Dec 2025",
    problem:
      "Build a production-ready diabetes risk classifier with validated inputs, reproducible training, and a clean REST interface.",
    architecture: [
      "Scikit-learn pipeline: imputation → scaling → feature selection → gradient boosting.",
      "Stratified k-fold cross-validation to guard against class imbalance.",
      "FastAPI inference endpoint with Pydantic request/response schemas.",
      "Health probe + version header for deployment observability.",
    ],
    highlights: [
      "EDA → feature pipeline → model → API in a single reproducible flow.",
      "Precision/recall threshold tuned for clinical false-negative cost.",
      "Model artifact versioned for deterministic re-run from any checkpoint.",
    ],
    metrics: [
      { label: "Framework", value: "scikit-learn" },
      { label: "API", value: "FastAPI + Pydantic" },
      { label: "Validation", value: "Stratified k-fold" },
    ],
    tech: ["Python", "scikit-learn", "FastAPI", "Pydantic", "pandas", "NumPy"],
    links: { github: "https://github.com/triakshasingh" },
  },
  {
    id: "vol-estimator",
    year: 2026.04, // Jan 2026
    label: "Volatility Estimator",
    summary: "EWMA + rolling realized variance with regime detection and vectorized NumPy hot paths.",
    yValue: 88,
    market: "uw",
    nodeType: "project",
    volatilityTag: "Jan 2026",
    problem:
      "Quantify risk across non-stationary regimes without blowing up on jump shocks or near-zero variance slices.",
    architecture: [
      "Composable estimator interface: EWMA, rolling variance, realized variance plug-ins.",
      "Synthetic regime generator (trend, mean-revert, jump) for cross-validated λ / lookback search.",
      "Vectorized NumPy kernels; zero Python loops on the pricing hot path.",
      "Benchmark harness reporting percentile stability across regime boundaries.",
    ],
    highlights: [
      "Grid-searched λ for reactivity vs. noise under regime transitions.",
      "Underflow clamped to prevent divide-by-tiny spikes.",
      "A/B-swappable estimator interface — callers never change.",
    ],
    metrics: [
      { label: "Estimators", value: "EWMA · Rolling · RV" },
      { label: "Compute", value: "Vectorized NumPy" },
    ],
    tech: ["Python", "NumPy", "pandas", "SciPy", "statsmodels", "Matplotlib"],
    links: {
      github: "https://github.com/triakshasingh/vol-estimator",
      writeup: "https://github.com/triakshasingh/vol-estimator#readme",
    },
  },
  {
    id: "limit-order-book",
    year: 2026.17, // Feb 2026
    label: "Limit Order Book",
    summary: "L2 order book simulator — price-time priority matching, VWAP analytics, and order flow imbalance signals.",
    yValue: 91,
    market: "uw",
    nodeType: "project",
    volatilityTag: "Feb 2026",
    problem:
      "Model microstructure dynamics: match orders at nanosecond precision, reconstruct the book from raw tick data, and surface actionable imbalance signals.",
    architecture: [
      "Sorted-dict price levels with O(log n) insert/cancel/match.",
      "Price-time priority FIFO queue within each level.",
      "Mid-price, VWAP, and order flow imbalance computed incrementally.",
      "Event log with full replay capability for backtesting.",
    ],
    highlights: [
      "Order flow imbalance signal predictive of short-term mid-price direction.",
      "Replay mode reconstructs any historical L2 snapshot from event log.",
      "Pure Python core with NumPy hot paths for analytics.",
    ],
    metrics: [
      { label: "Matching", value: "Price-time priority" },
      { label: "Signals", value: "OFI · VWAP · Mid" },
      { label: "Complexity", value: "O(log n) insert" },
    ],
    tech: ["Python", "NumPy", "pandas", "sortedcontainers"],
    links: { github: "https://github.com/triakshasingh" },
  },
];

// ─── Combined exports ─────────────────────────────────────────────────────────
export const timelineNodes: TimelineNode[] = [
  ...hsNodes,
  ...uwPositions,
  ...uwProjects,
];

// ─── Market-specific curve bounds ─────────────────────────────────────────────
export const hsBounds: CurveBounds = {
  minYear: 2020.0,
  maxYear: 2024.6,
  minY: 40,
  maxY: 98,
};

export const uwBounds: CurveBounds = {
  minYear: 2024.5,
  maxYear: 2026.5,
  minY: 55,
  maxY: 98,
};

export const curveBounds: CurveBounds = {
  minYear: Math.min(hsBounds.minYear, uwBounds.minYear),
  maxYear: Math.max(hsBounds.maxYear, uwBounds.maxYear),
  minY: 40,
  maxY: 98,
};

export const timelineYears = [...new Set(timelineNodes.map((n) => Math.floor(n.year)))].sort(
  (a, b) => a - b,
);
