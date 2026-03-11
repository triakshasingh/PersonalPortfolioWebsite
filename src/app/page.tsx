import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Skills />

        <Contact />
      </main>
      <footer className="border-t border-[#111120] py-8 bg-[#0A0A0F]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-mono text-xs text-[#2D2D4A]">
            © {new Date().getFullYear()} Triaksha Singh
          </span>
          <span className="font-mono text-xs text-[#2D2D4A]">
            Next.js · Tailwind · Framer Motion
          </span>
        </div>
      </footer>
    </>
  );
}
