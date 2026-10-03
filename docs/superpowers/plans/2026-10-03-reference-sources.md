# 榜样资料来源 Implementation Plan

**Goal:** 用户能新增或编辑榜样的多条公开资料链接，并将资料带入对应领域的评估与协商提案。

**Architecture:** 沿用 benchmark、analyzeModule 和确认机制，在榜样上保存 sources、focus、observationWindow。读取和客观评分预留给真实 Agent，当前资料为待读取；既有参照只在其原始来源保留时沿用。

**Tech Stack:** 原生 JS / CSS、Node 断言、agent-browser，无新增依赖。

**Spec:** 本轮用户请求；行为说明落在 docs/reference-sources.md。

## Global Constraints

- 保留已有今日／成长结构、两种评估模式及独立对象反馈。
- 新链接不冒充已读取证据，不根据链接数、粉丝数、提交数加能力分。
- 所有资料变更可审阅、确认、拒绝；版本变化阻止旧提案覆盖新事实。
- 链接只接受 HTTP(S)，最多 12 条；不接受重复地址；表单错误保留草稿。
- 320px 可用，标签与键盘焦点完整；不改无关 README 和已有研究目录。

## Design

沿用 #f3f5fa 背景、#ffffff 纸面、#202b48 正文、#59677f 辅助文字、#6478ef 焦点；系统字体承载表单，既有宋体仅用于境界。表单放在模块正文上方的独立全宽区域，资料清单左对齐，来源、适用判断和读取状态比装饰更突出。

## Review Focus

- 非法／重复 URL 被拒绝，输入不丢失。
- 换名字或移除预置参照来源后不能继续使用原人物的数值。
- 已知参照补充新链接后不加分；自选对象仍未知。
- 同领域资料修订不会带入别的模块，旧评估提案会过期。
- 每条来源能独立反馈、修改或移除，解释携带完整资料。

### Task 1: 资料模型与分析依据

Files: module-model.js、feedback.js、check-reference-sources.mjs。

- [x] 增加 SOURCE_TYPES、referenceSources、configureReference、referenceSourceText；兼容 customReference(name,url)。
- [x] analyzeModule 写入 referenceBasis、referenceResearch 和未核验来源缺失项。
- [x] 来源反馈复用 modulePatch；支持补充资料、链接更正、移除与重评。
- [x] 用 `node check-reference-sources.mjs` 验证非法协议、去重、未知、原始来源撤回、确认、过期、XP 保留和多模块隔离。

### Task 2: 表单、清单与实际浏览器流程

Files: reference-ui.js、module-ui.js、day.js、journey-ui.js、journey.css、check-reference-sources-browser.py、docs/reference-sources.md。

- [x] 多行资料表单包括类型、链接、标题、支持判断的说明；共享榜样名称、观察范围和评估重点。
- [x] 草稿按模块保存；新增、移除、取消不修改有效榜样；提交调用 `configureReference` → `analyzeModule`，确认才生效。
- [x] 总览、详情和榜样协商都可进入资料编辑；提案展示来源及其状态。
- [x] 浏览器验证新增、自选待评估、现有参照补充、来源反馈、拒绝、确认、重新打开、320px 与键盘焦点。
- [x] 运行既有六组模型检查和相关浏览器回归，记录结果。

计划在当前会话由主 agent 直接执行；用户已授权功能实现，无额外批准步骤。
