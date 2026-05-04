# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

@AGENTS.md

## Project

Typecast Data AI (typecastdata.ai) — the personal content platform and technical 
blog of John Ratté. One voice, one point of view: data engineering meets AI, 
written with authority and humor. Built by someone with 20 years in data who is 
now building AI-powered solutions across industries.

This is not a corporate site. The tone is sharp, technically credible, and 
occasionally funny enough to make HR mildly uncomfortable.

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — run ESLint (flat config, eslint.config.mjs)
- `npm start` — serve production build

## Architecture

Next.js 16 App Router project with React 19, Tailwind CSS v4, TypeScript strict mode.

- **App directory**: `src/app/` — uses `@/*` path alias mapped to `./src/*`
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`; global styles in `src/app/globals.css`
- **Database**: Supabase (to be configured)
- **Deployment**: Vercel — every push to main triggers a production deploy
- **Fonts**: Geist and Geist Mono via `next/font/google`
- **ESLint**: Flat config with `core-web-vitals` and `typescript` presets

## Conventions

- Server components by default — use `"use client"` only when necessary
- TypeScript strict mode — no `any` types
- Component files: PascalCase (`BlogCard.tsx`)
- Utility files: camelCase (`formatDate.ts`)
- Commit messages: imperative mood, under 72 chars (`Add blog post card component`)

## Voice & Content

When generating any user-facing copy, headlines, or content:
- Write in John's voice — a senior data engineer who has seen everything and 
  finds most of it absurd
- Technically precise, never dumbed down
- Humor is a feature, not a bug — dry wit preferred
- Avoid corporate language, buzzword soup, and anything that sounds like a 
  LinkedIn post written by a committee