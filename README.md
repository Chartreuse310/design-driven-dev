[English](README-en.md) | 中文

# Design-Driven Dev

> 从设计出发，学习全栈技术，探索从设计到落地的可能性。

## 这是什么

我是一名设计师，正在学习全栈开发。这个仓库记录了我从零开始的学习过程——不是教程的搬运，而是自己的理解和踩过的坑。

我将它分享出来，是希望未来能多一个看到自己成长轨迹的地方，也希望能得到交流。如果你也在经历类似的学习路径，或者对其中任何内容有想法，欢迎讨论。

## 我在做什么

**[Solution-Z](resources/solution-z/DESIGN.md)** — 一个基于 Obsidian 行动管理系统的可视化孪生应用。

我的 Obsidian 里跑着一套稳定的行动管理系统（领域 → 行为 → 行为 → 行为，嵌套树结构），Solution-Z 是它的可视化版本——目标是像滴答清单一样易用，但逻辑体系完全不同。

技术栈：Vue 3 · Electron · Tailwind CSS · SQLite · TypeScript

## 仓库结构

```
actions/         行动（大行动 + 小行动，自包含笔记/踩坑/复盘）
journal/         每日记录（索引 + 感受）
resources/       参考资料
```

使用 [Astro](https://astro.build/) 构建静态站点。内容为 `.md` 格式，通过 Obsidian 编辑。

详见 [FRAMEWORK.md](FRAMEWORK.md)。

## 工作流程

1. 在 Obsidian 中编辑 `design-driven-dev-vault/`（gitignored）
2. 同步到仓库根目录（自动转换 wiki-link → markdown link）
3. Astro 构建静态站点并部署

## 关于语言

在很多地方我会使用中文记录，因为这是我的母语。但请不用在意地用英文与我交流，如果你认为这样更舒适的话。
