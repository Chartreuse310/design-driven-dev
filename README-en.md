English | [中文](README.md)

# Design-Driven Dev

> Starting from design, learning full-stack development, exploring what it takes to bring ideas to life.

**[→ Visit Site](https://design-driven-dev.vercel.app)**

## What is this

I'm a designer who loves tinkering, hoping to learn enough to go from design to fully working products — and become an inventor! This repo documents my journey from scratch — my little goals, thoughts, and achievements (fingers crossed).

I'm sharing this publicly so I have a place to look back and see how far I've come, and also to connect with others. If you're on a similar learning path or have thoughts on anything here, I'd love to hear from you.

## What I'm building

**[Solution-Z](resources/solution-z/DESIGN-v2.md)** — a cross-platform action management tool that maps directly to my Obsidian vault format.

My Obsidian vault runs a stable action management system with a hierarchy of areas → goals → actions. Solution-Z is the editing layer — a Tauri app for recording actions with a timer, tracking time, and exporting back to the vault with zero data loss.

Tech stack: Tauri 2.0 · Svelte 5 · Tailwind CSS 4 · SQLite · TypeScript + Rust

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
