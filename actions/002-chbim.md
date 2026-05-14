---
title: 002-chbim
status: 暂缓
tags: [action, big, architecture, bim, chinese-historic-building]
---

# 002 - CHBIM：基于中国古代营造体系的参数化 BIM

将传统营造知识（材份制、地盘分槽、侧样举折等）编码为形式化的规则与参数体系，基于 OpenCascade (OCCT) 实现参数化几何建模，形成面向中国古代木构建筑的 BIM 工具链。

> 项目仓库 → [chbim](https://github.com/Chartreuse310/chbim)

## 为什么

中国古代木构建筑有一套成熟的营造体系（《营造法式》《工程做法则例》），但目前没有能直接对应这套体系的 BIM 工具。现有 BIM 软件（Revit、ArchiCAD）面向现代建筑，传统建筑的参数化建模仍需大量手动操作。

CHBIM 的目标是将营造体系的知识编码进软件，让人能通过参数驱动自动生成传统建筑的三维模型。

## 三条主线

### 一、知识积累

路径：`resources/chbim/research-notes/`

- 编码体系：基于"缝"的构件编码——每个构件叫什么（进行中：v1.1 以镇国寺万佛殿为例）
- 参数化体系：基于《营造法式》的参数化——每个构件怎么做（待开始）

### 二、软件交互设计

路径：`resources/chbim/dev-notes/`

- 学习现有工具（SolidWorks ✓ / Revit 进行中 / FreeCAD 待开始）
- 软件交互原型设计（待开始）

### 三、软件功能实现

路径：`resources/chbim/src/`

```
语言:   C++ / Python
几何:   OpenCascade (OCCT)
绑定:   pybind11 / PyO3
目标:   AI Agent → Python → C++ 几何内核
```

## 子行动

- → [002-01-encoding](002-01-encoding.md) — 基于"缝"的构件编码体系
- → [002-02-parametric](002-02-parametric.md) — 《营造法式》参数化研究
- → [002-03-occt-demo](002-03-occt-demo.md) — OCCT 极小 demo：输入参数 → 生成建筑体块
- → [002-04-mvp](002-04-mvp.md) — MVP：预设 → 梁架俯视图 → 参数填入 → 几何生成
- → [002-05-ai-agent](002-05-ai-agent.md) — Python Agent 调用 C++ 几何内核

## 里程碑

1. **M1** — 编码体系：至少一个完整案例的"缝"编码
2. **M2** — 参数化原型：营造法式核心参数可驱动几何生成
3. **M3** — MVP：参数输入 → OCCT 几何 → 3D 可视化
4. **M4** — AI 辅助：自然语言驱动建模

## 笔记

（暂无）

## 踩坑记录

（暂无）

## 复盘

（尚未开始）

## 关联 journal

（暂无）
