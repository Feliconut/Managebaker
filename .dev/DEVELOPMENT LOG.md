**巨大的龟龟想法！**

- recent activity > everywhere
-

**开发计划！**

- 本地存储函数
- event.json 查询函数
- 包装 assignment.js
- 实现 dashboard.js
- popup.js
- progress chart 折叠

**FELIX**

- event.json
- assignment
- popup

**Martin-190215**
- 1 优化代码环境
-   采用onMessage & on Listener 完成recent activity
- 2 Chrome sync 同步数据
- 3 采用多种计分方式

**Felix-190223**
- 1 重构文件结构
- 2 对页面处理函数进行包装，成为handle和toolbox类
- 3 简化content script, 使用内部引用调用库，模块定义严格化
- 详细说明附在每个文件顶部

**Felix-190428**
- gradeChart现在可以从storage抓数据进行计算并根据需求计算term 或 year的成绩。
- issue:storage的存储还没有实现scores. 在下个更新中可以实现从HTML更新scores并计算成绩。也需要实现后台抓成绩。

**FELIX-190509**
- Grade Chart 正常工作 + 爬取score
- Auth.Upload Alarm

**MARTIN-190509**
- MDC Black Bug
- Recover Data  Date String Bug
- Data Encode + Load

**FELIX-190510**
- 建议加入manual data upload