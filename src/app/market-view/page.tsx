"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { MarketSelect } from "@/components/MarketSelect";
import { MarketViewChart } from "@/components/MarketViewChart";
import type { Market } from "@/components/EquityCanvas";

export default function MarketViewPage() {
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  // When a market is selected, show the Bloomberg terminal full-screen
  // (it manages its own top bars and layout)
  if (selectedMarket) {
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
