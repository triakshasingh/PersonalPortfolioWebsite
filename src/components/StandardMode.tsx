"use client";

import { ArrowUpRight, Copy, Github, Mail, FileText } from "lucide-react";
import { timelineNodes } from "@/data/timelineNodes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ToastProvider";

export default function StandardMode() {
  const { showToast } = useToast();
  const featured = timelineNodes.slice().sort((a, b) => b.yValue - a.yValue).slice(0, 4);

  const copyEmail = () => {
    navigator.clipboard.writeText("tsingh05@uw.edu");
    showToast("Email copied to clipboard");
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 space-y-16 pb-20">
      <About />

      <Section title="Featured Systems" id="featured">
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((node) => (
            <article
              key={node.id}
              className="group rounded-2xl border border-[#1A1A2E] bg-[#0F111A] p-5 shadow-inner hover:border-[#273055] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
                    {Math.round(node.year)}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{node.label}</h3>
                  <p className="text-sm text-[#A3A8B5]">{node.summary}</p>
                </div>
                <div className="rounded-full border border-[#1F2035] px-3 py-1 text-[11px] font-mono text-[#9CA3AF]">
                  ŷ {node.yValue}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {node.tech.slice(0, 6).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[#1F2035] bg-[#0C0E16] px-2.5 py-1 text-xs text-[#C8CEDE]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-[12px] text-[#9CA3AF]">
                {node.metrics.slice(0, 2).map((m) => (
                  <div key={m.label} className="rounded-lg bg-[#0A0A12] px-3 py-2 border border-[#161626]">
                    <p className="text-xs font-semibold text-white">{m.value}</p>
                    <p className="font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                      {m.label}
                      {m.detail ? ` · ${m.detail}` : ""}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                {node.links.github && (
                  <a
                    href={node.links.github}
                    className="inline-flex items-center gap-1 text-sm text-[#A5B4FC] hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={14} />
                    GitHub
                  </a>
                )}
                {node.links.writeup && (
                  <a
                    href={node.links.writeup}
                    className="inline-flex items-center gap-1 text-sm text-[#A5B4FC] hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowUpRight size={14} />
                    Writeup
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Experience" id="experience">
        <div className="space-y-4">
          {EXPERIENCE.map((item) => (
            <div
              key={item.company}
              className="flex flex-col gap-1 rounded-xl border border-[#1A1A2E] bg-[#0F111A] px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-white font-semibold">{item.company}</div>
                <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#6B7280]">
                  {item.dates}
                </span>
              </div>
              <div className="text-sm text-[#A3A8B5]">{item.role}</div>
              <p className="text-sm text-[#7F8496]">{item.focus}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Skills" id="skills">
        <div className="grid gap-3 md:grid-cols-3">
          {SKILLS.map((group) => (
            <div key={group.title} className="rounded-2xl border border-[#1A1A2E] bg-[#0F111A] p-4">
              <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
                {group.title}
              </p>
              <ul className="mt-2 space-y-1 text-sm text-[#C8CEDE]">
                {group.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Contact" id="contact">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default" onClick={copyEmail} className="gap-2">
            <Copy size={14} />
            Copy email
          </Button>
          <Button asChild variant="subtle" className="gap-2">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <FileText size={14} />
              Resume PDF
            </a>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <a href="mailto:tsingh05@uw.edu">
              <Mail size={14} />
              Email
            </a>
          </Button>
          <a
            href="https://github.com/triakshasingh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#A5B4FC] hover:text-white"
          >
            <Github size={14} />
            GitHub
          </a>
        </div>
      </Section>
    </div>
  );
}

function About() {
  return (
    <section className="space-y-3">
      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6B7280]">About</p>
      <h2 className="text-3xl font-semibold text-white">Triaksha Singh — systems, quant, embedded.</h2>
      <p className="text-lg text-[#A5AEC2] max-w-3xl">
        I design and ship infrastructure that holds up under latency budgets and hardware constraints.
        The equity curve is the primary surface — each node is a system with measurable impact.
      </p>
    </section>
  );
}

function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-4">
      <div className="flex items-center gap-3">
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6B7280]">{title}</p>
        <div className="h-px flex-1 bg-gradient-to-r from-[#1F2337] via-[#1C1F31] to-transparent" />
      </div>
      {children}
    </section>
  );
}

const EXPERIENCE = [
  {
    company: "Allbritton Bioengineering Lab — UW",
    role: "Systems / Research Engineer",
    focus: "Distributed telemetry, firmware ↔ backend integration, lab automation reliability.",
    dates: "2025–2026",
  },
  {
    company: "UW Husky Robotics",
    role: "ROS2 Control Engineer",
    focus: "Async messaging, profiling, and hardware-in-loop for rover latency budgets.",
    dates: "2024",
  },
];

const SKILLS = [
  {
    title: "Systems & Infra",
    items: ["Low-latency pipelines", "Benchmarking + profiling", "Observability", "Distributed state"],
  },
  {
    title: "Firmware & Robotics",
    items: ["ESP32 / FreeRTOS", "DRV8825 / PWM / interrupts", "ROS2 async patterns", "HiL + telemetry"],
  },
  {
    title: "Quant & ML",
    items: ["Limit order books", "Volatility estimation", "Vectorized Python", "FastAPI ML serving"],
  },
];
