# Solution-Z 设计方案 v2

## 1. 产品定位

一款跨平台原生行动管理工具，数据模型直接映射 Obsidian vault 格式。App 是编辑入口，vault 是 Obsidian 浏览层。

**核心理念**：areas 是知识领域，goals 是进行中的目标，actions 是原子级时间记录。三者逐层细化，journal 是 actions 的日索引。

**数据层级**：

```
areas（领域）            ← 顶层知识域，如"建筑学"
  └── goals（目标）      ← 进行中的项目，关联到领域
        └── actions（行动）← 原子级时间记录，可同时进行（+ 标记）
              └── journal ← 自动生成的日索引

resources（资源）         ← 外部材料（书/播客/游戏）
notes（笔记）            ← 独立笔记卡片
templates（模板）         ← 行动模板
```

**与 v1 的根本区别**：v1 自创了 domains/verbs/actions 抽象模型，v2 直接采用 vault 已有的 areas/goals/actions/resources/notes/journal 体系。App 的数据库是 vault 格式的结构化镜像，导出时零损耗还原为 Markdown 文件。

***

## 2. 核心数据模型

### 2.1 行动（Action）

行动是系统中最频繁创建的记录，每条对应一段具体活动。

**Vault 文件格式**：

```
文件名：actions/YYYYMMDDHHmmss.md（同时行动用 + 后缀：YYYYMMDDHHmmss+.md）
```

**YAML frontmatter**：

```yaml
---
aliases:
  - 2026-05-13 09:30 🍚 吃饭：拿铁&三明治
action: 🍚 吃饭
content: 拿铁&三明治
start-time: 2026-05-13T09:30:00
end-time: 2026-05-13T09:59:00
tags:
  - 知识/建筑学/中国建筑史
---
```

**字段说明**：

| 字段         | 类型        | 必填 | 说明                                         | 示例                              |
| ---------- | --------- | -- | ------------------------------------------ | ------------------------------- |
| aliases    | string\[] | 是  | 人类可读的显示名，格式：`YYYY-MM-DD HH:mm emoji 动作：内容` | `2026-05-13 09:30 🍚 吃饭：拿铁&三明治` |
| action     | string    | 是  | emoji + 动作名称                               | `🍚 吃饭`、`👾 开发`、`📖 阅读`         |
| content    | string    | 否  | 行动内容，可含 `[[wiki-link]]`                    | `拿铁&三明治` 或 `[[柳肃《营建的文明》]]`      |
| start-time | datetime  | 是  | ISO 8601                                   | `2026-05-13T09:30:00`           |
| end-time   | datetime  | 否  | ISO 8601，进行中的行动可为空                         | `2026-05-13T09:59:00`           |
| tags       | string\[] | 否  | 层级标签                                       | `知识/建筑学/中国建筑史`                  |

**同时行动（Multi-task）**：

文件名加 `+` 后缀（如 `20260513093021+.md`），表示与同时段另一行动并行。frontmatter 格式相同，action/content 不同。

**Body（可选）**：

行动文件正文可包含 Markdown 内容（如编号列表、笔记），导出时保留。

### 2.2 目标（Goal）

目标是一个进行中的项目，关联到某个 area。

**Vault 文件格式**：

```
文件名：goals/YYMMDD 名称.md
```

**YAML frontmatter + body**：

```yaml
---
action: 👾 开发
content: solution-z
start-date: 2026-05-13
end-date:
tags:
  - 技能/程序
---

- [[20260513101358|2026-05-13 10:13 整理：前端技术]]
- [[20260513174230|2026-05-13 17:42 开发：Design-Driven Dev]]
```

**字段说明**：

| 字段         | 类型        | 必填 | 说明           |
| ---------- | --------- | -- | ------------ |
| action     | string    | 是  | emoji + 动作名称 |
| content    | string    | 是  | 目标内容         |
| start-date | date      | 是  | 开始日期         |
| end-date   | date      | 否  | 结束日期，进行中为空   |
| tags       | string\[] | 否  | 层级标签         |

Body 中通过 wiki-link 关联到具体 actions。

### 2.3 领域（Area）

顶层知识域，聚合相关 goals。

**Vault 文件格式**：

```yaml
---
tags:
  - 知识/建筑学
---

# goals

- [[260412 柳肃《营建的文明》]]
```

### 2.4 日志（Journal）

自动生成的日索引，纯 wiki-link 列表。

**Vault 文件格式**：

```
文件名：journal/YYYY-MM-DD.md
```

```markdown
- [[20260513093021|2026-05-13 09:30 🍚 吃饭：拿铁&三明治]]
- [[20260513093021+|2026-05-13 09:30 📖 阅读：柳肃《营建的文明》]]
- [[20260513101358|2026-05-13 10:13 🗂 整理：前端技术]]
```

每行格式：`- [[文件名|aliases 显示名]]`

### 2.5 资源（Resource）

外部材料的轻量存根。

```yaml
---
resource-type: 书
tags:
  - 知识/建筑学/中国建筑史
---
```

| 字段            | 类型        | 说明        |
| ------------- | --------- | --------- |
| resource-type | string    | 书、播客、游戏 等 |
| tags          | string\[] | 层级标签      |

### 2.6 笔记（Note）

独立笔记卡片。

```yaml
---
aliases:
  - 99 面对逆境的"心理路径"
tags:
  - 知识/心理学
---
```

### 2.7 模板（Template）

行动创建的预设模板。

```yaml
---
aliases:
  - 2026-05-13 09:30 早餐：拿铁&三明治
action: 🍚 吃饭
content: 拿铁&三明治
start-time:
end-time:
---
```

### 2.8 预置行动类型（Actions）

系统内置常用行动类型，用户可自定义增删：

| 行动  | emoji | 用途     |
| --- | ----- | ------ |
| 吃饭  | 🍚    | 餐饮     |
| 阅读  | 📖    | 阅读/学习  |
| 整理  | 🗂    | 整理归类   |
| 锻炼  | 🏂    | 运动健身   |
| 听播客 | 👂🏻  | 播客     |
| 开发  | 👾    | 编码开发   |
| 游戏  | 🎮    | 游戏     |
| 洗澡  | 🐳    | 日常     |
| 设计  | 🎨    | UI/UX  |
| 修复  | 🔧    | Bug 修复 |
| 编写  | ✏️    | 写文档    |
| 会议  | 🗣    | 会议沟通   |

### 2.9 数据库 Schema (SQLite)

数据库是 vault 格式的结构化镜像，确保导出时无损还原。

```sql
-- 行动类型定义（emoji + 动作名称）
CREATE TABLE action_types (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)))),
    emoji       TEXT NOT NULL,              -- emoji 字符
    name        TEXT NOT NULL,              -- 动作名称
    UNIQUE(emoji, name)
);

-- 行动（核心实体）
-- 文件名由 start-time 生成：YYYYMMDDHHmmss[+].md
-- is_parallel = TRUE 时文件名加 + 后缀，并关联 parallel_group 中的另一行动
CREATE TABLE actions (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
    action_type_id  TEXT NOT NULL REFERENCES action_types(id),
    content         TEXT NOT NULL,           -- 行动内容，可含 [[wiki-link]]
    start_time      TEXT NOT NULL,           -- ISO 8601 datetime
    end_time        TEXT,                    -- ISO 8601 datetime，进行中为 NULL
    is_parallel     BOOLEAN DEFAULT FALSE,   -- 是否为同时行动（+ 文件）
    parallel_group  TEXT,                    -- 同时行动分组（共享同一 start_time）
    goal_id         TEXT REFERENCES goals(id), -- 关联目标（可选）
    body            TEXT DEFAULT '',         -- Markdown 正文
    sort_order      INTEGER DEFAULT 0,
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);

-- 行动标签
CREATE TABLE action_tags (
    action_id   TEXT NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
    tag         TEXT NOT NULL,              -- 层级标签，如 "知识/建筑学/中国建筑史"
    PRIMARY KEY (action_id, tag)
);

-- 目标
-- 文件名格式：YYMMDD 名称.md
CREATE TABLE goals (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
    action_type_id  TEXT NOT NULL REFERENCES action_types(id),
    content         TEXT NOT NULL,
    start_date      TEXT NOT NULL,           -- ISO 8601 date
    end_date        TEXT,                    -- ISO 8601 date，进行中为 NULL
    area_id         TEXT REFERENCES areas(id),
    body            TEXT DEFAULT '',         -- Markdown 正文（含 wiki-links）
    sort_order      INTEGER DEFAULT 0,
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);

-- 目标标签
CREATE TABLE goal_tags (
    goal_id     TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    tag         TEXT NOT NULL,
    PRIMARY KEY (goal_id, tag)
);

-- 领域
-- 文件名格式：名称.md
CREATE TABLE areas (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)))),
    name        TEXT NOT NULL UNIQUE,
    body        TEXT DEFAULT '',            -- Markdown 正文（含 wiki-links）
    sort_order  INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
);

-- 领域标签
CREATE TABLE area_tags (
    area_id     TEXT NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
    tag         TEXT NOT NULL,
    PRIMARY KEY (area_id, tag)
);

-- 资源
-- 文件名格式：名称.md
CREATE TABLE resources (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
    name            TEXT NOT NULL UNIQUE,
    resource_type   TEXT,                   -- 书、播客、游戏 等
    body            TEXT DEFAULT '',
    sort_order      INTEGER DEFAULT 0,
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);

-- 资源标签
CREATE TABLE resource_tags (
    resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    tag         TEXT NOT NULL,
    PRIMARY KEY (resource_id, tag)
);

-- 笔记
-- 文件名格式：YYYYMMDDHHmmss.md
CREATE TABLE notes (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
    aliases     TEXT NOT NULL,              -- 显示名
    body        TEXT DEFAULT '',
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
);

-- 笔记标签
CREATE TABLE note_tags (
    note_id     TEXT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    tag         TEXT NOT NULL,
    PRIMARY KEY (note_id, tag)
);

-- 模板
-- 文件名格式：actions-描述.md
CREATE TABLE templates (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)))),
    name            TEXT NOT NULL UNIQUE,
    action_type_id  TEXT REFERENCES action_types(id),
    content         TEXT DEFAULT '',
    body            TEXT DEFAULT '',
    created_at      TEXT DEFAULT (datetime('now'))
);

-- 导出记录（追踪哪些数据已导出到 vault）
CREATE TABLE export_log (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,              -- action / goal / area / resource / note / journal
    entity_id   TEXT NOT NULL,
    file_path   TEXT NOT NULL,              -- 相对于 vault 根目录的路径
    exported_at TEXT DEFAULT (datetime('now')),
    checksum    TEXT                        -- 文件内容 hash，用于判断是否需要更新
);

-- 索引
CREATE INDEX idx_actions_start     ON actions(start_time);
CREATE INDEX idx_actions_goal      ON actions(goal_id);
CREATE INDEX idx_actions_parallel  ON actions(parallel_group);
CREATE INDEX idx_goals_area        ON goals(area_id);
CREATE INDEX idx_export_entity     ON export_log(entity_type, entity_id);
CREATE INDEX idx_export_checksum   ON export_log(checksum);
```

***

## 3. 技术架构

### 3.1 技术选型

| 层级       | 技术                                  | 理由                                    |
| -------- | ----------------------------------- | ------------------------------------- |
| 跨平台框架    | **Tauri 2.0**                       | 一套 Rust 核心，同时构建 macOS / iOS / Android |
| 前端       | **Svelte 5**                        | 编译时框架，包体最小，跨平台 UI 一致                  |
| 样式       | **Tailwind CSS 4**                  | 原子化 CSS，响应式布局（桌面/手机自适应）               |
| 数据库      | **SQLite** (via `tauri-plugin-sql`) | 本地优先，零配置，每端独立存储                       |
| 语言       | **TypeScript** + **Rust**           | 前端 TS，后端 Rust                         |
| 构建       | **Vite**                            | 极速 HMR                                |
| 云同步      | **坚果云 WebDAV**                      | SQLite 快照交换                           |
| Vault 导出 | **Rust** 文件系统操作                     | 直接生成 Markdown 文件到 vault 目录            |

### 3.2 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    Tauri 2.0 全平台                          │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 Rust Core（共享）                        │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │ │
│  │  │  Action  │ │   Goal   │ │   Area   │ │  Resource  │  │ │
│  │  │ Commands │ │ Commands │ │ Commands │ │  Commands  │  │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │ │
│  │  │  Note    │ │ Template │ │  WebDAV  │ │  Vault     │  │ │
│  │  │ Commands │ │ Commands │ │  Sync    │ │  Exporter  │  │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │ │
│  │       │                            │            │        │ │
│  │  ┌────▼─────────────────────────────┐  ┌───────▼──────┐ │ │
│  │  │       SQLite (per device)        │  │  Markdown    │ │ │
│  │  │  ~/AppData/solution-z/data.db    │  │  Generator   │ │ │
│  │  └──────────────────────────────────┘  └───────┬──────┘ │ │
│  └─────────────────────────────────────────────────┼────────┘ │
│                          │ IPC                      │        │
│  ┌───────────────────────▼─────────────────────────▼──────┐  │
│  │              Svelte 5 Frontend (WebView)                │  │
│  │  ┌──────────────────┐    ┌───────────────────────────┐  │  │
│  │  │   桌面端布局       │    │      手机端布局            │  │  │
│  │  │  ┌──────┬─────┐  │    │  ┌─────────────────────┐  │  │  │
│  │  │  │ Side │ Main│  │    │  │   Tab Navigation    │  │  │  │
│  │  │  │ bar  │     │  │    │  │  Actions | Goals |  │  │  │  │
│  │  │  └──────┴─────┘  │    │  │  Journal | Areas    │  │  │  │
│  │  └──────────────────┘    │  └─────────────────────┘  │  │  │
│  │                          └───────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   坚果云      │
                    │   WebDAV     │
                    │  snapshot.db │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
     ┌──────────┐   ┌──────────┐   ┌──────────┐
     │  macOS   │   │   iOS    │   │ Android  │
     │  App     │   │   App    │   │  App     │
     └────┬─────┘   └──────────┘   └──────────┘
          │
          │ "导出到 Vault" 按钮
          ▼
   ┌──────────────┐
   │  Obsidian    │
   │  Vault       │
   │  Markdown    │
   └──────────────┘
```

### 3.3 项目目录结构

```
solution-z/
├── src-tauri/                      # Rust 后端（全平台共享）
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── capabilities/
│   └── src/
│       ├── main.rs
│       ├── lib.rs
│       ├── commands/
│       │   ├── mod.rs
│       │   ├── action.rs           # 行动 CRUD
│       │   ├── goal.rs             # 目标 CRUD
│       │   ├── area.rs             # 领域 CRUD
│       │   ├── resource.rs         # 资源 CRUD
│       │   ├── note.rs             # 笔记 CRUD
│       │   ├── template.rs         # 模板 CRUD
│       │   └── sync.rs             # 同步状态查询
│       ├── db/
│       │   ├── mod.rs
│       │   ├── init.rs             # 数据库初始化 & 迁移
│       │   └── models.rs           # 数据结构
│       ├── vault/
│       │   ├── mod.rs
│       │   ├── exporter.rs         # SQLite → Markdown 导出
│       │   ├── markdown.rs         # YAML frontmatter 生成器
│       │   └── journal.rs          # 日志自动生成
│       └── sync/
│           ├── mod.rs
│           ├── webdav.rs           # 坚果云 WebDAV 客户端
│           └── merge.rs            # 快照合并算法
│
├── src/                            # Svelte 前端（全平台共享）
│   ├── app.html
│   ├── app.css
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ActionTimer.svelte       # 行动计时器（核心交互）
│   │   │   ├── ActionList.svelte        # 行动列表（按时间线）
│   │   │   ├── ActionForm.svelte        # 行动编辑表单
│   │   │   ├── GoalList.svelte          # 目标卡片列表
│   │   │   ├── GoalForm.svelte          # 目标编辑
│   │   │   ├── AreaList.svelte          # 领域列表
│   │   │   ├── ResourceList.svelte      # 资源列表
│   │   │   ├── NoteList.svelte          # 笔记列表
│   │   │   ├── JournalView.svelte       # 日志日历视图
│   │   │   ├── TagSelector.svelte       # 层级标签选择器
│   │   │   ├── ActionTypePicker.svelte  # 行动类型选择（emoji grid）
│   │   │   ├── ExportButton.svelte      # "导出到 Vault" 按钮
│   │   │   └── SyncStatus.svelte        # 同步状态指示器
│   │   ├── layouts/
│   │   │   ├── DesktopLayout.svelte     # 桌面三栏布局
│   │   │   └── MobileLayout.svelte      # 手机 Tab 布局
│   │   ├── stores/
│   │   │   ├── actions.ts
│   │   │   ├── goals.ts
│   │   │   ├── areas.ts
│   │   │   ├── resources.ts
│   │   │   ├── notes.ts
│   │   │   ├── sync.ts                 # 同步状态
│   │   │   └── ui.ts                   # UI 状态（平台检测等）
│   │   ├── utils/
│   │   │   ├── date.ts
│   │   │   ├── format.ts              # vault 格式化（aliases 生成等）
│   │   │   └── platform.ts            # 平台检测 & 适配
│   │   └── types/
│       └── index.ts
│   └── routes/
│       └── +layout.svelte
│
├── solution-z-vault/               # Obsidian vault（导出目标）
│   ├── .obsidian/
│   ├── actions/
│   ├── areas/
│   ├── goals/
│   ├── journal/
│   ├── notes/
│   ├── resources/
│   ├── templates/
│   ├── home.components
│   └── ...
│
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── DESIGN.md                       # v1 设计（归档）
└── DESIGN-v2.md                    # 本文件
```

***

## 4. Vault 导出机制

### 4.1 导出按钮工作流

桌面端工具栏的"导出到 Vault"按钮触发以下流程：

```
┌─────────────────────────────────────────────────────────┐
│  导出按钮点击                                             │
│       │                                                  │
│       ▼                                                  │
│  1. 扫描 SQLite 中所有实体                                │
│       │                                                  │
│       ▼                                                  │
│  2. 与 export_log 对比，找出新增/修改/删除                 │
│       │                                                  │
│       ▼                                                  │
│  3. 为每条变更生成 Markdown 文件                           │
│     ├── actions/ → YAML frontmatter + body              │
│     ├── goals/   → YAML frontmatter + body              │
│     ├── areas/   → YAML frontmatter + body              │
│     ├── resources/ → YAML frontmatter + body            │
│     ├── notes/   → YAML frontmatter + body              │
│     ├── templates/ → YAML frontmatter + body            │
│     └── journal/  → 重新生成当天 journal                  │
│       │                                                  │
│       ▼                                                  │
│  4. 写入到 solution-z-vault/ 目录                         │
│       │                                                  │
│       ▼                                                  │
│  5. 更新 export_log（记录 checksum）                      │
│       │                                                  │
│       ▼                                                  │
│  6. 显示导出结果摘要                                      │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Markdown 生成规则

**行动文件生成**：

```rust
// 文件名生成
fn action_filename(action: &Action) -> String {
    let base = format_datetime(action.start_time, "%Y%m%d%H%M%S");
    if action.is_parallel {
        format!("actions/{}+.md", base)
    } else {
        format!("actions/{}.md", base)
    }
}

// aliases 生成
fn action_alias(action: &Action, action_type: &ActionType) -> String {
    let time = format_datetime(action.start_time, "%Y-%m-%d %H:%M");
    format!("{} {} {}:{}", time, action_type.emoji, action_type.name, action.content)
}
```

**Journal 自动生成**：

导出时，自动根据当天所有 actions 生成 `journal/YYYY-MM-DD.md`：

```markdown
- [[20260513093021|2026-05-13 09:30 🍚 吃饭：拿铁&三明治]]
- [[20260513093021+|2026-05-13 09:30 📖 阅读：柳肃《营建的文明》]]
```

生成规则：

1. 取所有 `start_time` 在当天的 actions
2. 按 `start_time` 排序
3. 生成 wiki-link 列表

**增量导出**：

通过 `export_log` 表追踪每条记录的导出状态和内容 checksum。仅导出新增或有变更的记录，避免全量重写。

### 4.3 导出配置

```jsonc
{
  "vault": {
    "path": "/Users/z/Programs/solution-z/solution-z-vault",
    "auto_export": false,       // 不自动导出，需手动按按钮
    "conflict_policy": "app_wins"  // 冲突时以 app 数据为准
  }
}
```

***

## 5. WebDAV 同步方案

### 5.1 同步架构

每台设备独立持有 SQLite 数据库，通过坚果云 WebDAV 交换快照实现多设备同步。

```
┌──────────────┐     PUT (上传快照)     ┌──────────────┐
│  macOS App   │ ────────────────────→ │   坚果云      │
│  data.db     │                       │  WebDAV      │
│              │ ←──────────────────── │  snapshot.db │
└──────────────┘     GET (下载快照)     └──────┬───────┘
                                             │
┌──────────────┐     GET (下载快照)            │
│  iOS App     │ ←────────────────────        │
│  data.db     │     PUT (上传快照) ──────────→│
└──────────────┘                              │
                                             │
┌──────────────┐     GET (下载快照)            │
│  Android App │ ←────────────────────        │
│  data.db     │     PUT (上传快照) ──────────→│
└──────────────┘                       └──────────────┘
```

### 5.2 同步流程

**启动时**：

1. 通过 WebDAV `HEAD` 获取远程快照的 `ETag`
2. 若与本地缓存的 ETag 不同，下载远程快照
3. 合并远程快照到本地数据库（按 `updated_at` 逐行比较，保留较新版本）
4. 将合并后的数据库作为新快照上传

**编辑后**：

1. 保存到本地 SQLite
2. 后台异步上传快照到 WebDAV

**冲突处理**：

- 逐行比较 `updated_at`，保留较新版本
- 同一记录双方都修改过时，保留两端（app 端保留，远程版本记入冲突日志）
- 冲突日志可在设置中查看和手动解决

### 5.3 WebDAV 配置

```jsonc
{
  "sync": {
    "provider": "nutstore",
    "webdav_url": "https://dav.jianguoyun.com/dav/",
    "webdav_path": "/solution-z/snapshot.db",
    "username": "user@example.com",
    "app_password": "xxxx xxxx xxxx xxxx",
    "auto_sync": true,
    "sync_interval_minutes": 5
  }
}
```

***

## 6. UI 设计

### 6.1 桌面端布局

```
┌──────────────────────────────────────────────────────────┐
│  ◉ ◉ ◉    Solution-Z     [导出到 Vault] [↻ 已同步]  ─ □ × │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│  📋 行动    │  🕐 2026-05-13                              │
│  🎯 目标    │  ─────────────                              │
│  📅 日志    │  09:30  🍚 吃饭：拿铁&三明治      09:30-09:59 │
│  📁 领域    │  09:30  📖 阅读：柳肃《营建的文明》  ↑ 同时   │
│  📚 资源    │  10:13  🗂 整理：前端技术          10:13-11:00│
│  📝 笔记    │  14:36  🏂 锻炼：keep            14:36-15:00│
│            │  14:36  👂🏻 听播客：自习室         ↑ 同时     │
│  ──────── │  15:01  🐳 洗澡                  15:01-15:30│
│  ⚙ 设置    │  16:08  👾 开发：Design-Driven    16:08-17:00│
│            │  22:32  🎮 游戏：杀戮尖塔2        22:32-23:00│
│            │                                             │
│            │  ─────────────                              │
│            │  [+ 新行动]  [⏱ 开始计时]                    │
├────────────┴─────────────────────────────────────────────┤
│  ⌘N 新行动  ⌘T 计时器  空格 完成  ⌘E 导出到 Vault         │
└──────────────────────────────────────────────────────────┘
```

### 6.2 手机端布局

```
┌─────────────────────────┐
│  Solution-Z    [⏱] [+]  │
├─────────────────────────┤
│                         │
│  09:30                  │
│  🍚 吃饭：拿铁&三明治    │
│  09:30 - 09:59   29 min │
│                         │
│  09:30  (同时)          │
│  📖 阅读：柳肃《营建...  │
│                         │
│  10:13                  │
│  🗂 整理：前端技术       │
│  10:13 - 11:00   47 min │
│                         │
│  14:36                  │
│  🏂 锻炼：keep          │
│  14:36 - 15:00   24 min │
│                         │
├─────────────────────────┤
│  ⏱行动  🎯目标  📅日志  ⚙│
└─────────────────────────┘
```

### 6.3 核心交互：行动计时器

点击"开始计时"后的流程：

1. **选择行动类型**：弹出 emoji grid（🍚📖🗂🏂👂🏻👾🎮 等）
2. **输入内容**：文本框，支持 `[[` 自动补全 resources
3. **选择标签**（可选）
4. **选择关联目标**（可选）
5. **开始计时**：状态栏显示计时中的行动
6. **结束计时**：点击停止，自动填入 end-time

**同时行动**：

- 计时中再点"开始计时"，新行动自动标记为 parallel
- 文件名生成时加 `+` 后缀

### 6.4 行动快捷输入

桌面端支持快速输入（`⌘+N`）：

```
输入：🍚 吃饭：拿铁&三明治
解析：
  action → 🍚 吃饭
  content → 拿铁&三明治
  start_time → now
  end_time → (进行中)
```

### 6.5 平台适配策略

| 特性        | 桌面端               | 手机端           |
| --------- | ----------------- | ------------- |
| 布局        | 三栏（侧边栏 + 列表 + 详情） | Tab 导航 + 全屏列表 |
| 新增行动      | ⌘N 快捷键 / 按钮       | 浮动 + 按钮       |
| 计时器       | 状态栏常驻             | 顶部 sticky bar |
| 导出按钮      | 工具栏可见             | 隐藏（仅桌面端支持）    |
| WebDAV 同步 | 后台定时              | 前后台切换时触发      |
| 编辑详情      | 右侧面板              | 全屏 modal      |

***

## 7. 实施路线

### Phase 1 — 核心可用（MVP）

**目标**：macOS 桌面端能记录和导出行动

- [ ] Tauri + Svelte 项目脚手架
- [ ] SQLite 数据库初始化与 Schema
- [ ] 行动类型（action\_types）管理
- [ ] 行动 CRUD（Rust commands）
- [ ] 行动计时器 UI（选择类型 → 输入内容 → 计时 → 停止）
- [ ] 行动列表（按时间线展示）
- [ ] Vault 导出功能（"导出到 Vault"按钮）
- [ ] Journal 自动生成
- [ ] macOS 原生窗口配置

### Phase 2 — 目标与领域

**目标**：完整覆盖 vault 所有实体类型

- [ ] 目标（Goal）CRUD + UI
- [ ] 领域（Area）CRUD + UI
- [ ] 资源（Resource）CRUD + UI
- [ ] 笔记（Note）CRUD + UI
- [ ] 模板（Template）管理
- [ ] 层级标签系统
- [ ] wiki-link 关联（行动↔目标↔领域）
- [ ] 行动编辑表单（标签/关联目标/body）

### Phase 3 — 多设备同步

**目标**：手机端可用

- [ ] 手机端响应式 UI（Tab 导航）
- [ ] 坚果云 WebDAV 客户端（Rust）
- [ ] SQLite 快照上传/下载
- [ ] 快照合并算法
- [ ] 同步状态 UI
- [ ] iOS/Android Tauri 构建配置
- [ ] 计时器手机端适配（前后台切换保持计时）

### Phase 4 — 体验打磨

- [ ] 日志日历视图
- [ ] 行动搜索与筛选
- [ ] 深色模式
- [ ] 快捷输入解析
- [ ] 统计面板（时间分布、行动类型分布）
- [ ] 导出增量更新（仅导出变更）
- [ ] 系统托盘 / 快速操作
- [ ] 通知提醒

***

## 8. 数据存储位置

### macOS

```
~/Library/Application Support/solution-z/
├── data.db                  # 主数据库
├── data.db-wal
├── config.json              # 应用配置（含 WebDAV、vault 路径）
└── backups/
    └── data-2026-05-14.db.bak
```

### iOS

```
App Sandbox/Documents/solution-z/
├── data.db
└── config.json
```

### Android

```
App Internal Storage/solution-z/
├── data.db
└── config.json
```

***

## 9. 性能目标

| 指标              | 目标                     |
| --------------- | ---------------------- |
| 冷启动             | < 500ms（桌面）/ < 1s（手机）  |
| 内存占用            | < 30MB（桌面）/ < 50MB（手机） |
| 包体大小            | < 15MB（桌面）/ < 20MB（手机） |
| 行动列表渲染          | 500 条 < 16ms           |
| 计时器启动           | < 50ms                 |
| Vault 导出（100 条） | < 500ms                |
| WebDAV 同步       | < 5s（常规数据量）            |

***

## 10. 开发工具链

```bash
# 环境要求
# - macOS 14+ / Xcode (iOS 构建)
# - Android Studio (Android 构建)
# - Rust (rustup)
# - Node.js 22+
# - pnpm

# 初始化
pnpm create tauri-app solution-z --template svelte-ts

# 桌面开发
pnpm tauri dev

# 桌面构建
pnpm tauri build

# iOS 开发
pnpm tauri ios dev

# iOS 构建
pnpm tauri ios build

# Android 开发
pnpm tauri android dev

# Android 构建
pnpm tauri android build
```

***

## v1 → v2 变更摘要

### 产品定位

| v1                            | v2                                   | 原因                              |
| ----------------------------- | ------------------------------------ | ------------------------------- |
| "macOS 原生级行动管理工具"             | "跨平台行动管理工具 + Obsidian 导出"            | 用户需要在手机端也能编辑                    |
| 自创 domains/verbs/actions 抽象模型 | 直接映射 vault 的 areas/goals/actions 格式  | 依附于现有 vault 组织形式，导出零损耗          |
| 单一数据源（SQLite）                 | SQLite（编辑层）+ Markdown vault（浏览层）双层架构 | vault 是 Obsidian 的领域，app 是编辑的领域 |

### 数据模型

| v1                         | v2                                   | 原因                                       |
| -------------------------- | ------------------------------------ | ---------------------------------------- |
| domains 表（领域）              | areas 表                              | 匹配 vault `areas/` 目录                     |
| verbs 表（行为类型，独立管理）         | action\_types 表（emoji + 动作名称）        | 匹配 vault `action: 🍚 吃饭` 格式，emoji 是一等公民  |
| actions 表（parent\_id 树状嵌套） | actions 表（平铺时间线，is\_parallel 标记同时行动） | 匹配 vault 实际格式——行动按时间戳平铺，不是树状嵌套           |
| notes 表（挂载在 action 下）      | notes 表（独立实体）                        | 匹配 vault `notes/` 目录——笔记是独立文件，不是行动子项     |
| tags + action\_tags 关联表    | 直接在各实体表中用 tag 字段                     | 匹配 vault YAML frontmatter 中 tags 直接列出的格式 |
| 无 journal 概念               | journal 由导出时自动生成                     | 匹配 vault `journal/` 的 wiki-link 索引模式     |
| 无 resource 概念              | resources 表 + resource\_tags         | 匹配 vault `resources/` 目录                 |
| 无 template 概念              | templates 表                          | 匹配 vault `templates/` 目录                 |
| properties JSON 扩展字段       | body TEXT 字段                         | 匹配 vault 文件正文——是 Markdown 内容，不是结构化属性     |

### 技术架构

| v1              | v2                                                            | 原因                  |
| --------------- | ------------------------------------------------------------- | ------------------- |
| 仅 macOS (Tauri) | Tauri 2.0 全平台（macOS + iOS + Android）                          | 用户要求手机端也能编辑         |
| 单端本地存储          | 本地 SQLite + 坚果云 WebDAV 多设备同步                                  | 跨设备数据互通             |
| 无 vault 集成      | Vault 导出模块（exporter + markdown generator + journal generator） | 用户要求"转化按钮"同步到 vault |
| 无导出追踪           | export\_log 表追踪导出状态                                           | 支持增量导出，避免全量重写       |

### UI 设计

| v1                        | v2                                  | 原因                    |
| ------------------------- | ----------------------------------- | --------------------- |
| 侧边栏 + 行为树 + 详情面板          | 侧边栏 + 时间线列表（桌面）/ Tab 导航（手机）         | 行动是时间线，不是树状结构         |
| 快速输入解析（格式：`所属行为 - 行为：内容`） | 快速输入 + 计时器（选择 emoji 类型 → 输入内容 → 计时） | 匹配 vault 的实际录入流程      |
| 行为树展开/折叠/拖拽               | 时间线按日期分组，同时行动并排显示                   | 匹配 vault 的 journal 风格 |
| 无计时功能                     | 核心交互是计时器（开始 → 选择类型 → 输入内容 → 停止）     | 行动的核心场景是实时记录          |
| 无导出按钮                     | 工具栏"导出到 Vault"按钮 + 同步状态指示器          | 用户明确要求                |
| 仅桌面布局                     | 桌面三栏 + 手机 Tab 两种响应式布局               | 跨平台需要                 |
| 笔记是行动子面板                  | 笔记是独立 Tab/页面                        | 笔记是独立实体               |

### 实施路线

| v1                              | v2                                        | 原因                      |
| ------------------------------- | ----------------------------------------- | ----------------------- |
| Phase 1: 全功能 MVP（领域+行为+笔记+快速输入） | Phase 1: 仅行动（行动类型 + 计时器 + 时间线 + vault 导出） | 先打通核心循环：记录行动 → 导出 vault |
| Phase 2: 体验打磨                   | Phase 2: 目标/领域/资源/笔记/模板                   | 补全 vault 所有实体类型         |
| Phase 3: 插件系统                   | Phase 3: 手机端 + WebDAV 同步                  | 跨平台是更高优先级               |
| Phase 4: AI/统计/坚果云              | Phase 4: 统计/搜索/深色模式                       | 体验打磨放最后                 |

