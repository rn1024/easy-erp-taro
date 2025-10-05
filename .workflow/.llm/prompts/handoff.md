# handoff.md — 交接提示词（双向，角色对等）

```yaml
Handover:
  TaskID: {{TASK-ID}}
  From: {{CurrentAgent}}
  To: {{NextAgent}}
  Branch: {{branch}} @ {{short-commit}}
  Entry_Points: [{{源码入口/命令}}]
  Modified_Files: [{{相对路径列表}}]
  Open_Questions: [{{待决}}]
  Blocking_Issues: [{{若有}}]
  Run_Commands: [{{npm scripts / make / docker}}]
  Verification_Steps:
    - {{如何快速自验}}
  Rollback: {{回滚方法}}
  Notes: {{补充信息}}
  Evidence_Pack: [{{证据包路径（日志/报告/变更清单）}}]
  SpecRefs: [{{关联的契约/架构锚点}}]
```

**接收方须**：
- 用简明步骤法回显接收确认；
- 若信息不足，停止实现并回填阻塞项；
- 更新 `.llm/state.json` 与 `.llm/session_log/`。
