English | [中文](README.md)

# Design-Driven Dev

> Starting from design, learning full-stack development, exploring what it takes to bring ideas to life.

**[→ Visit Site](https://design-driven-dev.vercel.app)**

## What is this

I'm a designer learning full-stack development. This repo documents my journey from scratch — not tutorials copied from elsewhere, but my own understanding and the bugs I hit along the way.

I'm sharing this publicly so I have a place to look back and see how far I've come, and also to connect with others. If you're on a similar learning path or have thoughts on anything here, I'd love to hear from you.

## What I'm building

**[Solution-Z](resources/solution-z/DESIGN.md)** — a visual twin of my Obsidian-based action management system.

My Obsidian vault runs a stable action management system with a nested tree structure: Domain → Action → Action → Action. Solution-Z is a visual version of that system — aiming to be as easy to use as TickTick, but with a fundamentally different logic.

Tech stack: Vue 3 · Electron · Tailwind CSS · SQLite · TypeScript

## Repo structure

```
actions/         Actions (big + small, self-contained with notes/problems/reflection)
journal/         Daily journal (index + thoughts)
resources/       Reference material
```

Built with [Astro](https://astro.build/). Content is in `.md` format, edited via Obsidian.

See [FRAMEWORK.md](FRAMEWORK.md) for details.

## Workflow

1. Edit in Obsidian (`design-driven-dev-vault/`, gitignored)
2. Sync to repo root (auto-converts wiki-links → markdown links)
3. Astro builds the static site and deploys

## About language

I write mostly in Chinese since it's my native language. But feel free to communicate with me in English if that's more comfortable for you — really, no worries.
