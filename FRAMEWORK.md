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

## 实战路线

两个阶段性目标：

- **目标 A**：开发全平台（Mac + Windows + Android）的美观软件
- **目标 B**：开发 Mac + Windows 的参数化建模 + 知识库软件（含 Agent 辅助检索）

技术选型：
- 跨平台框架：**Tauri 2.0**（Web UI + Rust 后端，覆盖桌面和移动端）
- 参数化建模内核：**OCCT (OpenCascade)**（C++ 几何内核，工业级 B-Rep 建模）
- 3D 渲染：OCCT 生成几何 → 导出网格 → **Three.js/WebGPU** 在 Tauri WebView 中渲染
- AI/检索：LLM API + RAG + 向量数据库

---

### 第一阶段：Web 基础 — 从设计稿到可运行的页面

> 设计师的自然起点，用已有的视觉能力驱动学习。

| # | 项目 | 核心学习点 |
|---|------|-----------|
| 1 | 静态个人作品集 | HTML/CSS 基础、响应式布局、DevTools、部署上线 |
| 2 | 带交互动效的落地页 | Tailwind CSS、CSS/JS 动画、Figma 设计还原 |
| 3 | 带表单和数据展示的单页应用 | JavaScript 核心、DOM 操作、API 调用、异步编程 |

### 第二阶段：现代前端 + 后端 — 组件化与全栈

> 从"画页面"到"搭系统"，掌握数据流和前后端协作。

| # | 项目 | 核心学习点 |
|---|------|-----------|
| 4 | 个人博客 | React、组件化、Markdown 渲染、路由 |
| 5 | 全栈看板应用 | Next.js、数据库 CRUD、用户认证、前后端联调 |

### 第三阶段：Tauri 跨平台 — 目标 A 起步

> 进入桌面应用开发，Tauri 用 Web 技术做 UI，Rust 处理底层。

| # | 项目 | 核心学习点 |
|---|------|-----------|
| 6 | 桌面端 Markdown 笔记本 | Tauri 2.0 入门、Rust 基础、文件系统读写、原生窗口、Mac/Windows 构建 |
| 7 | 桌面端素材管理工具 | SQLite 本地数据库、图片处理、拖拽交互、原生菜单/快捷键 |

### 第四阶段：Tauri 移动端 — 目标 A 完成

> 扩展到 Android，掌握移动端适配与全平台发布。

| # | 项目 | 核心学习点 |
|---|------|-----------|
| 8 | 移动端待办应用 | Tauri 移动端适配、触摸交互、移动端 UI、Android 构建与签名 |
| 9 | 跨平台个人知识管理 App | 移动端 + 桌面端共享逻辑、数据同步、离线优先、全平台发布流程 |

### 第五阶段：C++ 与 OCCT 基础 — 目标 B 起步

> 离开 Web 舒适区，进入系统编程和 CAD 几何内核的世界。

| # | 项目 | 核心学习点 |
|---|------|-----------|
| 10 | C++ 命令行工具（如文件批处理） | C++ 基础、编译构建（CMake）、内存管理思维 |
| 11 | OCCT 基础几何练习 | OCCT 框架结构、拓扑与几何（B-Rep）、基本体素操作、STEP/STL 文件 I/O |
| 12 | 参数化零件生成器 | 参数驱动建模、特征树、约束求解思路、几何算法入门 |

### 第六阶段：OCCT + 渲染集成 — 目标 B 可视化

> 把 OCCT 的几何能力接进 Tauri 应用，实现建模 + 渲染闭环。

| # | 项目 | 核心学习点 |
|---|------|-----------|
| 13 | 3D 模型查看器（Tauri + Three.js） | Three.js/WebGPU 渲染、OCCT 网格导出、Rust↔C++ FFI 桥接、相机控制与光照 |
| 14 | 参数化建模桌面应用 | 整合 OCCT 建模 + Three.js 渲染、交互式参数面板、特征历史树 UI |

### 第七阶段：知识库与 Agent — 目标 B 完成

> 为建模工具加上知识管理和 AI 辅助检索。

| # | 项目 | 核心学习点 |
|---|------|-----------|
| 15 | 本地知识库搜索工具 | 全文搜索（如 Tantivy/MeiliSearch）、向量数据库、文本嵌入、知识图谱基础 |
| 16 | AI 辅助检索 Agent | LLM API 对接、RAG（检索增强生成）、对话式交互、Prompt 工程 |
| 17 | 参数化建模 + 知识库集成应用 | 整合建模 + 渲染 + 知识库 + Agent、插件架构、性能优化、产品化打包与分发 |

---

### 技术栈全景

```
UI 层        HTML/CSS/JS → React → Tauri Webview（桌面 + 移动端）
3D 渲染      OCCT 几何输出 → 网格 → Three.js / WebGPU（Tauri 内渲染）
建模内核     OCCT（C++）← 通过 FFI → Rust（Tauri 后端）
后端逻辑     Rust（Tauri 内置）
数据层       SQLite + 向量数据库
AI 层        LLM API + RAG + Embedding
构建工具     CMake（C++/OCCT）+ Cargo（Rust）+ Vite（前端）
工具链       Git/GitHub → CI/CD（全平台构建分发）
```

---

## 写作原则

1. **用自己话写** — 不抄文档，记自己的理解
2. **诚实记录** — 卡住了就写卡住了，不需要包装
3. **设计师语言** — 用设计概念类比技术概念
4. **链接驱动** — journal 是索引，具体内容散落在各处，用链接串联
5. **问题导向** — reflection 不写流水账，围绕遇到的问题复盘
6. **面向未来的自己** — 写给三个月后回头看时的自己
