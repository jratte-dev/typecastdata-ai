---
name: Typecast Data AI — Product Context
description: Strategic context for typecastdata.ai, John Ratté's personal content platform on data engineering and AI.
type: project
---

# Product

## Register

brand

## Users

Senior and senior-adjacent practitioners in data engineering, ML/AI, and adjacent platform work. People who already know what a window function is, who have opinions about Iceberg vs. Delta, who can smell a dishonest benchmark from a paragraph away. They show up because someone they trust linked a post, or because the headline made a claim they want to argue with. Context is usually a laptop on a couch, sometimes a phone in a coffee line, occasionally a second monitor while a long query runs. The job to be done is simple: read something substantive about a problem they actually have, by someone who has clearly done the work, without wading through SEO sludge or LinkedIn cosplay.

Secondary audience: engineering leaders evaluating John for consulting or advisory work. They arrive through the writing, not through a "Hire Me" CTA. The site has to make their decision easy without ever begging for it.

## Product Purpose

typecastdata.ai is John Ratté's long-form publication: one voice, one point of view, twenty years of data engineering colliding with AI. It exists to publish technical writing that is sharper, more honest, and more entertaining than the median data/AI blog. The site frame should make those posts feel like the most thought-out thing the reader will encounter today, and should fade out of the way once the eyes hit the first paragraph.

Success looks like: people read posts end-to-end, send them to colleagues, and remember which site published them. Bounces from the home page are fine. Skim-read article pages are not.

## Brand Personality

Irreverent, technical, unpolished. The narrator is a senior data engineer who has shipped more pipelines than most readers have read about, has watched at least three "next-generation" platforms turn into tech debt, and finds most industry discourse roughly as serious as a magic trick at a corporate retreat. The voice is dry, often funny, never trying to be funny. F-bombs are not banned. Hedge words are. The site should read like someone who knows the answer is annoyed at having to explain it for the fourth time, but is going to do it anyway because the explanations on the internet are worse.

North-star reference: oxide.computer/blog. Engineer's voice, industrial type, real diagrams, dry confidence, never cute. typecastdata.ai should land in adjacent territory but with a sharper sense of humor and a single byline.

## Anti-references

These are the failure modes. If a draft drifts toward any of them, rip it out.

- **AI startup template.** No purple-to-cyan gradient hero. No glowing orb. No "the future of data is here." No glassmorphic cards floating over an animated grid. If anything looks like the cover of a 2024 Series B deck, kill it.
- **Generic Medium / Substack blog.** No default-serif-on-white centered narrow column with no identity. The site must be unmistakably this site, not a content management theme.
- **LinkedIn-ified thought leadership.** No headshot in a circle, no "Insights" tab, no polished-but-soulless prose written for the algorithm. If a sentence could open a LinkedIn post, rewrite it or cut it.
- **Corporate consulting site.** No stock photos of professionals shaking hands, no "Trusted by" logo wall, no three identical feature cards selling competencies. Consulting interest is downstream of the writing, not a banner.

## Design Principles

1. **Practice what you preach + show the work.** A site about data engineering and AI craft has to demonstrate craft. Templates, defaults, and stock components are evidence against the writer. Where a post needs a real diagram, real numbers, a real query plan, the frame supports it without effort. Visible care in spacing, type, and detail is part of the argument.
2. **The post is the product.** Home, archive, and chrome exist to deliver readers to the article and then disappear. Article pages get the most design love. Reading flow beats every clever flourish; flourishes that survive are ones that earn their seat.
3. **Funny on purpose, never cute.** Humor lives in copy, microcopy, 404s, empty states, and the occasional well-placed footnote. It does not live in illustrations of cartoon robots, animated mascots, or anything that would survive on a Series B landing page. Dry wit only.
4. **One voice, visibly.** Single byline, single point of view, single typographic identity. No multi-author neutralization, no "we" when "I" is meant. The visual system should make a guest post feel obviously foreign if one ever happens.
5. **Earn every element.** No filler section, no decorative card, no flourish that exists because the page felt empty. Empty space is allowed. A short post should look short. A page with one thing on it should have one thing on it.

## Accessibility & Inclusion

Target WCAG AA in spirit across reading surfaces: contrast on body type, visible focus states, full keyboard navigation on interactive elements, alt text on content images, `prefers-reduced-motion` respected for any non-essential motion. Display moments (oversized headline, hero, decorative type treatment) may break strict AA contrast where the content is not load-bearing for comprehension. Interactive UI and article body must meet AA without exception. No motion-as-meaning unless the meaning is also conveyed statically.

No serif type for body. (User constraint: avoid serif faces. Type direction belongs in DESIGN.md, but this is a hard product-level constraint, not a visual preference.)
