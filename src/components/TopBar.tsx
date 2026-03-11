"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LayoutGrid, LineChart, Github, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "chart" | "standard";

export function TopBar({ mode, onModeChange }: { mode: Mode; onModeChange: (mode: Mode) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 backdrop-blur-sm transition-colors",
        scrolled ? "bg-[#07070D]/80 border-b border-[#141428]" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          className="font-mono text-xs uppercase tracking-[0.22em] text-[#A5B4FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
        >
          TRIAX PORTFOLIO
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex rounded-full border border-[#1A1A2E] bg-[#0D0F18] p-0.5">
            <ModeChip
              icon={<LineChart size={14} />}
              label="Chart"
              active={mode === "chart"}
              onClick={() => onModeChange("chart")}
            />
            <ModeChip
              icon={<LayoutGrid size={14} />}
              label="Standard"
              active={mode === "standard"}
              onClick={() => onModeChange("standard")}
            />
          </div>

          <a
            href="https://github.com/triakshasingh"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#1A1A2E] text-[#9CA3AF] hover:text-white"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>

          <Button asChild size="sm" variant="outline" className="gap-2">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <FileText size={14} />
              Resume
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function ModeChip({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]",
        active ? "bg-[#1B1E2E] text-white border border-[#313758]" : "text-[#8C92A7]",
      )}
      aria-pressed={active}
    >
      {icon}
      {label}
    </button>
  );
}
