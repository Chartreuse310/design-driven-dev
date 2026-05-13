# Solution-Z：设计对照与实现建议

本文档对照 [DESIGN.md](./DESIGN.mdoc) 与当前仓库内容，说明**实现现状**、**设计文档内部需澄清点**，以及**开始编码后容易踩坑的地方**。

---

## 1. 实现现状（与 DESIGN 3.3 对照）

当前仓库中**没有**设计方案里列出的工程结构：

- 无 `package.json`、`svelte.config.js`、`vite.config.ts` 等前端脚手架  
- 无 `src-tauri/`、`Cargo.toml`、`tauri.conf.json` 等 Tauri 后端  
- 无 `src/` 下的 Svelte 组件、`lib/stores`、`lib/types` 等  

仅有 `DESIGN.md`、`.gitignore`（已按 Tauri/SQLite 习惯忽略 `*.db`、`src-tauri/target/` 等）以及 Git 元数据。  
因此：**DESIGN 中的 Phase 1 清单在仓库层面尚未落地**；若你本地另有目录，请以实际含代码的仓库为准重新对照。

---

## 2. 数据模型与「收集箱」语义（实现前建议定稿）

### 2.1 `domain_id NOT NULL` 与快速输入默认

Schema 中 `actions.domain_id` 为 **NOT NULL**（DESIGN 2.2），而快速输入说明里写：简单输入时「所属行为 → 无（收集箱）」（DESIGN 4.2）。

这里需要产品在实现前二选一（或写进 DESIGN）：

1. **系统内置「收集箱」领域**（或「收件箱」`domain`），所有未指定领域的快速录入默认落到该 `domain_id`；「收集箱」视图即该领域或 `parent_id IS NULL` 的子集。  
2. **「收集箱」仅为视图**：仍是某个默认领域 + `parent_id IS NULL` 的过滤条件，但 UI 文案上叫收集箱。

若不做上述约定，前端/Rust 在创建 `action` 时会无法插入合法行。

### 2.2 「无所属行为」在 4.3 中的含义

「收集箱 | 无所属行为的行动」（DESIGN 4.3）可能被理解为：

- **无上级行为**（`parent_id IS NULL`），或  
- **未归入任何领域**（与当前 Schema 冲突）。

建议在 DESIGN 或数据字典里用一句话固定：**收集箱 = 无 `parent_id` / 或专用 inbox 领域**，避免与 GTD「收件箱」混用两种含义。

### 2.3 `properties` 中的 `blocks` 等引用

`properties` JSON 里可存 `blocks: ["action_id", …]`（DESIGN 2.3），SQLite **不会**校验这些 ID 是否存在。实现时建议：

- 删除/归档 `action` 时清理或提示悬空 `blocks`；或  
- 未来若强依赖依赖关系，再考虑独立关联表 + 外键。

### 2.4 `verbs` 删除策略

`actions.verb_id NOT NULL REFERENCES verbs(id)`（DESIGN 2.2）未写明 `ON DELETE` 行为。实现时需定：

- 禁止删除仍被引用的 verb；或  
- 删除时迁移到默认 verb（如「完成」）。

否则易出现外键错误或孤儿数据。

---

## 3. 文案与字段命名（减少实现歧义）

DESIGN 2.1 表格将第二列日期称为 **「完成日期」**，而 Schema 使用 `due_date`，另有 `completed_at` 表示真正完成时间。

建议在 UI/类型命名上统一为 **「截止日期」** 对应 `due_date`，「完成于」对应 `completed_at`，避免与 `status = done` 混淆。

---

## 4. UI / 交互与 Phase 划分

以下在 DESIGN 中已标为 Phase 2 或未在 Phase 1 列出，**不算实现错误**，但实现 Phase 1 时不要默认已具备：

- 行为树 **拖拽**、**Tab/Shift+Tab 缩进**（DESIGN 4.4、4.6）  
- **⌘\\** 侧边栏折叠、系统托盘、全局 **⌘K**（若未装托盘/全局监听，需单独 capability）  
- **标签**（表已在 Schema，UI 在 Phase 2）  
- **面包屑**（Phase 2）  
- 笔记 **折叠摘要**、**拖拽排序**（4.5 与 Phase 1「笔记卡片」部分重叠，建议 Phase 1 先做创建+编辑+`sort_order` 持久化，拖拽放 Phase 2）

若 MVP 范围收紧，可把 DESIGN Phase 1 清单与上述条目再对齐一次，避免验收标准漂移。

---

## 5. 技术栈与配置片段

- **Tauri 2 + `titleBarStyle: "Overlay"`、托盘 `trayIcon`**（DESIGN 7.1）：具体 JSON 键名与能力（capabilities）以你锁定的 Tauri 2.x 文档为准，避免直接粘贴过期示例。  
- **数据库路径**：DESIGN 3.2 与 7.4 均指向 `~/Library/Application Support/.../actions.db`，一致；使用 `tauri-plugin-sql` 时需确认插件对路径、迁移、WAL 的约定与「坚果云快照」方案（7.5）不冲突——同步前仍应 **checkpoint/导出快照**，与设计一致。

---

## 6. 查询与排序（7.3）

递归 CTE 示例按 `depth, sort_order` 排序，在同一 `parent_id` 下 siblings 的 `sort_order` 有意义；若产品需要「严格按树的前序遍历且同层按 sort_order」」，实现时可能要显式构建树再排序，或扩展 SQL。属细节优化，非设计错误。

---

## 7. 文档维护建议（可选）

- Phase 1～4 的 `[ ]` 与真实仓库进度可定期同步，或注明「设计蓝图，非当前进度」。  
- `pnpm create tauri-app` 模板名、Node 版本（DESIGN 9）随官方更新时微调即可。

---

## 小结

| 类别 | 结论 |
|------|------|
| 代码实现 | 当前仓库**尚无** DESIGN 所述应用代码；首要工作是脚手架 + DB + 命令层。 |
| 高优先级产品/Schema 澄清 | **收集箱** 与 **`domain_id NOT NULL`** 的对应关系；**verb 删除**策略；**due vs 完成** 文案。 |
| 中优先级 | `properties.blocks` 无 FK；Phase 1/2 与拖拽、快捷键、笔记交互边界。 |
| 低优先级 | CTE 排序细节、Tauri JSON 与版本对齐。 |

以上条目在补齐实现后，可再跑一轮「界面文案 + IPC 命令 + Schema 迁移」与 DESIGN 的对照表。
