# Solution-Z 任务管理软件设计方案

## 1. 产品定位

一款 macOS 原生级行动管理工具，追求极致简洁与可扩展性。

**核心理念**：领域是大的框架，行为是具体的颗粒。所有信息都是行为的属性，行为上可以链接很多笔记。

**数据层级**：

```
领域 (Domain)           ← 顶层框架，如"智识"、"工作"、"生活"
  └── 行为 (Action)     ← 最小管理单元，可嵌套
        ├── 属性        ← 所有信息都是属性（日期、状态、优先级……）
        └── 笔记        ← 行为上链接的卡片笔记，一条一条记录
```

---

## 2. 核心数据模型

### 2.1 行动（Action）基本格式

```
所属行为 - 行为：内容（开始日期 - 完成日期）
```

| 字段 | 说明 | 示例 |
|------|------|------|
| 所属行为 (Parent) | 上级行为，可为空（顶层行为直接归属领域） | `用户认证模块` |
| 行为 (Verb) | 动作类型 | `开发`、`设计`、`修复`、`阅读` |
| 内容 (Content) | 具体要做的事 | `实现用户登录` |
| 开始日期 (Start) | 何时开始 | `2026-05-12` |
| 结束日期 (Due) | 何时结束 | `2026-05-15` |

**嵌套示例**：

```
领域：智识

Solution-Z - 开发：用户认证模块（2026-05-12 - 2026-05-20）
  └── 用户认证模块 - 开发：实现 OAuth 登录（2026-05-12 - 2026-05-15）
  └── 用户认证模块 - 设计：登录页面原型（2026-05-13 - 2026-05-14）
  └── 用户认证模块 - 修复：Token 刷新 Bug（2026-05-16 - 2026-05-17）

阅读计划 - 阅读：《重构》第3章（2026-05-13 - 2026-05-13）
健身计划 - 执行：5公里跑步（2026-05-12 - 2026-05-12）
```

### 2.2 数据库 Schema (SQLite)

```sql
-- 领域（顶层框架）
-- 系统内置"收集箱"领域（id='_inbox'），作为快速输入的默认归属
-- 收集箱在侧边栏单独显示（与"今天""近7天"并列），不列在"领域"分组下
CREATE TABLE domains (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)))),
    name        TEXT NOT NULL UNIQUE,
    color       TEXT DEFAULT '#4A90D9',
    icon        TEXT DEFAULT '📁',
    sort_order  INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
);

-- 行为类型（动词模板，可自定义扩展）
-- 禁止删除仍被 actions 引用的 verb，UI 层做引用检查
CREATE TABLE verbs (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)))),
    name        TEXT NOT NULL UNIQUE,
    icon        TEXT DEFAULT '⚡',
    sort_order  INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now'))
);

-- 行为（核心实体，树状结构）
-- domain_id NOT NULL：所有行为必须归属一个领域，快速输入默认归入"收集箱"
-- parent_id NULL 表示该行为是其所属领域的顶层行为
CREATE TABLE actions (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
    domain_id   TEXT NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    parent_id   TEXT REFERENCES actions(id) ON DELETE CASCADE,
    verb_id     TEXT NOT NULL REFERENCES verbs(id) ON DELETE RESTRICT,
    content     TEXT NOT NULL,
    start_date  TEXT,                      -- ISO 8601 date，开始日期
    due_date    TEXT,                      -- ISO 8601 date，结束日期
    status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done', 'cancelled')),
    priority    INTEGER DEFAULT 0,         -- 0=none, 1=low, 2=medium, 3=high
    sort_order  INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now')),
    completed_at TEXT,                     -- 真正完成的时刻（status=done 时设置）

    -- 可扩展属性（JSON），注意：其中的关联 ID（如 blocks）不受 FK 约束，
    -- 删除/归档行为时需在应用层清理悬空引用
    properties  TEXT DEFAULT '{}'
);

-- 笔记（卡片式，链接到行为）
CREATE TABLE notes (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
    action_id   TEXT NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,              -- Markdown 格式
    sort_order  INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
);

-- 标签（跨行为标记）
CREATE TABLE tags (
    id    TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)))),
    name  TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#888888'
);

-- 行为-标签关联
CREATE TABLE action_tags (
    action_id TEXT NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
    tag_id    TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (action_id, tag_id)
);

-- 索引
CREATE INDEX idx_actions_domain  ON actions(domain_id);
CREATE INDEX idx_actions_parent  ON actions(parent_id);
CREATE INDEX idx_actions_status  ON actions(status);
CREATE INDEX idx_actions_due     ON actions(due_date);
CREATE INDEX idx_actions_start   ON actions(start_date);
CREATE INDEX idx_notes_action    ON notes(action_id);
```

### 2.3 行为的属性系统

每个行为都有固定属性 + 可扩展属性。`properties` JSON 字段支持任意扩展：

```jsonc
// 示例：一个开发行为的 properties
{
  "estimate_hours": 4,
  "assignee": "z",
  "git_branch": "feat/oauth-login",
  "blocks": ["action_abc123"]     // 关联的其他行为 ID
}
```

**固定属性**（数据库列）：

| 属性 | 类型 | 说明 |
|------|------|------|
| status | enum | pending / in_progress / done / cancelled |
| priority | int | 0=none, 1=low, 2=medium, 3=high |
| start_date | date | 开始日期 |
| due_date | date | 结束日期 |
| verb_id | ref | 行为类型（开发/设计/修复……） |
| parent_id | ref | 所属行为（树状嵌套） |

### 2.4 预置行为类型（Verbs）

系统初始化时预置常用动词，用户可自行增删：

| 行为 | 图标 | 用途 |
|------|------|------|
| 完成 | ✅ | 通用完成任务 |
| 开发 | 💻 | 编码开发 |
| 设计 | 🎨 | UI/UX 设计 |
| 修复 | 🔧 | Bug 修复 |
| 阅读 | 📖 | 阅读/学习 |
| 编写 | ✏️ | 写文档/文章 |
| 会议 | 🗣 | 会议沟通 |
| 执行 | 🏃 | 执行某事 |
| 审核 | 👁 | 审核检查 |
| 发布 | 🚀 | 发布部署 |

### 2.5 笔记系统

每个行为可以链接多条卡片笔记：

```
行为：开发 - 用户认证模块
  ├── 笔记 #1：调研了 OAuth 2.0 PKCE 流程，推荐使用 Authorization Code Grant...
  ├── 笔记 #2：Apple Sign-In 需要后端验证 identity token，注意 JWT 解析...
  └── 笔记 #3：参考了 Auth0 的最佳实践文档，关键点如下...
```

笔记特性：
- **Markdown 格式**：支持标题、列表、代码块、链接
- **独立排序**：每条笔记可拖拽排序
- **时间线**：按创建时间排列，形成决策日志

---

## 3. 技术架构

### 3.1 技术选型

| 层级 | 技术 | 理由 |
|------|------|------|
| 桌面框架 | **Tauri 2.0** | Rust 核心，内存占用 ~10MB（对比 Electron ~200MB），原生 macOS 体验 |
| 前端 | **Svelte 5** | 编译时框架，包体最小，无虚拟 DOM 开销，语法简洁 |
| 样式 | **Tailwind CSS 4** | 原子化 CSS，快速构建一致性 UI |
| 数据库 | **SQLite** (via Tauri 插件 `tauri-plugin-sql`) | 本地优先，零配置，单文件存储 |
| 语言 | **TypeScript** + **Rust** | 前端 TS 类型安全，后端 Rust 高性能 |
| 构建 | **Vite** | 极速 HMR，Svelte 官方推荐 |

### 3.2 架构图

```
┌─────────────────────────────────────────────────┐
│                  macOS Desktop                   │
│  ┌───────────────────────────────────────────┐   │
│  │          Tauri 2.0 (Rust Core)            │   │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐  │   │
│  │  │ Window  │ │  System  │ │  Plugin   │  │   │
│  │  │ Manager │ │  Tray    │ │  Host     │  │   │
│  │  └─────────┘ └──────────┘ └─────┬─────┘  │   │
│  │       │                          │        │   │
│  │  ┌────▼──────────────────────────▼─────┐  │   │
│  │  │          Command Layer (Rust)        │  │   │
│  │  │  domain/verb/action/note commands    │  │   │
│  │  └──────────────┬──────────────────────┘  │   │
│  │                 │                          │   │
│  │  ┌──────────────▼──────────────────────┐  │   │
│  │  │         SQLite (local-first)         │  │   │
│  │  │   ~/Library/Application Support/     │  │   │
│  │  │         solution-z/actions.db        │  │   │
│  │  └─────────────────────────────────────┘  │   │
│  └───────────────────────────────────────────┘   │
│                      │ IPC                       │
│  ┌───────────────────▼───────────────────────┐   │
│  │         Svelte 5 Frontend (WebView)        │   │
│  │  ┌─────────┐ ┌────────┐ ┌──────────────┐  │   │
│  │  │ Sidebar │ │ Action │ │   Detail     │  │   │
│  │  │ Domains │ │  Tree  │ │   Panel      │  │   │
│  │  └─────────┘ └────────┘ └──────────────┘  │   │
│  │  ┌──────────────────────────────────────┐  │   │
│  │  │          Quick Entry Bar             │  │   │
│  │  └──────────────────────────────────────┘  │   │
│  └───────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 3.3 项目目录结构

```
solution-z/
├── src-tauri/                  # Rust 后端
│   ├── Cargo.toml
│   ├── tauri.conf.json         # Tauri 配置
│   ├── capabilities/           # 权限配置
│   └── src/
│       ├── main.rs             # 入口
│       ├── lib.rs              # 模块注册
│       ├── commands/
│       │   ├── mod.rs
│       │   ├── domain.rs       # 领域 CRUD
│       │   ├── verb.rs         # 行为类型 CRUD
│       │   ├── action.rs       # 行为 CRUD（含树状操作）
│       │   ├── note.rs         # 笔记 CRUD
│       │   └── plugin.rs       # 插件管理
│       ├── db/
│       │   ├── mod.rs
│       │   ├── init.rs         # 数据库初始化 & 迁移
│       │   └── models.rs       # 数据结构
│       └── plugins/
│           ├── mod.rs
│           └── host.rs         # 插件运行时
│
├── src/                        # Svelte 前端
│   ├── app.html
│   ├── app.css
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Sidebar.svelte          # 领域导航
│   │   │   ├── ActionTree.svelte       # 行为树（可展开嵌套）
│   │   │   ├── ActionItem.svelte       # 单条行为
│   │   │   ├── ActionDetail.svelte     # 行为详情面板
│   │   │   ├── NoteList.svelte         # 笔记卡片列表
│   │   │   ├── NoteCard.svelte         # 单条笔记卡片
│   │   │   ├── QuickEntry.svelte       # 快速输入栏
│   │   │   ├── DomainModal.svelte      # 领域编辑弹窗
│   │   │   └── Settings.svelte         # 设置页
│   │   ├── stores/
│   │   │   ├── domains.ts              # 领域状态
│   │   │   ├── actions.ts              # 行为状态（含树状结构）
│   │   │   ├── notes.ts                # 笔记状态
│   │   │   └── ui.ts                   # UI 状态
│   │   ├── utils/
│   │   │   ├── date.ts                 # 日期处理
│   │   │   └── format.ts              # 格式化（行动格式解析）
│   │   └── types/
│   │       └── index.ts                # TypeScript 类型定义
│   └── routes/
│       └── +layout.svelte              # 主布局
│
├── static/                     # 静态资源
│   └── icons/
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
└── DESIGN.md                   # 本文件
```

---

## 4. UI 设计

### 4.1 布局结构

```
┌──────────────────────────────────────────────────────┐
│  ◉ ◉ ◉    Solution-Z              ─ □ ×  macOS 标题栏 │
├────────────┬─────────────────────┬───────────────────┤
│            │                     │                   │
│  📥 收集箱   │  Solution-Z         │  行动详情          │
│  📅 今天    │  ─────────────       │  ────────────     │
│  📆 近7天   │  🔍 搜索行动...       │  开发：用户认证模块  │
│            │                     │                   │
│  领域       │  + 快速添加行动...    │  领域：Solution-Z  │
│  📆 近7天   │  🔍 搜索行动...       │  开发：用户认证模块  │
│            │                     │                   │
│  领域       │  + 快速添加行动...    │  领域：Solution-Z  │
│  📁 智识    │  ─────────────       │  状态：进行中 ●     │
│  📁 工作    │  ▼ 开发：认证模块    │  优先级：🔴 高      │
│  📁 生活    │    ☐ 开发：OAuth登录 │                   │
│  📁 健康    │    ☐ 设计：登录页面  │  开始：2026-05-12  │
│            │  ☐ 设计：首页原型    │  结束：2026-05-20  │
│            │     05/13 → 05/14   │                   │
│            │  ☑ 修复：Token Bug   │  ── 笔记 ──────    │
│            │     05/10 ✓ 05/11   │  📝 OAuth 2.0 调研  │
│            │                     │  📝 Apple Sign-In   │
│            │                     │  📝 Auth0 最佳实践   │
│            │                     │  + 添加笔记...      │
├────────────┴─────────────────────┴───────────────────┤
│  ⌘N 新建  ⌘K 快速添加  空格 完成切换  ⇧⌘D 新建领域      │
└──────────────────────────────────────────────────────┘
```

### 4.2 快速输入解析

快速输入栏支持自然语言解析，自动识别行动格式：

```
输入：认证模块 - 开发：实现 OAuth 登录（5/12 - 5/15）
解析：
  所属行为 → 认证模块（自动匹配或创建）
  行为 → 开发
  内容 → 实现 OAuth 登录
  开始 → 2026-05-12
  结束 → 2026-05-15

输入：阅读《重构》第3章
解析（默认值）：
  所属行为 → 无（收集箱领域，默认）
  行为 → 完成（默认）
  内容 → 阅读《重构》第3章
  日期 → 今天
```

### 4.3 视图模式

| 视图 | 说明 |
|------|------|
| 收集箱 | 内置领域 `_inbox`，快速输入的默认归属，显示为侧边栏独立入口 |
| 今天 | `start_date <= today` 或 `due_date = today` 的行动 |
| 近 7 天 | 未来 7 天内结束的行动 |
| 领域 | 按领域分组，行为按树状展示 |
| 已完成 | 所有已完成行动（归档） |

### 4.4 行为树交互

行为列表支持树状展开/折叠：

- **▶ 箭头**：展开/收起子行为
- **缩进层级**：视觉上表达所属关系
- **拖拽**：将行为拖入另一个行为（成为其子行为）
- **面包屑**：详情面板顶部显示 `智识 > Solution-Z > 用户认证模块`

### 4.5 笔记卡片交互

详情面板底部的笔记区域：

- **+ 添加笔记**：创建空白卡片，自动获取焦点
- **内联编辑**：直接在卡片内编辑 Markdown
- **拖拽排序**：调整笔记顺序
- **折叠/展开**：长笔记可折叠为摘要

### 4.6 交互规范

- **全局快捷键** `⌘+K`：唤起快速输入栏，随时添加行动
- **回车**：打开选中行为的详情面板
- **空格**：快速切换完成状态
- **Tab / Shift+Tab**：缩进/减少缩进（调整所属行为层级）
- **拖拽**：调整行为排序 / 嵌入其他行为
- **右键菜单**：快捷操作（完成、删除、修改日期、移动领域）
- **侧边栏折叠**：`⌘+\` 切换侧边栏显示

---

## 5. 扩展系统

### 5.1 扩展机制设计

采用 **命令钩子（Command Hooks）+ 事件总线** 的插件架构：

```
┌─────────────────────────────────────┐
│          Plugin Host (Rust)          │
│                                      │
│  Hooks:                              │
│    on_action_created(action)         │
│    on_action_completed(action)       │
│    on_action_updated(action)         │
│    on_note_created(action, note)     │
│    on_domain_created(domain)         │
│    on_app_startup()                  │
│                                      │
│  API:                                │
│    plugin.actions.query(filter)      │
│    plugin.actions.create(data)       │
│    plugin.actions.children(id)       │
│    plugin.notes.list(action_id)      │
│    plugin.notes.create(action_id, …) │
│    plugin.domains.list()             │
│    plugin.ui.notify(message)         │
│    plugin.ui.register_view(id)       │
│    plugin.storage.get(key)           │
│    plugin.storage.set(key, val)      │
└─────────────────────────────────────┘
```

### 5.2 插件清单 (manifest.json)

```jsonc
{
  "id": "com.solution-z.calendar-sync",
  "name": "日历同步",
  "version": "1.0.0",
  "description": "将行动同步到 Apple Calendar",
  "permissions": ["actions:read", "actions:write", "system:calendar"],
  "hooks": {
    "on_action_created": "src/sync-to-calendar.js",
    "on_action_updated": "src/update-calendar-event.js"
  },
  "settings": {
    "calendarName": {
      "type": "string",
      "default": "Solution-Z",
      "label": "目标日历"
    }
  }
}
```

### 5.3 规划中的扩展

| 插件 | 功能 |
|------|------|
| **日历同步** | 双向同步 Apple Calendar |
| **番茄计时** | 行为关联番茄钟 |
| **统计报表** | 行为完成趋势、领域时间分布 |
| **快捷指令** | macOS Shortcuts 集成 |
| **坚果云同步** | 通过 WebDAV 同步到坚果云，多设备协同 |
| **自然语言** | AI 辅助行动解析 |
| **导出笔记** | 将行为笔记导出为 Markdown 文件 |

---

## 6. 实施路线

### Phase 1 — 核心可用（MVP）

**目标**：能添加、管理、完成行动

- [ ] Tauri + Svelte 项目脚手架
- [ ] SQLite 数据库初始化与基础 Schema
- [ ] 领域 CRUD 命令（Rust）
- [ ] 行为类型（Verb）管理
- [ ] 行为 CRUD 命令，含树状嵌套操作（Rust）
- [ ] 笔记 CRUD 命令（Rust）
- [ ] 主界面三栏布局（侧边栏 / 行为树 / 详情面板）
- [ ] 快速输入栏与格式解析
- [ ] 今天 / 近 7 天 / 收集箱视图
- [ ] 行为完成状态切换
- [ ] 笔记卡片添加与编辑
- [ ] macOS 原生窗口配置（标题栏、快捷键）

### Phase 2 — 体验打磨

**目标**：像滴答清单一样顺滑

- [ ] 键盘导航全覆盖
- [ ] 行为树拖拽排序与层级调整
- [ ] 系统托盘与全局快捷键
- [ ] 深色模式
- [ ] 行为搜索与筛选
- [ ] 标签系统
- [ ] 通知提醒（到期提醒）
- [ ] 数据导入/导出
- [ ] 面包屑导航（行为路径）

### Phase 3 — 扩展生态

**目标**：插件系统上线

- [ ] 插件运行时（Plugin Host）
- [ ] 插件 API 与权限模型
- [ ] 插件管理界面（安装/卸载/配置）
- [ ] 第一批官方插件（日历同步、番茄钟）
- [ ] 插件开发文档

### Phase 4 — 增值功能

- [ ] AI 自然语言行动解析
- [ ] 统计与报表面板
- [ ] 坚果云同步（WebDAV）
- [ ] Menu Bar 快捷模式
- [ ] Focus Mode（专注模式）
- [ ] 笔记导出为 Markdown 文件

---

## 7. 技术细节

### 7.1 macOS 原生集成

```jsonc
// tauri.conf.json 关键配置
{
  "app": {
    "windows": [{
      "title": "Solution-Z",
      "width": 960,
      "height": 640,
      "minWidth": 720,
      "minHeight": 480,
      "decorations": true,
      "transparent": false,
      "titleBarStyle": "Overlay"
    }],
    "trayIcon": {
      "iconPath": "icons/icon.png",
      "iconAsTemplate": true
    }
  }
}
```

### 7.2 快速输入解析规则

```typescript
// 格式：所属行为 - 行为：内容（开始日期 - 完成日期）
const ACTION_PATTERN =
  /^(?<parent>[^-]+?)\s*-\s*(?<verb>[^：:]+)[：:]\s*(?<content>[^（(]+)[（(]\s*(?<start>[^)-]+)\s*-\s*(?<due>[^)）]+)[)）]$/;

// 简写格式：内容（仅内容，其余默认）
const SIMPLE_PATTERN = /^(?<content>.+)$/;

// 日期解析：支持 5/12、05-12、2026-05-12、today、tomorrow、今天、明天
function parseDate(input: string): string {
  const s = input.trim().toLowerCase();
  if (s === 'today' || s === '今天') return today();
  if (s === 'tomorrow' || s === '明天') return tomorrow();
  // ... 更多日期格式
}
```

### 7.3 行为树查询

```sql
-- 获取某个领域下的完整行为树（递归 CTE）
WITH RECURSIVE action_tree AS (
    SELECT id, domain_id, parent_id, verb_id, content, status,
           start_date, due_date, priority, sort_order, 0 AS depth
    FROM actions
    WHERE domain_id = ? AND parent_id IS NULL
  UNION ALL
    SELECT a.id, a.domain_id, a.parent_id, a.verb_id, a.content, a.status,
           a.start_date, a.due_date, a.priority, a.sort_order, at.depth + 1
    FROM actions a
    JOIN action_tree at ON a.parent_id = at.id
)
SELECT * FROM action_tree ORDER BY depth, sort_order;
```

### 7.4 数据存储位置

```
~/Library/Application Support/solution-z/
├── actions.db             # 主数据库
├── actions.db-wal         # WAL 日志
├── config.json            # 应用配置
├── plugins/               # 已安装插件
│   └── com.example.plugin/
│       ├── manifest.json
│       └── src/
└── backups/               # 自动备份
    └── actions-2026-05-12.db.bak
```

### 7.5 坚果云同步方案

坚果云提供 WebDAV 接口，用于跨设备同步数据库。

**同步策略：快照 + WebDAV**

SQLite 数据库文件不适合直接被云盘实时同步（WAL 日志会导致文件损坏）。采用快照导出方案：

```
┌──────────────┐     PUT (上传快照)     ┌──────────────┐
│  本地设备 A   │ ────────────────────→ │   坚果云      │
│  actions.db  │                       │  WebDAV      │
│              │ ←──────────────────── │  /solution-z/ │
└──────────────┘     GET (下载快照)     │  snapshot.db │
                                     └──────────────┘
┌──────────────┐     GET (下载快照)     ┌──────────────┐
│  本地设备 B   │ ←──────────────────── │              │
│  actions.db  │     PUT (上传快照) ──→ │              │
└──────────────┘                       └──────────────┘
```

**同步流程**：

1. **启动时**：通过 WebDAV 获取远程快照的 `ETag`，若与本地不同则下载并合并
2. **合并算法**：按 `updated_at` 时间戳，逐行为比较，保留较新的版本
3. **关闭/定时**：将本地数据库导出为快照，通过 WebDAV `PUT` 上传
4. **冲突处理**：无法自动合并时保留双版本，提示用户手动选择

**WebDAV 配置**（用户在设置中填写）：

```jsonc
{
  "sync": {
    "provider": "nutstore",
    "webdav_url": "https://dav.jianguoyun.com/dav/",
    "webdav_path": "/solution-z/snapshot.db",
    "username": "user@example.com",
    "app_password": "xxxx xxxx xxxx xxxx",  // 坚果云第三方应用密码
    "auto_sync": true,
    "sync_interval_minutes": 5
  }
}
```

---

## 8. 性能目标

| 指标 | 目标 |
|------|------|
| 冷启动 | < 500ms |
| 内存占用 | < 30MB |
| 包体大小 | < 15MB |
| 行为列表渲染 | 1000 条 < 16ms |
| 快速输入响应 | < 50ms |
| 数据库操作 | < 10ms |
| 行为树展开 | < 50ms（任意深度） |

---

## 9. 开发工具链

```bash
# 环境要求
# - macOS 14+
# - Rust (rustup)
# - Node.js 22+
# - pnpm

# 初始化
pnpm create tauri-app solution-z --template svelte-ts

# 开发
pnpm tauri dev

# 构建
pnpm tauri build

# 构建 DMG
pnpm tauri build --bundles dmg
```
