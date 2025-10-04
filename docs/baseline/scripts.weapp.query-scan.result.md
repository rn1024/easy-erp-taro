# 拍摄脚本（Weapp）— 扫码查询 Result 卡片与整页

目标
- 采集以下两张基线截图（before）：
  1) 组件局部：`.scan-page__result-card`（文件名：`weapp/before/scan-result-card-<device>-<lib>.png`）
  2) 全页视图：结果区整段（文件名：`weapp/before/scan-result-<device>-<lib>.png`）

前置条件
- 构建：`pnpm dev:weapp`（开发）或 `pnpm build:weapp`（产物）
- 设备：iPhone 13（iOS 17）与一台 Android 13；微信基础库：最新与最低各一次
- 页面路径：`/pages/query/scan/index`（选择“扫码查询”）
- 保持默认主题（品牌蓝 #478EF2），不改动任何样式/代码

步骤（共 2 张）
1) 打开页面并生成结果
   - 进入“扫码查询”页，确保处于占位态（未输入/未扫码）
   - 在输入框输入 `SKU001`，点击“查询”（或使用内置扫码，成功后自动查询）
   - 观察顶部 Loading“查询中...”出现并消失，页面出现“查询结果”SectionCard 与结果卡片

2) 截图1：结果卡片（组件局部）
   - 确保 `.scan-page__result-card` 完整可见（若超出视窗请轻微滚动使其居中）
   - 使用开发者工具元素截图或系统裁剪，范围仅包含：标题（商品名）、副标题（SKU）、InfoList 关键字段
   - 文件名：`weapp/before/scan-result-card-<device>-<lib>.png`

3) 截图2：结果区整页
   - 保持页面不滚动或轻微调整，使“查询结果”SectionCard 自标题起至卡片底部完整可见
   - 使用全屏截图（包含导航栏与状态栏更贴近真实），或选区覆盖整个结果区
   - 文件名：`weapp/before/scan-result-<device>-<lib>.png`

验收点
- 文字清晰可读；标题/副标题未被遮挡或截断
- 信息项（如 SKU、品名）可见且对齐合理
- 品牌蓝元素（高亮/按钮/分隔线）与 tokens 一致（仅核验，不修改）

注意事项
- 需在“有结果”的前提下拍摄（`SKU001` 为示例，若无数据可换用 mock 中存在的 SKU）
- iOS/Android 均需拍摄；基础库最低/最新各一套
- 禁止对页面做任何样式/代码改动；仅进行滚动与交互以呈现目标区域

