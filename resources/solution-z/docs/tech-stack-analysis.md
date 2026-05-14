# Solution-Z 技术栈分析报告

基于 [DESIGN.md](../DESIGN.md) 中的技术选型，对桌面框架、前端框架、样式方案、数据存储四个维度进行技术栈对比分析。

---

## 1. 桌面框架

### 候选方案

| 维度 | **Tauri 2.0** (推荐) | **Electron** | **WRY 原生** |
|------|------|----------|-----------|
| 核心语言 | Rust | Node.js (C++) | Rust |
| 包体大小 | 3–10 MB | 120–200 MB | 3–5 MB |
| 内存占用 | 40–150 MB | 200–500+ MB | 30–80 MB |
| 启动时间 | 0.3–1s | 2–4s | 0.2–0.5s |
| 渲染引擎 | 系统 WebView | 内嵌 Chromium | 系统 WebView |
| CPU 空闲 | <1% | 1–5% | <1% |
| 电池影响 | 极低 | 显著 | 极低 |
| macOS 原生集成 | 优秀（Swift 插件） | 一般 | 优秀 |
| 插件生态 | 快速增长中 | 成熟庞大 | 几乎无 |
| 跨平台 | macOS/Windows/Linux/iOS/Android | macOS/Windows/Linux | macOS/Windows/Linux |
| 生态成熟度 | 生产可用（v2.9.6），文档仍在追赶 | 非常成熟，VS Code/Slack 等生产验证 | 实验性 |
| Node.js 依赖 | 不需要 | 内置 | 不需要 |

### 分析

**Tauri 2.0** 在 Solution-Z 场景下是最佳选择：

- **性能目标高度契合**：DESIGN.md 要求冷启动 < 500ms、内存 < 30MB、包体 < 15MB — Tauri 全部满足，Electron 仅内存一项就超标 6–15 倍
- **Rust 后端天然适配**：任务管理涉及树状递归查询、数据同步、插件沙箱 — Rust 的性能和安全性是理想选择
- **macOS 原生体验**：`titleBarStyle: Overlay`、系统托盘、全局快捷键等均有良好支持
- **SQLite 集成**：通过 `tauri-plugin-sql` 直接访问本地文件系统中的 SQLite，无 IPC 开销
- **安全模型**：Tauri 的权限系统（capabilities）比 Electron 的全量 Node.js 访问更安全，对插件系统至关重要

**风险点**：
- 插件生态虽在增长，但与 Electron 的 npm 生态相比仍有差距
- 部分高级原生功能（如 Touch Bar、Stage Manager）需手写 Swift 插件
- 文档在某些边缘场景不够完善

**结论**：**保持 Tauri 2.0 选型**。唯一需要关注的是 Rust 后端的学习曲线，但 DESIGN.md 已明确 Rust 为后端语言。

---

## 2. 前端框架

### 候选方案

| 维度 | **Svelte 5** (推荐) | **React 19** | **Vue 3** | **SolidJS** |
|------|------|----------|--------|---------|
| 范式 | 编译时响应式 | 虚拟 DOM | 虚拟 DOM + Proxy | 细粒度响应式 |
| 包体大小 (runtime) | ~2–5 KB | ~45 KB | ~35 KB | ~7 KB |
| 运行时性能 | 优秀（无 VDOM） | 一般（VDOM diff） | 良好 | 优秀（无 VDOM） |
| 语法复杂度 | 最低 | 中等 | 中等 | 中等（类似 React） |
| TypeScript 支持 | 优秀 | 优秀 | 优秀 | 优秀 |
| 组件库生态 | 较小但增长中 | 庞大 | 丰富 | 较小 |
| 社区规模 | 快速增长 | 最大（40%+ 市占） | 大 | 小但活跃 |
| 开发者满意度 | 最高之一 | 一般 | 高 | 最高之一 |
| Tauri 集成 | 官方模板支持 | 官方模板支持 | 官方模板支持 | 社区支持 |
| 学习曲线 | 平缓 | 中等 | 中等 | 中等 |
| 状态管理 | 内置（$state/$derived） | 需外部库 | 内置（ref/reactive） | 内置（createSignal） |

### 分析

**Svelte 5** 在 Solution-Z 场景下的优势：

- **编译时框架**：无运行时开销，直接生成 DOM 操作代码 — 渲染 1000 条行为 < 16ms 的目标更容易达成
- **最小包体**：Tauri 的 WebView 加载更快，对冷启动 500ms 目标有直接贡献
- **语法最简洁**：`$state`、`$derived`、`$effect` 等 runes API 学习成本极低，适合个人项目快速迭代
- **Tauri 官方模板**：`pnpm create tauri-app --template svelte-ts` 开箱即用

**为什么不选其他**：
- **React**：VDOM 开销在行为树（嵌套结构、频繁更新）场景下是劣势；包体大影响 Tauri 加载速度；Hooks 心智负担对个人项目无必要
- **Vue 3**：性能和生态平衡好，但编译时优化不如 Svelte 彻底；对个人项目而言 Vue 的"全家桶"选择反成负担
- **SolidJS**：性能与 Svelte 5 接近，但生态更小、Tauri 集成需额外配置、语法对不熟悉 React 的开发者有学习成本

**风险点**：
- Svelte 组件库（如 Skeleton UI、shadcn-svelte）不如 React 丰富，部分 UI 组件可能需要自建
- Svelte 5 的 runes 是重大 API 变更，部分第三方库尚未适配

**结论**：**保持 Svelte 5 选型**。个人项目、性能优先、Tauri 集成 — 三者共同指向 Svelte 5。

---

## 3. 样式方案

### 候选方案

| 维度 | **Tailwind CSS 4** (推荐) | **UnoCSS** | **CSS Modules** | **Vanilla CSS** |
|------|------|---------|------------|-----------|
| 构建引擎 | Rust (Oxide) | 正则匹配 | 原生 | 无 |
| 构建速度 | 极快 | 最快 | 快 | 无 |
| 输出体积 | 小（tree-shake） | 小（tree-shake） | 最小（手写） | 取决于开发者 |
| 开发效率 | 极高 | 极高 | 中等 | 低 |
| 设计系统 | 内置（色板/间距/排版） | 可配置 | 无 | 无 |
| 暗色模式 | `dark:` 前缀 | `dark:` 前缀 | 手动切换 | 手动切换 |
| 响应式 | `md:` 前缀 | `md:` 前缀 | 手动媒体查询 | 手动媒体查询 |
| 框架依赖 | 无 | 无 | 需构建工具支持 | 无 |
| 一致性 | 强（约束性工具类） | 强（可自定义规则） | 取决于规范 | 取决于团队 |
| 与 Svelte 集成 | 优秀 | 优秀 | 优秀 | 原生 |

### 分析

**Tailwind CSS 4** 的优势：

- **v4 Rust 引擎**：构建速度大幅提升，与 Vite + Svelte 配合几乎零等待
- **内置设计系统**：色彩、间距、排版开箱即用 — 快速构建一致性 UI（DESIGN.md 的三栏布局、侧边栏、行为树）
- **暗色模式一行搞定**：`dark:bg-gray-900` — Phase 2 深色模式需求可直接满足
- **无配置文件**：v4 自动检测，减少项目配置负担
- **shadcn-svelte 生态**：与 Tailwind 深度绑定的组件库，加速 UI 开发

**为什么不选其他**：
- **UnoCSS**：构建速度略快，但设计系统需自行配置，生态不如 Tailwind 成熟；对于个人项目，Tailwind 的约定优于配置更高效
- **CSS Modules**：适合大型团队做样式隔离，但缺乏设计系统，手写每个组件样式开发效率低
- **Vanilla CSS**：无法满足快速迭代需求，且缺少暗色模式等系统级支持

**风险点**：
- Tailwind 类名会使模板稍显冗长，但 Svelte 的组件化可很好地封装样式
- `tailwind.config.js` 在 v4 中虽已移除，但高级自定义仍需通过 CSS 配置

**结论**：**保持 Tailwind CSS 4 选型**。快速构建、内置设计系统、暗色模式支持 — 三者对 MVP 阶段的开发效率至关重要。

---

## 4. 数据存储

### 候选方案

| 维度 | **SQLite** (推荐) | **IndexedDB** | **PGLite** | **JSON 文件** |
|------|------|----------|---------|----------|
| 类型 | 关系型 (Rust 直接访问) | KV/文档型 (浏览器) | PostgreSQL (WASM) | 文本文件 |
| SQL 支持 | 完整 | 无 | 完整 (PG 语法) | 无 |
| 事务支持 | ACID | 有限 | ACID | 无 |
| 树状查询 | 递归 CTE（原生） | 需应用层实现 | 递归 CTE | 需应用层实现 |
| 查询性能 | 极快（< 1ms） | 慢（大数量级） | 快（WASM 开销） | 极慢（全量解析） |
| 单文件存储 | 是 | 浏览器内部 | 浏览器/WASM | 是 |
| 数据量上限 | TB 级 | 取决于磁盘 | 取决于内存/磁盘 | 实用上限 ~10MB |
| 备份/同步 | 直接复制文件 | 需导出 | 需导出 | 直接复制 |
| WASM 依赖 | 不需要 | 不需要 | 需要 (~3MB) | 不需要 |
| Tauri 集成 | 原生（tauri-plugin-sql） | WebView 内 | WebView 内 | 文件系统 API |
| 全文搜索 | FTS5 扩展 | 无 | 是 | 无 |
| 成熟度 | 30+ 年，极其稳定 | 浏览器标准 | 新兴项目 (~2024) | 取决于实现 |

### 分析

**SQLite** 在 Solution-Z 场景下的压倒性优势：

- **DESIGN.md Schema 直接映射**：递归 CTE 查询行为树、FTS5 全文搜索、JSON 扩展处理 `properties` — 全部原生支持
- **Rust 直连**：通过 `tauri-plugin-sql` 从 Rust 层直接操作 SQLite 文件，不经过 WebView IPC，延迟极低
- **单文件存储**：`actions.db` 一个文件包含所有数据，备份就是复制文件，坚果云 WebDAV 同步方案（DESIGN 7.5）直接可行
- **零配置**：无需服务器、无需安装、无需迁移工具
- **与 DESIGN 性能目标对齐**：数据库操作 < 10ms — SQLite 在本地文件上轻松达到微秒级

**为什么不选其他**：
- **IndexedDB**：无 SQL、无递归 CTE（行为树查询需应用层递归）、API 笨拙、性能随数据量退化 — 与 DESIGN 的关系型 Schema 完全不匹配
- **PGLite**：虽然提供完整 PG 语法，但 WASM 二进制 ~3MB 增加包体、通过 WebView 访问有 IPC 开销、项目仍不成熟（不适合生产数据） — 对本地任务管理器而言过度设计
- **JSON 文件**：无查询能力、无事务、无并发保护 — 超出几十条行为后性能和可靠性都会出问题

**风险点**：
- SQLite 的 `properties` JSON 字段不受 FK 约束（DESIGN 已标注），需应用层处理悬空引用
- WAL 日志模式与云同步需要 checkpoint 后再上传快照（DESIGN 7.5 已设计）
- 多进程写入同一数据库文件需要启用 WAL 模式

**结论**：**保持 SQLite 选型**。这是唯一能原生支持 DESIGN.md 中所有 Schema 特性（递归 CTE、FTS5、JSON 扩展）并满足性能目标的方案。

---

## 5. 综合评估

### 当前选型总评

```
桌面框架: Tauri 2.0  ✅ 最优 — 性能、安全、原生体验全面领先
前端框架: Svelte 5   ✅ 最优 — 编译时优化、最小包体、语法简洁
样式方案: Tailwind 4  ✅ 最优 — 开发效率、设计系统、暗色模式
数据存储: SQLite      ✅ 最优 — 功能完备、性能极高、备份简单
构建工具: Vite        ✅ 最优 — Svelte 官方推荐，HMR 极速
语言组合: TS + Rust   ✅ 最优 — 类型安全 + 高性能后端
```

### 选型一致性分析

DESIGN.md 的技术选型在以下方面具有高度一致性：

1. **性能链路**：Rust 后端 → SQLite 直连 → Svelte 编译时优化 → 系统原生 WebView — 整条链路无冗余开销
2. **包体控制**：Tauri（无 Chromium）+ Svelte（无 runtime）+ Tailwind（tree-shake）+ SQLite（系统库）= 预计 5–10 MB
3. **开发效率**：Vite HMR + Svelte 简洁语法 + Tailwind 原子类 + Rust 强类型 — 减少调试时间
4. **扩展性**：Tauri 插件系统 + Svelte 组件化 + SQLite JSON 扩展字段 — 为 Phase 3/4 插件生态打好基础

### 唯一需要关注的短板

| 短板 | 影响 | 应对策略 |
|------|------|---------|
| Svelte 组件库较少 | 部分复杂 UI（拖拽树、Markdown 编辑器）需自建或封装 | 优先使用 shadcn-svelte，复杂组件参考 React 实现迁移 |
| Tauri 文档不完善 | 某些原生功能（Touch Bar、Shortcuts）集成需要查阅源码 | 关注 Tauri GitHub Discussions 和官方示例 |
| Rust 学习曲线 | 后端 Command 层开发速度可能受影响 | 从简单 CRUD 开始，复杂查询用 SQL 而非 ORM |

---

## 6. 结论

**DESIGN.md 的技术选型是当前场景下的最优解**，无需调整。每个选型在各自的对比维度中都处于领先位置，且各层之间形成了良好的性能链路和开发体验闭环。

建议直接按照 DESIGN.md Phase 1 的清单开始实施：`pnpm create tauri-app solution-z --template svelte-ts`。

---

*Sources:*
- [Tauri vs Electron 2026 — Tech Insider](https://tech-insider.org/tauri-vs-electron-2026/)
- [Tauri v2 vs Electron — OfLight](https://www.oflight.co.jp/en/columns/tauri-v2-vs-electron-comparison)
- [Electron vs Tauri 2026 — PkgPulse](https://pkgpulse.com/blog/electron-vs-tauri-2026)
- [Tauri vs Electron 2026 — Rustify](https://rustify.rs/articles/rust-tauri-vs-electron-2026)
- [Frontend Frameworks 2025 Comparison — FrontendTools](https://www.frontendtools.tech/blog/best-frontend-frameworks-2025-comparison)
- [JS Frameworks 2026 — OrtemTech](https://ortemtech.com/blog/javascript-frameworks-comparison-2026/)
- [Svelte vs React 2026 — Strapi](https://strapi.io/blog/svelte-vs-react-comparison)
- [Tailwind vs UnoCSS 2026 — FastBuilder](https://fastbuilder.ai/blog/tailwindcss-vs-unocss)
- [Tailwind CSS vs CSS Modules 2025 — Medium](https://medium.com/@mernstackdevbykevin/tailwind-css-vs-css-modules-which-to-choose-in-2025-5511f54560af)
- [Local-First Comes of Age — InfoWorld](https://www.infoworld.com/article/4133648/the-browser-is-your-database-local-first-comes-of-age.html)
- [Offline-First Apps 2025 — LogRocket](https://blog.logrocket.com/offline-first-frontend-apps-2025-indexeddb-sqlite/)
- [LocalStorage vs IndexedDB vs SQLite — RxDB](https://rxdb.info/articles/localstorage-indexeddb-cookies-opfs-sqlite-wasm.html)
- [Tauri in 2026 — dev.to](https://dev.to/ottoaria/tauri-in-2026-build-cross-platform-desktop-apps-with-web-technologies-better-than-electron-11mo)
