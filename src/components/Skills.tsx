"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  SiPython, SiCplusplus, SiOpenjdk, SiHtml5, SiCss, SiJavascript,
  SiR3, SiMysql, SiPytorch, SiNumpy, SiDocker, SiLinux, SiRos,
  SiPostgresql, SiNvidia, SiPandas, SiScikitlearn, SiGit,
  SiNodedotjs, SiMongodb,
} from "react-icons/si";
import { IconType } from "react-icons";

type TechItem = { label: string; Icon: IconType; color: string; category: string };

const TECH: TechItem[] = [
  { label: "Python",       Icon: SiPython,      color: "#3B82F6", category: "Languages" },
  { label: "C++",          Icon: SiCplusplus,   color: "#00599C", category: "Languages" },
  { label: "Java",         Icon: SiOpenjdk,     color: "#ED8B00", category: "Languages" },
  { label: "HTML",         Icon: SiHtml5,       color: "#E34F26", category: "Languages" },
  { label: "CSS",          Icon: SiCss,         color: "#1572B6", category: "Languages" },
  { label: "JavaScript",   Icon: SiJavascript,  color: "#F7DF1E", category: "Languages" },
  { label: "R",            Icon: SiR3,          color: "#276DC3", category: "Languages" },
  { label: "MySQL",        Icon: SiMysql,       color: "#4479A1", category: "Languages" },
  { label: "PyTorch",      Icon: SiPytorch,     color: "#EE4C2C", category: "ML / Data" },
  { label: "NumPy",        Icon: SiNumpy,       color: "#4DABCF", category: "ML / Data" },
  { label: "pandas",       Icon: SiPandas,      color: "#150458", category: "ML / Data" },
  { label: "scikit-learn", Icon: SiScikitlearn, color: "#F7931E", category: "ML / Data" },
  { label: "Docker",       Icon: SiDocker,      color: "#2496ED", category: "Infra"     },
  { label: "Linux",        Icon: SiLinux,       color: "#FCC624", category: "Infra"     },
  { label: "Git",          Icon: SiGit,         color: "#F05032", category: "Infra"     },
  { label: "PostgreSQL",   Icon: SiPostgresql,  color: "#336791", category: "Infra"     },
  { label: "ROS2",         Icon: SiRos,         color: "#22314E", category: "Systems"   },
  { label: "CUDA",         Icon: SiNvidia,      color: "#76B900", category: "Systems"   },
  { label: "Node.js",      Icon: SiNodedotjs,   color: "#339933", category: "Systems"   },
  { label: "MongoDB",      Icon: SiMongodb,     color: "#47A248", category: "Systems"   },
];

const CATEGORIES = ["Languages", "ML / Data", "Infra", "Systems"];

const CATEGORY_LABEL: Record<string, string> = {
  "Languages":  "Languages",
  "ML / Data":  "ML & Data",
  "Infra":      "Infrastructure",
  "Systems":    "Systems",
};

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <span className="font-mono text-xs text-[#6366F1] tracking-widest">04 /</span>
          <h2 className="text-3xl font-bold text-white">Tech Stack</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#1A1A2E] to-transparent" />
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="space-y-6"
        >
          {CATEGORIES.map((cat) => {
            const items = TECH.filter((t) => t.category === cat);
            return (
              <motion.div key={cat} variants={item}>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#9CA3AF] mb-3">
                  {CATEGORY_LABEL[cat]}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {items.map(({ label, Icon, color }) => (
                    <div
                      key={label}
                      className="group flex flex-col items-center gap-2 rounded-xl border border-[#1A1A2E] bg-[#0D0D14] p-4 transition-all duration-200 cursor-default"
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = `${color}45`;
                        el.style.boxShadow = `0 0 20px ${color}15`;
                        el.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "#1A1A2E";
                        el.style.boxShadow = "none";
                        el.style.transform = "translateY(0)";
                      }}
                    >
                      <Icon size={30} style={{ color }} className="transition-transform duration-200 group-hover:scale-110" />
                      <span className="font-mono text-[11px] text-[#C8CEDE] group-hover:text-white transition-colors text-center leading-tight">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
