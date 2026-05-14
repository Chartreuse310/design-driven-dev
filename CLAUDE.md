# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
本文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指引。

## What this repo is / 仓库定位

A designer's learning journal tracking the journey from design to full-stack development. Content lives in three directories: `actions/` (learning goals + progress), `journal/` (daily index), `resources/` (reference material). Each action is self-contained with notes, problems, and reflections inline. See `FRAMEWORK.md` for details.

设计师的学习笔记仓库，记录从设计到全栈开发的完整历程。内容分三个目录：`actions/`（学习目标与进展）、`journal/`（每日索引）、`resources/`（参考资料）。每个行动自包含笔记、踩坑和复盘。详见 `FRAMEWORK.md`。

## Tech stack / 技术栈

- Astro 6 (static site generation)
- marked (markdown → HTML rendering)
- No CMS — content is edited via Obsidian vault

## Current focus / 当前重点

**Solution-Z** — 跨平台行动管理工具，直接映射 Obsidian vault 格式。技术栈：Tauri 2.0 + Svelte 5 + Tailwind CSS 4 + SQLite + TypeScript + Rust。设计文档见 `resources/solution-z/DESIGN-v2.md`。

**Solution-Z** — A cross-platform action management tool mapping directly to Obsidian vault format. Tech: Tauri 2.0 + Svelte 5 + Tailwind CSS 4 + SQLite + TypeScript + Rust. Design doc: `resources/solution-z/DESIGN-v2.md`.

## Content language / 内容语言

All content is written in Chinese. File and directory names use English kebab-case. Commit messages can be either language.

所有内容使用中文撰写。文件和目录名使用英文 kebab-case 格式。提交信息可用中文或英文。

## Obsidian Vault / Obsidian 库

The working workspace is `design-driven-dev-vault/` — an Obsidian vault that is gitignored. Content is written there and synced to the repo root when the user says "提交当前更新" or similar.

工作区是 `design-driven-dev-vault/` —— 一个被 gitignore 的 Obsidian 库。当用户说"提交当前更新"时同步到仓库根目录。

When syncing vault → repo root / 同步规则：
- New files in vault → copy to matching root directory
- Modified files → vault version overwrites root version
- Files deleted in vault but present in root → confirm with user before removing
- Files only in root (not in vault) → leave untouched
- Never sync `.obsidian/` or any Obsidian metadata
- **Convert wiki-links to markdown links**：`[[path/to/file]]` → `[file](path/to/file.md)`

## Content conventions / 内容约定

- Content format: `.md` (Markdown with YAML frontmatter)
- Journal files / 日记文件：`journal/YYYY-MM-DD.md`
- Big actions / 大行动：`actions/NNN-name.md`
- Small actions / 小行动：`actions/NNN-MM-name.md`
- All files use YAML frontmatter (status/tags/date/parent as applicable)
- Each action is self-contained: notes, problems, and reflection are inline
- Journal entries act as indexes — they link to actions, not duplicate content

## Development / 开发

- `npm run dev` — Start Astro dev server
- `npm run build` — Build static site
- Content is edited in `design-driven-dev-vault/` via Obsidian, then synced to repo root
