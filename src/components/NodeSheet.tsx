import { ExternalLink, Github, LinkIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { TimelineNode } from "@/data/timelineNodes";
import { cn } from "@/lib/utils";

type NodeSheetProps = {
  node: TimelineNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NodeSheet({ node, open, onOpenChange }: NodeSheetProps) {
  if (!node) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto pb-10">
        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
              {node.year} · {node.volatilityTag ?? "trajectory"}
            </p>
            <h2 className="text-2xl font-semibold text-white">{node.label}</h2>
            <p className="text-sm text-[#A3A8B5]">{node.summary}</p>
          </div>

          <Section title="Problem">
            <p className="text-sm leading-relaxed text-[#C9CEDA]">{node.problem}</p>
          </Section>

          <Section title="Architecture">
            <ul className="space-y-2 text-sm text-[#B1B8C8]">
              {node.architecture.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Key choices">
            <ul className="space-y-2 text-sm text-[#B1B8C8]">
              {node.highlights.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#7C3AED]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Performance">
            <div className="grid grid-cols-2 gap-2">
              {node.metrics.map((metric) => (
                <div
                  key={metric.label + metric.value}
                  className="rounded-xl border border-[#1A1A2E] bg-[#0D0D15] px-3 py-3"
                >
                  <p className="text-sm font-semibold text-white">{metric.value}</p>
                  <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
                    {metric.label}
                    {metric.detail ? ` · ${metric.detail}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Tech stack">
            <div className="flex flex-wrap gap-2">
              {node.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[#1F2035] bg-[#0F111A] px-3 py-1 text-xs font-medium text-[#C8CEDE]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Links">
            <div className="flex flex-wrap gap-2">
              {node.links.github && (
                <LinkPill href={node.links.github} icon={<Github size={14} />}>
                  GitHub
                </LinkPill>
              )}
              {node.links.demo && (
                <LinkPill href={node.links.demo} icon={<ExternalLink size={14} />}>
                  Demo
                </LinkPill>
              )}
              {node.links.writeup && (
                <LinkPill href={node.links.writeup} icon={<LinkIcon size={14} />}>
                  Writeup
                </LinkPill>
              )}
            </div>
          </Section>
        </div>
      </SheetContent>
      <SheetTrigger asChild>
        <Button className="sr-only">Open node</Button>
      </SheetTrigger>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
        {title}
      </p>
      {children}
    </div>
  );
}

function LinkPill({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#1A1A2E] bg-[#0F111A] px-3 py-1.5 text-sm text-[#C8CEDE]",
        "hover:border-[#2C2C46] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]",
      )}
    >
      {icon}
      {children}
    </a>
  );
}
