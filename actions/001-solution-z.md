---
title: 001-solution-z
status: 进行中
tags: [action, big, solution-z]
---

# 001 - Solution-Z：跨平台行动管理工具

基于 Obsidian vault 的行动管理系统，构建一个跨平台可视化编辑工具。App 是编辑入口，vault 是 Obsidian 浏览层。

**核心理念**：areas 是知识领域，goals 是进行中的目标，actions 是原子级时间记录。三者逐层细化，journal 是 actions 的日索引。

> 设计文档 v2 → [DESIGN-v2](../resources/solution-z/DESIGN-v2.md)
> 设计文档 v1 → [DESIGN](../resources/solution-z/DESIGN.md)
> 技术分析 → [tech-stack-analysis](../resources/solution-z/docs/tech-stack-analysis.md)
> 实现建议 → [suggestion-cursor](../resources/solution-z/docs/suggestion-cursor.md)

## 为什么

Obsidian vault 里跑着一套稳定的行动管理系统，但纯文本操作有局限——快速记录不够快、时间追踪靠手动、数据统计做不了。Solution-Z 把这套系统的数据逻辑结构化，提供比 Obsidian 更高效的编辑体验，同时保留无损导出到 vault 的能力。

**v1 → v2 根本转变**：v1 自创了 domains/verbs/actions 抽象模型，v2 直接映射 vault 已有的 areas/goals/actions/resources/notes/journal 体系，导出时零损耗还原为 Markdown 文件。

## 技术栈

```
跨平台: Tauri 2.0 (macOS + iOS + Android)
前端:   Svelte 5 (编译时框架，最小包体)
样式:   Tailwind CSS 4
数据库: SQLite (via tauri-plugin-sql，每端独立存储)
语言:   TypeScript + Rust
构建:   Vite
同步:   坚果云 WebDAV (SQLite 快照交换)
```

选型理由：Tauri 2.0 一套 Rust 核心构建全平台，Svelte 5 编译时优化无运行时开销，SQLite 本地优先零配置。从 Vue 3 + Electron 切换——Tauri 包体 < 15MB vs Electron > 120MB，且支持 iOS/Android。

## 子行动

- → [001-01-scaffold](001-01-scaffold.md) — Phase 1：Tauri + Svelte 脚手架 + 行动 CRUD + 计时器
- → [001-02-vault-export](001-02-vault-export.md) — Phase 2：Vault 导出 + Journal 自动生成
- → [001-03-goals-areas](001-03-goals-areas.md) — Phase 3：目标/领域/资源/笔记/模板
- → [001-04-mobile-sync](001-04-mobile-sync.md) — Phase 4：手机端 + WebDAV 同步
- → [001-05-polish](001-05-polish.md) — Phase 5：统计/搜索/深色模式/体验打磨

## 笔记

- 技术栈分析 → [tech-stack-analysis](../resources/solution-z/docs/tech-stack-analysis.md)（基于 v1，部分结论仍适用）

## 踩坑记录

（暂无）

## 复盘

（尚未开始）

## 关联 journal

（暂无）
