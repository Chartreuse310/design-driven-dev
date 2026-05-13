# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
本文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指引。

## What this repo is / 仓库定位

A designer's learning journal tracking the journey from design to full-stack development. Content is organized around a closed-loop cycle: plans → action (notes/problems/projects/resources) → reflections → journal → new plans. See `FRAMEWORK.md` for the full framework definition, directory structure, templates, and learning roadmap.

设计师的学习笔记仓库，记录从设计到全栈开发的完整历程。内容围绕闭环循环组织：计划 (plans/) → 行动 (notes/problems/projects/resources/) → 复盘 (reflections/) → 日记 (journal/) → 新计划。完整的框架定义、目录结构、模板和学习路线图见 `FRAMEWORK.md`。

## Tech stack / 技术栈

- Astro 6 (static site generation)
- marked (markdown → HTML rendering)
- No CMS — content is edited via Obsidian vault

## Content language / 内容语言

All content (plans, journal entries, notes, reflections, problems) is written in Chinese. File and directory names use English kebab-case. Commit messages can be either language.

所有内容（计划、日记、笔记、复盘、问题记录）使用中文撰写。文件和目录名使用英文 kebab-case 格式。提交信息可用中文或英文。

## Obsidian Vault / Obsidian 库

The working workspace is `design-driven-dev-vault/` — an Obsidian vault that is gitignored. Content is written there and synced to the repo root directories when the user says "提交当前更新" or similar.

工作区是 `design-driven-dev-vault/` —— 一个被 gitignore 的 Obsidian 库。内容在其中撰写，当用户说"提交当前更新"或类似指令时同步到仓库根目录。

When syncing vault → repo root / 同步 vault → 仓库根目录时的规则：
- New files in vault: copy to matching root directory / vault 中的新文件：复制到对应的根目录
- Modified files: vault version overwrites root version / 已修改的文件：vault 版本覆盖根目录版本
- Files deleted in vault but present in root: confirm with user before removing / vault 中已删除但根目录仍存在的文件：先与用户确认再删除
- Files only in root (not in vault): leave untouched / 仅存在于根目录（vault 中没有）的文件：保持不动
- Never sync `.obsidian/` or any Obsidian metadata / 不要同步 `.obsidian/` 或任何 Obsidian 元数据
- **Convert wiki-links to markdown links** / **将双链转换为标准链接**：vault 中用 `[[path/to/file]]`，同步到根目录时转为 `[file](path/to/file.md)`，GitHub 可渲染

## Content conventions / 内容约定

- Content format: `.md` (Markdown with YAML frontmatter)
- Journal files / 日记文件：`journal/YYYY-MM-DD.md`（每天一个）
- Big actions / 大行动：`actions/NNN-name.md`
- Small actions / 小行动：`actions/NNN-MM-name.md`
- All files use YAML frontmatter (status/tags/date/parent as applicable)
- Each action is self-contained: notes, problems, and reflection are inline
- Journal entries act as indexes — they link to actions, not duplicate content

## Development / 开发

- `npm run dev` — Start Astro dev server
- `npm run build` — Build static site
- Content is edited in `design-driven-dev-vault/` via Obsidian, then synced to repo root
