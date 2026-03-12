"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { MarketSelect } from "@/components/MarketSelect";
import { MarketViewChart } from "@/components/MarketViewChart";
import type { Market } from "@/components/EquityCanvas";

function usePortraitMobile() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      const portrait = window.innerHeight > window.innerWidth;
      setShow(mobile && portrait);
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);
  return show;
}

function LandscapeWarning() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050508]/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 px-8 text-center">
        <svg
          width="48" height="48" viewBox="0 0 48 48" fill="none"
          className="animate-[spin_2s_ease-in-out_infinite]"
          style={{ animationDirection: "alternate" }}
        >
          <rect x="4" y="14" width="40" height="26" rx="3" stroke="#00d4ff" strokeWidth="2" />
          <circle cx="8" cy="27" r="2" fill="#00d4ff" />
        </svg>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00d4ff] mb-2">
            Rotate Device
          </p>
          <p className="text-[#9CA3AF] text-sm leading-relaxed">
            The terminal is best viewed in landscape mode.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MarketViewPage() {
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const showRotate = usePortraitMobile();

  // When a market is selected, show the Bloomberg terminal full-screen
  // (it manages its own top bars and layout)
  if (selectedMarket) {
    if (showRotate) return <LandscapeWarning />;
    return <MarketViewChart onBack={() => setSelectedMarket(null)} />;
  }

  return (
    <div
      className="min-h-screen bg-[#050508] text-white"
      style={{ fontFamily: "var(--font-mono), monospace" }}
    >
      {/* Terminal top bar — shown only on the MarketSelect screen */}
      <div
        className="flex items-center justify-between px-6 h-14 border-b"
        style={{ borderColor: "#00d4ff15", background: "#070710" }}
      >
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="flex items-center gap-2 font-mono text-xs transition-colors duration-200"
            style={{ color: "#00d4ff70" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#00d4ff")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#00d4ff70")
            }
          >
            <ArrowLeft size={13} />
            Back to Portfolio
          </a>
          <div className="w-px h-4 bg-[#1A1A2E]" />
          <span className="font-mono text-xs text-[#3D3D5C] uppercase tracking-widest">
            TS · MARKET VIEW TERMINAL
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
              style={{ background: "#00ff88" }}
            />
            <span
              className="relative inline-flex rounded-full h-1.5 w-1.5"
              style={{ background: "#00ff88" }}
            />
          </span>
          <span
            className="font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "#00ff8860" }}
          >
            Live
          </span>
        </div>
      </div>

      <div className="flex-1">
        <MarketSelect onSelect={(m) => setSelectedMarket(m)} />
      </div>
    </div>
  );
}
