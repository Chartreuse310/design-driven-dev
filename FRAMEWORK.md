# Design-Driven Dev - 仓库框架

> 一个设计师学习全栈技术，从设计到落地的完整记录。

---

## 核心循环

```
行动 (actions/)
  ↓ 学习 → 记笔记 → 踩坑 → 解决 → 复盘
记录 (journal/)
  ↓ 每日索引，链接到当前行动
新行动 (actions/) ...
```

每个行动文档自包含：目标 → 笔记 → 踩坑 → 复盘。journal 是每日索引，链接到正在进行的行动。

---

## 目录结构

```
design-driven-dev/
├── design-driven-dev-vault/           # Obsidian 库（gitignored，编辑区）
│   ├── .obsidian/
│   ├── actions/                       # 与根目录 actions/ 镜像
│   ├── journal/                       # 与根目录 journal/ 镜像
│   └── resources/                     # 与根目录 resources/ 镜像
│
├── src/                               # Astro 站点源码
│   ├── layouts/Base.astro
│   ├── lib/content.ts                 # 读取 .md 并渲染
│   └── pages/                         # 页面路由
│
├── actions/                           # 行动（git-tracked）
│   ├── 001-solution-z.md
│   └── ...
│
├── journal/                           # 日记（git-tracked）
│   └── YYYY-MM-DD.md
│
└── resources/                         # 参考资料（git-tracked）
    └── solution-z/
```

---

## 工作流程

```
Obsidian 库（本地编辑）  →  同步  →  仓库根目录（git-tracked）  →  Astro 构建
```

1. **编辑**：在 Obsidian 中打开 `design-driven-dev-vault/`，用 wiki-link `[[...]]` 撰写内容
2. **同步**：说「提交当前更新」→ 将 vault 内容同步到仓库根目录，同时将 wiki-link 转换为标准 markdown link
3. **发布**：Astro 读取根目录的 `.md` 文件，生成静态站点

### 同步规则

- vault 新文件 → 复制到对应根目录
- vault 已修改文件 → 覆盖根目录版本
- vault 中已删除 → 确认后删除根目录对应文件
- 仅存在于根目录的文件 → 不动
- 不同步 `.obsidian/` 元数据
- 链接转换：`[[path/to/file]]` → `[file](path/to/file.md)`

---

## 各目录职责

### `actions/` - 行动

采用 Solution-Z 风格的链式结构：大行动（长期目标）包含小行动（短期阶段）。每个行动文档自包含完整的学习过程。

**大行动**（`NNN-name.md`）：一个长期目标，包含子行动列表。
**小行动**（`NNN-MM-name.md`）：大行动下的一个阶段，有明确终点。

每个行动包含：
- **目标**：要达成什么
- **为什么**：为什么现在做这个
- **完成标准**：做到什么程度算完成
- **笔记**：学习过程中的知识记录（内联）
- **踩坑记录**：症状 → 原因 → 解决 → 教训（内联）
- **复盘**：行动完成后的反思（内联）

### `journal/` - 每日记录

每天一个文件，记录当天的行为和思考。核心机制是**链接**——把当天在行动中的进展串起来。

### `resources/` - 参考资料

外部资源收集：设计文档、技术分析等。

---

## 技术栈

- **编辑**：Obsidian（本地 vault）
- **构建**：Astro 6 + marked
- **托管**：静态站点（Vercel / GitHub Pages）

---

## 实战路线

两个大行动：

- **001 - Solution-Z** → [001-solution-z](/actions/001-solution-z)
- **002 - 3D 建筑可视化** → [002-architecture-viz](/actions/002-architecture-viz)

---

## 写作原则

1. **用自己话写** — 不抄文档，记自己的理解
2. **诚实记录** — 卡住了就写卡住了，不需要包装
3. **设计师语言** — 用设计概念类比技术概念
4. **链接驱动** — journal 是索引，行动是内容，用链接串联
5. **问题导向** — 复盘围绕遇到的问题，不写流水账
6. **面向未来的自己** — 写给三个月后回头看时的自己
