# RideTune Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone official RideTune website in `website/` that presents the product as a premium motorcycle technology company.

**Architecture:** Create a standalone Next.js App Router project with focused React components for each narrative section. Use Tailwind tokens derived from the RideTune app, Framer Motion for subtle reveals, and static data arrays for feature cards, phone states, ride types, and roadmap items.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Framer Motion, lucide-react, semantic HTML, JSON-LD metadata.

---

### Task 1: Project Scaffold

**Files:**
- Create: `website/package.json`
- Create: `website/tsconfig.json`
- Create: `website/next.config.mjs`
- Create: `website/postcss.config.mjs`
- Create: `website/tailwind.config.ts`
- Create: `website/.gitignore`
- Create: `website/src/app/layout.tsx`
- Create: `website/src/app/page.tsx`
- Create: `website/src/app/globals.css`

- [ ] **Step 1: Create the standalone Next.js structure**

Create `website/` with App Router folders and package scripts for `dev`, `build`, `start`, and `lint`.

- [ ] **Step 2: Configure Tailwind with RideTune tokens**

Define background, surface, elevated surface, text, muted text, accent, success, warning, border colors, radius, and shadows from the mobile app theme.

- [ ] **Step 3: Add global CSS**

Set dark background, smooth scrolling, selection color, focus states, reduced-motion handling, and reusable utility classes for premium surfaces.

- [ ] **Step 4: Verify scaffold**

Run `npm install` inside `website/`, then `npm run build`. Expected result: a successful Next.js production build.

### Task 2: Content And Component System

**Files:**
- Create: `website/src/lib/content.ts`
- Create: `website/src/components/motion.tsx`
- Create: `website/src/components/site-header.tsx`
- Create: `website/src/components/phone-mockup.tsx`
- Create: `website/src/components/section-shell.tsx`

- [ ] **Step 1: Add structured content**

Create typed arrays for trust indicators, problem cards, timeline steps, features, phone screens, premium comparison rows, ride types, and roadmap items.

- [ ] **Step 2: Add reusable motion primitives**

Create client-side reveal and stagger components using Framer Motion with reduced-motion-friendly transitions.

- [ ] **Step 3: Add shared UI primitives**

Create a header, section shell, and phone mockup that can be reused across sections.

- [ ] **Step 4: Verify type safety**

Run `npm run build`. Expected result: no TypeScript errors.

### Task 3: Narrative Sections

**Files:**
- Create: `website/src/components/hero.tsx`
- Create: `website/src/components/problem.tsx`
- Create: `website/src/components/how-it-works.tsx`
- Create: `website/src/components/feature-grid.tsx`
- Create: `website/src/components/interactive-phone.tsx`
- Create: `website/src/components/premium.tsx`
- Create: `website/src/components/ride-types.tsx`
- Create: `website/src/components/future.tsx`
- Create: `website/src/components/final-cta.tsx`
- Create: `website/src/components/footer.tsx`
- Modify: `website/src/app/page.tsx`

- [ ] **Step 1: Implement Hero**

Full-screen cinematic hero with motorcycle background, phone mockup, headline, subtitle, Google Play CTA, iPhone coming-soon secondary button, and trust indicators.

- [ ] **Step 2: Implement Problem and How It Works**

Add confidence-focused problem copy, independently animated problem cards, and an elegant timeline.

- [ ] **Step 3: Implement Features and Sticky Phone**

Add premium hover cards and a sticky phone section whose visible screen changes through scroll-driven sections.

- [ ] **Step 4: Implement Premium, Ride Types, Future, CTA, Footer**

Complete the story with aspirational premium comparison, photography cards, roadmap, final CTA, and footer links.

- [ ] **Step 5: Verify page build**

Run `npm run build`. Expected result: successful production build with all sections included.

### Task 4: SEO, Accessibility, And Polish

**Files:**
- Modify: `website/src/app/layout.tsx`
- Modify: `website/src/app/page.tsx`
- Modify: `website/src/app/globals.css`

- [ ] **Step 1: Add metadata**

Add title, description, keywords, OpenGraph, Twitter metadata, canonical URL, and theme color.

- [ ] **Step 2: Add structured data**

Add Schema.org `SoftwareApplication` JSON-LD for RideTune.

- [ ] **Step 3: Check accessibility**

Ensure buttons/links have clear labels, focus states are visible, heading hierarchy is correct, color contrast is strong, and decorative visuals are hidden from assistive tech where appropriate.

- [ ] **Step 4: Responsive review**

Run the dev server and verify desktop and mobile layouts in the browser. Fix any overlaps, cramped text, or layout jumps.

- [ ] **Step 5: Final verification**

Run `npm run build` and keep the dev server running for the user with a local URL.
