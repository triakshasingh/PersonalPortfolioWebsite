# Triaksha Singh — Personal Portfolio

A dark, terminal-inspired personal portfolio built with Next.js. Features a Bloomberg-style **Market View** page that visualizes my career as an interactive equity curve.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v3**
- **Framer Motion v11**
- **Lucide React**

## Deploy (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/triakshasingh/PersonalPortfolioWebsite)

1. Go to [vercel.com](https://vercel.com) and import this repo
2. Click **Deploy** — no configuration needed
3. Add your custom domain in Project → Settings → Domains

No required environment variables.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/
│   ├── globals.css          # CSS variables, glass morphism, gradient utilities
│   ├── layout.tsx           # SEO metadata, fonts
│   ├── page.tsx             # Homepage: Hero → Projects → Experience → Skills → Contact
│   └── market-view/
│       └── page.tsx         # Bloomberg terminal — MarketSelect + EquityCanvas
├── components/
│   ├── Nav.tsx              # Sticky navigation
│   ├── Hero.tsx             # Landing section with neon orbs
│   ├── Projects.tsx         # Project cards (LOB, Volatility, iSENSE, Bioengineering)
│   ├── Experience.tsx       # Timeline of work/research experience
│   ├── Skills.tsx           # Tech stack badges
│   ├── Contact.tsx          # Social links and contact CTAs
│   ├── MarketSelect.tsx     # Market card selector for terminal view
│   ├── EquityCanvas.tsx     # SVG equity chart with career nodes
│   └── NodeSheet.tsx        # Slide-in detail sheet for timeline nodes
└── data/
    └── timelineNodes.ts     # Career node data for the equity chart
```

## Editing content

- **Projects:** `src/components/Projects.tsx`
- **Experience:** `src/components/Experience.tsx`
- **Skills:** `src/components/Skills.tsx`
- **Career timeline (Market View):** `src/data/timelineNodes.ts`
- **Contact / social links:** `src/components/Contact.tsx` and `src/components/Nav.tsx`

## Resume

Place your resume at `public/resume.pdf` so the "Resume" nav link works.
