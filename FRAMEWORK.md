# Design-Driven Dev - 仓库框架

> 一个设计师学习全栈技术，从设计到落地的完整记录。

---

## 核心循环

```
目标 (plans/)
  ↓
行动 (notes/ problems/ projects/ resources/)
  ↓
复盘 (reflections/)
  ↓
记录 (journal/)
  ↓
新目标 (plans/) ...
```

每天打开电脑 → 看当前 plan → 学习/做事 → 日记链接产物 → 阶段结束写 reflection → 定下一个 plan。

---

## 目录结构

```
design-driven-dev/
├── README.md                        # 项目介绍 & 使用说明
├── FRAMEWORK.md                     # 本文件
├── ROADMAP.md                       # 学习路线图 & 阶段目标
│
├── plans/                           # 目标与计划
│   ├── 001-learn-html-css.md        # 每个计划一个文件
│   ├── 002-build-portfolio.md
│   └── template.md
│
├── journal/                         # 每日记录
│   ├── 2026-05-13.md                # 每天一个文件
│   ├── 2026-05-14.md
│   └── template.md
│
├── notes/                           # 知识笔记（按技术分类）
│   ├── frontend/
│   │   ├── html-css-basics.md
│   │   ├── javascript-core.md
│   │   ├── react-essentials.md
│   │   ├── nextjs-app-router.md
│   │   └── tailwind-css.md
│   ├── backend/
│   │   ├── nodejs-basics.md
│   │   ├── api-design.md
│   │   ├── database-fundamentals.md
│   │   └── authentication.md
│   ├── devops/
│   │   ├── git-workflow.md
│   │   ├── vercel-deployment.md
│   │   ├── cli-essentials.md
│   │   └── environment-setup.md
│   └── design-to-code/             # 设计师视角的独特笔记
│       ├── design-tokens-to-css.md
│       ├── figma-to-component.md
│       ├── responsive-design.md
│       └── design-system-in-code.md
│
├── problems/                        # 问题与解决方案
│   ├── environment-bugs/
│   ├── concept-confusions/
│   ├── code-errors/
│   └── template.md
│
├── projects/                        # 实战项目
│   ├── 01-personal-portfolio/
│   │   ├── README.md
│   │   ├── what-i-learned.md
│   │   └── ...
│   └── 02-landing-page/
│       └── ...
│
├── reflections/                     # 问题导向的复盘
│   ├── 001-learn-html-css.md        # 对应 plans/001
│   ├── 002-build-portfolio.md       # 对应 plans/002
│   └── template.md
│
└── resources/                       # 资源收集
    ├── courses.md
    ├── tools.md
    ├── articles.md
    └── communities.md
```

---

## 各目录职责

### `plans/` - 目标

每个计划是一个有明确终点的小目标。一个 plan 完成后，对应写一篇 reflection。

包含：
- **目标**：要达成什么
- **为什么**：为什么现在学这个
- **范围**：做到什么程度算完成
- **预计时间**：打算花多久
- **关联**：前置计划、后续计划

### `journal/` - 每日记录

每天一个文件，记录当天的行为和思考。核心机制是**链接**——把当天产生的笔记、问题、项目进展、找到的资源都串起来。

不是流水账，而是当天的索引 + 感受。具体内容写在 notes/problems/projects 里，journal 用链接指向它们。

### `notes/` - 知识笔记

按技术领域分类，侧重**自己的理解**而非复制文档。

- `frontend/` / `backend/` / `devops/` — 标准技术笔记
- `design-to-code/` — **核心特色**，设计师视角下的技术理解（如：CSS Grid 就像 Figma 的 Auto Layout）

### `problems/` - 问题记录

每个问题完整记录：症状 → 原因 → 解决 → 教训。

### `projects/` - 实战项目

每个项目一个文件夹，包含代码和 `what-i-learned.md` 总结。由 plan 驱动启动。

### `reflections/` - 复盘

与 plans 一一对应。一个 plan 完成后写对应的 reflection，问题导向，回答：

- 目标达成了吗？差距在哪？
- 过程中最大的卡点是什么？
- 有什么认知被改变了？
- 下一步需要调整什么？

不是流水式总结，而是**围绕问题**的复盘。

### `resources/` - 资源收藏

按类型分类，附简短评价。

---

## 链接机制

journal 是枢纽，通过 Markdown 链接串联一切：

```markdown
# 2026-05-13

## 今天做了什么
- 开始学 CSS Grid → [[notes/design-to-code/css-grid.md]]
- 环境配置踩了个坑 → [[problems/code-errors/node-version-mismatch.md]]
- 找到不错的教程 → [[resources/courses.md#css-hard-parts]]

## 感受
Grid 的思维模型比 Flexbox 更接近 Figma 的 Auto Layout，
理解了这点之后突然顺畅了很多。

## 当前目标
→ [[plans/001-learn-html-css.md]]
```

其他文件也可以反向链接：

```markdown
# notes/design-to-code/css-grid.md
...

**第一次接触**：[[journal/2026-05-13]]
**关联计划**：[[plans/001-learn-html-css.md]]
**踩过的坑**：[[problems/code-errors/grid-gap-confusion.md]]
```

---

## 模板

### 计划模板 (`plans/template.md`)

```markdown
# 00X - [计划名称]

**状态**：进行中 / 已完成
**起止日期**：YYYY-MM-DD ~ YYYY-MM-DD
**前置计划**：[[plans/XXX-xxx.md]]（无则删除此行）

## 目标
（一句话说清要达成什么）

## 为什么
（为什么现在做这个）

## 完成标准
- [ ] 条件1
- [ ] 条件2

## 预计产出
- 笔记 → [[notes/xxx]]
- 项目 → [[projects/XX-xxx]]

## 复盘
→ [[reflections/00X-xxx.md]]
```

### 日记模板 (`journal/template.md`)

```markdown
# YYYY-MM-DD

## 做了什么
- 描述 → [[链接到对应文件]]

## 想法
（当天的思考、感受、顿悟）

## 当前目标
→ [[plans/XXX-xxx.md]]

## 明天继续
（一句话，明天从哪里接着来）
```

### 复盘模板 (`reflections/template.md`)

```markdown
# 复盘 - [对应计划名称]

**对应计划**：[[plans/00X-xxx.md]]
**日期**：YYYY-MM-DD

## 结果
（目标达成了吗？差距在哪）

## 关键问题
### 问题1：[简述]
- 发生了什么：
- 根因是什么：
- 怎么解决的：

### 问题2：[简述]
...

## 认知变化
（哪些想法被改变了）

## 产出物
- 笔记：[[notes/xxx]]
- 问题：[[problems/xxx]]
- 项目：[[projects/xxx]]

## 下一步调整
（下一个 plan 需要注意什么）
```

### 问题记录模板 (`problems/template.md`)

```markdown
# [问题简述]

**日期**：YYYY-MM-DD
**分类**：环境配置 / 概念理解 / 代码报错
**关联计划**：[[plans/XXX-xxx.md]]
**首次记录**：[[journal/YYYY-MM-DD.md]]

## 症状
（遇到了什么）

## 尝试过程
1.
2.
3.

## 根本原因
（真正的原因是什么）

## 解决方案
（怎么修好的）

## 教训
（下次遇到类似问题怎么办）
```

---

## 推荐的项目实战路线

从设计出发，逐步深入：

| 阶段 | 项目 | 核心学习点 |
|------|------|-----------|
| 1 | 静态个人作品集 | HTML/CSS 基础、响应式、部署上线 |
| 2 | 落地页 + 动效 | Tailwind CSS、CSS 动画、Figma 设计还原 |
| 3 | 带表单的营销页 | JavaScript 交互、表单验证、API 对接 |
| 4 | 个人博客 | Next.js、Markdown 渲染、静态生成 |
| 5 | 全栈应用（如任务管理） | 数据库、CRUD、用户认证、前后端联调 |
| 6 | SaaS 小产品 | 支付集成、邮件、部署自动化、监控 |

---

## 写作原则

1. **用自己话写** — 不抄文档，记自己的理解
2. **诚实记录** — 卡住了就写卡住了，不需要包装
3. **设计师语言** — 用设计概念类比技术概念
4. **链接驱动** — journal 是索引，具体内容散落在各处，用链接串联
5. **问题导向** — reflection 不写流水账，围绕遇到的问题复盘
6. **面向未来的自己** — 写给三个月后回头看时的自己
