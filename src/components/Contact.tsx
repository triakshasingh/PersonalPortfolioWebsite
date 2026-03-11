"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, Mail, FileText } from "lucide-react";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("triakshasingh@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-24 px-6 bg-[#070710]">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <span className="font-mono text-xs text-[#6366F1] tracking-widest">05 /</span>
          <h2 className="text-3xl font-bold text-white">Contact</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#1A1A2E] to-transparent" />
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-2xl font-semibold text-white mb-2">Let's work together.</h3>
            <p className="text-[15px] text-[#C8CEDE] leading-relaxed max-w-lg">
              Open to SWE internships, quant research, and ML engineering roles for Summer 2026.
              Based in Seattle, WA.
            </p>
          </div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Email */}
            <button
              onClick={copyEmail}
              className="flex items-center gap-3 rounded-xl border border-[#1A1A2E] bg-[#0D0D14] p-4 hover:border-[#6366F1]/40 transition-colors duration-200 group text-left"
            >
              <div className="p-2 rounded-lg bg-[#6366F1]/10 shrink-0">
                {copied ? (
                  <CheckCircle size={18} className="text-[#22C55E]" />
                ) : (
                  <Mail size={18} className="text-[#6366F1]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9CA3AF] mb-0.5">Email</p>
                <p className="text-sm text-[#C8CEDE] group-hover:text-white transition-colors truncate">
                  {copied ? "Copied!" : "triakshasingh@gmail.com"}
                </p>
              </div>
            </button>

            {/* GitHub */}
            <a
              href="https://github.com/triakshasingh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-[#1A1A2E] bg-[#0D0D14] p-4 hover:border-[#8B5CF6]/40 transition-colors duration-200 group"
            >
              <div className="p-2 rounded-lg bg-[#8B5CF6]/10 shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#8B5CF6" aria-hidden>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0 1 12 5.803c.957.004 1.983.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0z" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9CA3AF] mb-0.5">GitHub</p>
                <p className="text-sm text-[#C8CEDE] group-hover:text-white transition-colors">triakshasingh</p>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/triakshasingh/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-[#1A1A2E] bg-[#0D0D14] p-4 hover:border-[#22D3EE]/40 transition-colors duration-200 group"
            >
              <div className="p-2 rounded-lg bg-[#22D3EE]/10 shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#22D3EE" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9CA3AF] mb-0.5">LinkedIn</p>
                <p className="text-sm text-[#C8CEDE] group-hover:text-white transition-colors">triakshasingh</p>
              </div>
            </a>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#6366F1] bg-[#6366F1]/10 text-[#818CF8] font-semibold text-sm hover:bg-[#6366F1]/20 hover:text-white transition-colors duration-200"
            >
              <FileText size={14} />
              Download Resume
            </a>
            <a
              href="mailto:triakshasingh@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#1A1A2E] text-[#C8CEDE] font-semibold text-sm hover:border-[#6366F1]/50 hover:text-white transition-colors duration-200"
            >
              Send Email
            </a>
          </div>

          <p className="font-mono text-[11px] text-[#6B7280]">
            triakshasingh@gmail.com · tsingh05@uw.edu
          </p>
        </motion.div>
      </div>
    </section>
  );
}
