# CLAUDE.md — sykespro-com

This file provides guidance to Claude Code when working in this repository.
Every decision documented here is derived from an Architecture Decision Record in the
companion project management workspace (`sykespro-personal-website/architecture/decisions/`).
Do not override these decisions without a new or superseding ADR.

---

## What This Repository Is

`sykespro-com` is the source code for **sykespro.com** — Daniel Sykes's personal professional
website and technical blog. It is a **static site**, not a web application. There is no backend,
no database, no server-side rendering, and no edge functions.

The site has four purposes:
1. Professional positioning — establish Daniel as a senior AI and systems architect
2. Technical blog — publish substantive articles on AI architecture, systems thinking, and design
3. Contact — a friction-free form for consulting inquiries and conversation
4. Performance — fast by default; Lighthouse 95+ is a non-negotiable goal

**Primary audience:** Technical Fellows and senior practitioners in AI, architecture, and systems
design. Not junior developers. Not general business audiences.

---

## Core Constraints — Never Violate These

These constraints are architectural decisions locked by ADR. Any change requires a new ADR.

| Constraint | Rule |
|---|---|
| **No SSR** | `output: 'static'` in `astro.config.mjs` — no SSR routes, no edge functions |
| **No component libraries** | No shadcn/ui, DaisyUI, or pre-built component systems — hand-crafted Astro components only |
| **No headless CMS at launch** | Content lives in `src/content/blog/*.mdx` — no Sanity, Contentful, Tina, etc. |
| **No npm run deploy** | Deploys happen via Netlify on push to `main` — never trigger manually |
| **No www canonical** | `sykespro.com` is canonical — `www` redirects to apex |
| **No dark mode at launch** | Light mode only; CSS tokens must support dark mode retrofitting, but do not implement it |
| **No staging branch** | `main → production` only; drafts use `draft: true` frontmatter |

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Astro v4+** | Zero JS by default; component islands; content collections |
| Rendering | **Static** (`output: 'static'`) | Fully deterministic; no compute at runtime |
| Styling | **Tailwind CSS v4** | `@astrojs/tailwind` integration |
| Prose styles | **`@tailwindcss/typography`** | Applied via `prose` class on MDX content |
| Typography | **Inter or Geist** | Loaded via `@fontsource`; final choice during visual design |
| Hosting | **Netlify** | Native git integration; Netlify Forms for contact |
| Contact form | **Netlify Forms** | `<form netlify>` attribute — no backend required |
| Content | **MDX** | `src/content/blog/*.mdx` via Astro content collections |
| CI (quality) | **GitHub Actions** | Lighthouse CI only (`treosh/lighthouse-ci-action`); non-blocking |
| Domain | **sykespro.com** (apex) | Netlify Let's Encrypt SSL; www → apex redirect |

---

## Project Structure

```
src/
├── components/         # Reusable Astro components (see Design System section)
├── content/
│   └── blog/           # *.mdx blog posts — source of truth for all content
├── layouts/            # Page-level layout wrappers
├── pages/              # File-based routing
│   ├── index.astro     # Home
│   ├── blog/
│   │   ├── index.astro # Blog index (paginated)
│   │   └── [...slug].astro # Blog post template
│   ├── about.astro
│   └── contact.astro
├── styles/
│   └── global.css      # CSS custom properties (design tokens) + Tailwind directives
└── content.config.ts   # Astro content collection schema (Zod)
```

Public assets (images, favicon, OG images) go in `public/`.

---

## Content Model

All blog content lives in `src/content/blog/*.mdx`. The collection schema is defined in
`src/content.config.ts` using Zod.

**Required frontmatter fields:**

```yaml
---
title: "Post title"
description: "One-sentence description for SEO and BlogCard"
pubDate: 2026-03-01          # ISO date
tags: ["AI Architecture"]    # Must map to a content pillar (see below)
draft: true                  # Set to false to publish; true keeps out of production build
---
```

**Optional frontmatter:**

```yaml
updatedDate: 2026-03-15      # If post has been substantially updated
heroImage: "/images/post-hero.jpg"
```

**Content collection filter** — always use this to exclude drafts:

```ts
const posts = await getCollection('blog', ({ data }) => !data.draft);
```

**Content pillars** — every post must map to at least one:
- `AI Architecture` — how AI systems are designed, integrated, and scaled
- `Systems Thinking` — mental models for complex systems
- `Leadership & Career` — organizational and human dimensions of technical leadership
- `Case Studies` — applied analysis from real-world experience

---

## Design System

### Approach

Tailwind CSS v4 + hand-crafted Astro components. No pre-built libraries.
Semantic CSS custom properties (design tokens) are the source of truth for all visual values.

### Design Token Layer

Tokens live in `src/styles/global.css`. All tokens are semantic, not value-based:

```css
:root {
  /* Colors */
  --color-primary: ...;       /* Main brand/accent color */
  --color-surface: ...;       /* Page/card background */
  --color-surface-alt: ...;   /* Slightly offset surface (e.g. code blocks) */
  --color-text: ...;          /* Body text */
  --color-text-muted: ...;    /* Secondary/meta text */
  --color-border: ...;        /* Dividers and outlines */

  /* Typography */
  --font-sans: ...;           /* Body and UI font (Inter or Geist) */
  --font-mono: ...;           /* Code font */

  /* Spacing / radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}
```

Token naming follows this pattern so dark mode can be added by re-mapping under `.dark {}` — never
use raw hex values in component files; always reference a token.

### Visual Direction

From ADR-0014: **bold and opinionated** aesthetic with **tactful micro-animations**.
- Landing page: **Halo-effect layout with author photo** (author photo is the visual anchor)
- Animations: subtle, purposeful — not decorative
- Overall feel: confident, precise, not generic developer blog

### Launch Components (5 — no more, no less at launch)

| Component | File | Purpose |
|---|---|---|
| `HeroSection` | `src/components/HeroSection.astro` | Landing page header; author photo; positioning statement |
| `BlogCard` | `src/components/BlogCard.astro` | Post list item; used on blog index and home page |
| `CallToAction` | `src/components/CallToAction.astro` | Section-level CTA block |
| `CodeBlock` | `src/components/CodeBlock.astro` | Syntax-highlighted code in MDX posts |
| `ContactForm` | `src/components/ContactForm.astro` | Netlify Forms `<form netlify>` element |

Do not create additional components without necessity. Reuse these five wherever possible.

---

## Positioning and Voice

Use this when writing or reviewing any content on the site.

**Positioning statement:** "Patterns, trade-offs, and real-world experience at the intersection
of AI, architecture, and systems design."

**Tone:** Technical, not exclusive — goes deep without gatekeeping. Opinionated, not
prescriptive — Daniel has a point of view and states it clearly, but is not telling practitioners
what to do.

**Primary CTA:** Read the blog. The blog is the product. All other CTAs (contact, newsletter) are
secondary.

**What to avoid in copy:**
- Tutorial framing ("in this post I'll show you how to...")
- Introductory or beginner-oriented language
- Corporate hedging ("it depends", "there's no right answer")
- Vague attributions or inflated language

---

## Build and Deploy Pipeline

**Production deploy:** Push to `main` → Netlify detects push → `astro build` → deploy to CDN.
No manual deploy steps. No staging environment.

**Draft posts:** Set `draft: true` in frontmatter. Drafts commit to `main` and are excluded from
production builds at build time. The frontmatter flag is the only gate before a post is live.

**Quality CI (GitHub Actions):**
- `treosh/lighthouse-ci-action` runs on push — **reports only, non-blocking**
- Broken link check (`lychee-action`) — deferred to post-launch

**Build command:** `astro build`
**Output directory:** `dist/`
**Node version:** 20+

---

## Quality Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | 95+ |
| Lighthouse Accessibility | 95+ |
| Lighthouse Best Practices | 95+ |
| Lighthouse SEO | 95+ |
| Core Web Vitals LCP | < 2.5s |
| Core Web Vitals CLS | < 0.1 |
| Core Web Vitals INP | < 200ms |

These targets are non-negotiable. They are achievable with Astro + static output by default —
do not introduce patterns that undermine them (lazy-loaded fonts without preload, unoptimized
images, layout shift from missing dimensions).

**Image handling:** Use Astro's built-in `<Image />` component (`astro:assets`) for all images.
This handles optimization, WebP conversion, and dimension enforcement automatically.

---

## What Not To Do

- Do not add `output: 'server'` or `output: 'hybrid'` to `astro.config.mjs`
- Do not install shadcn/ui, DaisyUI, Radix, or any other component library
- Do not install a headless CMS SDK (Sanity, Contentful, Tina, etc.)
- Do not create a staging branch or deploy workflow other than `main → production`
- Do not use `www.sykespro.com` as the canonical URL in any `<link rel="canonical">` tag
- Do not implement dark mode — structure tokens for it but leave it for a future session
- Do not use raw hex/rgb values in component files — use CSS custom property tokens only
- Do not create more than 5 components at launch — scope is the discipline
- Do not add `client:load` to a component unless it genuinely requires browser-side JavaScript
- Do not push directly to `main` without a working `astro build` — broken builds block the site
