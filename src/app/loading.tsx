export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#0A0A0F] flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-5">
        <div className="flex gap-1.5">
          <div className="loading-dot w-2 h-2 rounded-full bg-[#6366F1]" />
          <div className="loading-dot w-2 h-2 rounded-full bg-[#8B5CF6]" />
          <div className="loading-dot w-2 h-2 rounded-full bg-[#22D3EE]" />
        </div>
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#6B7280]">
          Loading
        </span>
      </div>
    </div>
  );
}
