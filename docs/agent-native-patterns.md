# Agent Native 应用模式如何进入本轮原型

核查 upstream SHA `d2b14cfeaa041fa1d8726ad272b7e71ad824f3c6`。完整报告与 34 个固定源码链接在主工作树：

[Agent Native 框架与官方应用交互研究](/Users/he.william/Documents/tech/__dev/_pers/life-game-jarvis/docs/research/agent-native-interaction-patterns.md)

| 官方示例 | 本轮交互 | 生产时需接入 |
| --- | --- | --- |
| Calendar manage-event-draft / DayView | 自然语言先形成日历草案，原地改时间，确认才生效 | 实际 Agent actions、持久化、按业务授权的日历连接 |
| Content suggest-document-edit | before/after 差异，绑定计划版本；新修改使旧提案失效 | 事务、幂等键、用户身份、UI-only 确认 |
| Slides selection | 选中事项后“这个”有具体指向；成长节点可发起下一任务 | `selection` / `view-screen` 读取最新语义对象 |
| Tasks inline task list | 对话中的提案与日历是同一份数据；进展就地保存 | 稳定原生 `chatUI.renderer` 与共享领域 actions |
| Plan visual-answer | 图表显示能力项、真实来源与数值差距，可引出行动 | 由真实上下文驱动的可视化成果，必要时局部澄清 |
| suggest-follow-ups | 提案、部分进展、待验证等不同状态有不同下一步 | Agent 按本轮工具结果返回 0–3 个意图；不自动执行 |

原型采用确定性解析与排程来检验体验；未调用框架 runtime。默认 dynamic suggestions 很多是预设快捷语，不能把它当成已实现深度规划。框架的通用批准 action 也不自动保证 Jarvis 的“本人确认”。

建议先完成一个生产纵向闭环：`get-day-context → propose-plan-change → 用户 confirm-plan-change → report-progress → get-growth-evidence`。确认绑定 proposal ID、计划版本、用户与幂等键；模型不能直接写 XP。Apace 若保持非 React Router，可核对实际导出的 `useSemanticNavigationState`；embedded chat 的 package exports 也需按源码核查，不能照抄过时文档。

首轮无需引入多 Agent 团队、全量向量库或任意生成 UI。等真实背景规模、检索质量或并行工作需求出现再增加；游戏化、个人依据和确认约束不因此省略。
