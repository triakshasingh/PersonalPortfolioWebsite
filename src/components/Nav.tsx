"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

const CONTACT_ROWS = [
  { label: "EMAIL",    value: "triakshasingh@gmail.com",  href: "mailto:triakshasingh@gmail.com",         copyable: true  },
  { label: "SCHOOL",  value: "tsingh05@uw.edu",           href: "mailto:tsingh05@uw.edu",                 copyable: true  },
  { label: "PHONE",   value: "+1 (206) 605-6394",          href: "tel:+12066056394",                       copyable: false },
  { label: "LINKEDIN",value: "in/triakshasingh",          href: "https://linkedin.com/in/triakshasingh/", copyable: false },
  { label: "GITHUB",  value: "github.com/triakshasingh",  href: "https://github.com/triakshasingh",       copyable: false },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const isMarket = pathname === "/market-view";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close card when clicking outside
  useEffect(() => {
    if (!showContact) return;
    const handler = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setShowContact(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showContact]);

  function copy(value: string, label: string) {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1800);
  }

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 h-16 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0F]/90 backdrop-blur-md border-b border-[#1A1A2E]"
          : "bg-transparent"
      }`}
    >
      {/* Logo — hidden on Market View */}
      <a href="/" className="font-mono text-sm font-bold text-white tracking-wide" style={{ visibility: isMarket ? "hidden" : "visible", pointerEvents: isMarket ? "none" : "auto" }}>
        ts<span className="text-[#6366F1]">.</span>dev
      </a>

      {/* Mode toggle */}
      <div
        className="relative flex items-center rounded-xl p-1 gap-0.5"
        style={{
          fontFamily: "var(--font-mono), monospace",
          background: "#0D0D1A",
          border: `1px solid ${isMarket ? "#00ff8840" : "#6366F140"}`,
          boxShadow: isMarket ? "0 0 18px #00ff8818" : "0 0 18px #6366F118",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Sliding pill */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-lg"
          style={{ background: isMarket ? "#00ff8820" : "#6366F120" }}
          animate={{ left: isMarket ? "calc(50% + 2px)" : "4px", right: isMarket ? "4px" : "calc(50% + 2px)" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />

        {/* Standard */}
        <button
          onClick={() => router.push("/")}
          className="relative z-10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] rounded-lg transition-colors duration-200"
          style={{ color: isMarket ? "#6B7280" : "#E2E8F0" }}
        >
          Standard
        </button>

        {/* Market View */}
        <button
          onClick={() => router.push("/market-view")}
          className="relative z-10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] rounded-lg transition-colors duration-200"
          style={{ color: isMarket ? "#00ff88" : "#6B7280" }}
        >
          Market View
        </button>
      </div>

      {/* Contact button + dropdown — hidden on Market View */}
      <div className="relative" ref={cardRef} style={{ visibility: isMarket ? "hidden" : "visible", pointerEvents: isMarket ? "none" : "auto" }}>
        <button
          onClick={() => setShowContact((v) => !v)}
          className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-2 rounded-lg transition-all duration-200"
          style={{
            background: showContact ? "#6366F115" : "#0D0D1A",
            border: `1px solid ${showContact ? "#6366F1" : "#6366F140"}`,
            color: showContact ? "#E2E8F0" : "#9CA3AF",
            boxShadow: showContact ? "0 0 14px #6366F122" : "none",
          }}
        >
          Contact
        </button>

        {showContact && (
          <div
            className="absolute right-0 top-[calc(100%+10px)] rounded-xl"
            style={{
              width: 360,
              background: "#07101e",
              border: "1px solid #6366F1",
              boxShadow: "0 8px 40px rgba(99,102,241,0.18), 0 4px 20px rgba(0,0,0,0.8)",
              padding: "18px 20px",
              zIndex: 60,
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <span
                className="font-mono text-[10px] tracking-[0.18em] uppercase"
                style={{ color: "#8B5CF6" }}
              >
                Contact Info
              </span>
              <button
                onClick={() => setShowContact(false)}
                className="font-mono text-sm leading-none"
                style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Rows */}
            {CONTACT_ROWS.map(({ label, value, href, copyable }) => (
              <div
                key={label}
                className="flex justify-between items-center py-[10px]"
                style={{ borderBottom: "1px solid #0d1a2e" }}
              >
                <span
                  className="font-mono text-[10px] tracking-[0.16em] uppercase"
                  style={{ color: "#6366F1", minWidth: 72 }}
                >
                  {label}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="font-mono text-[12px] transition-colors duration-150"
                    style={{ color: "#c4c9d4", textDecoration: "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#e2e8f0"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#c4c9d4"; }}
                  >
                    {value}
                  </a>
                  {copyable && (
                    <button
                      onClick={() => copy(value, label)}
                      title="Copy"
                      className="font-mono text-[12px] leading-none transition-colors duration-150"
                      style={{
                        color: copiedField === label ? "#00ff88" : "#475569",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
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
    </motion.header>
  );
}
