---
status: 进行中
tags: [goal, long-term, solution-z]
---

# 001 - Solution-Z：行动管理可视化软件

基于 Obsidian 中已稳定运行的行动管理系统，构建一个可视化孪生应用。

**Obsidian 系统结构**：领域（大分类）→ 行为 → 行为 → 行为（嵌套树）。每个行为是一个带 frontmatter 的 Markdown 文档，包含行动类型、开始日期、结束日期等属性。Solution-Z 将这套逻辑可视化，提供比 Obsidian 更直观的操作体验——目标是像滴答清单一样易用，但逻辑体系完全不同。

> 设计文档 → [[resources/solution-z/DESIGN.md]]
> 技术分析 → [[resources/solution-z/docs/tech-stack-analysis.md]]

## 为什么

在 Obsidian 里管理行动已经跑通，但纯文本操作有天然局限——树状嵌套看不清全貌、拖拽排序不直观、状态切换步骤多。Solution-Z 解决这些痛点，同时保留 Obsidian 系统的数据逻辑。

## 技术栈

```
前端: Vue 3 + Pinia + Vue Router
桌面: Electron
样式: Tailwind CSS 4
数据库: SQLite (via better-sqlite3)
构建: Vite + electron-builder
语言: TypeScript
```

选型理由：完全对齐学习兴趣（Vue、Electron、Tailwind、TypeScript、Vite、pnpm）。Electron 性能对任务管理器完全够用（滴答清单就是 Electron），且不需要学 Rust。

## 短期目标

- → [[plans/001-01-web-basics.md]] — 阶段 1：Web 基础，还原 UI
- → [[plans/001-02-data-layer.md]] — 阶段 2：数据层，SQLite + CRUD
- → [[plans/001-03-electron.md]] — 阶段 3：Electron 桌面化
- → [[plans/001-04-interaction.md]] — 阶段 4：交互打磨
- → [[plans/001-05-extensions.md]] — 阶段 5：扩展功能

## 设计文档管理

设计文档目前放在 `resources/solution-z/`，后续新增/更新的设计文档也放在此处。位置待定，后续讨论。

## 当前进度

- 尚未开始，当前在学习前端基础知识
- 前端技术栈概览 → [[notes/frontend/前端技术栈：从夯到拉.md]]
