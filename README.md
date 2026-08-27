# 面试狗 · 前端

> 在线面试刷题平台前端，基于 Vue 3 + TypeScript + Element Plus 构建。
> 配合后端服务 `show-case`（Egg.js）使用，实现题库刷题、试卷练习、AI 判分、互动社区与后台管理。

## ✨ 功能页面

- **首页**：每日一题、热门题目、公告、排行榜、数据可视化（ECharts）
- **题库**：单选 / 多选 / 判断 / 简答四类题型，分类浏览、关键词搜索、相似题推荐、随机刷题
- **题目详情**：查看题目与答案（答案权限由服务端判定）、AI 简答判分、点赞 / 收藏 / 评论
- **试卷**：浏览公开试卷、自主组卷、试卷答题与交卷、查看答题记录
- **个人中心**：个人信息、我的上传 / 收藏 / 试卷、每日打卡、积分与排行
- **管理后台**：题目 / 试卷审核、标签管理、用户管理、数据统计
- **登录 / 注册**：图形验证码、密码登录、重置密码

## 🛠 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | Vue 3（Composition API）+ Vue Router + Vuex |
| 语言 | TypeScript |
| 构建 | Vite 4 |
| UI 组件 | Element Plus（按需自动引入） |
| 图表 | ECharts |
| 富文本 | TinyMCE |
| HTTP | Axios |
| 代码规范 | ESLint + Prettier + Stylelint + Husky + Commitlint |

## 📁 目录结构

```
src/
  views/         页面（Home 首页 / QuestionPage 题库 / ProblemInfo 题目详情 / TestPaper 试卷 ...）
  components/    通用组件
  services/      API 请求封装
  store/         Vuex 状态管理
  router/        路由配置
  composables/   组合式函数
  utils/         工具函数
  types/         类型定义
  assets/        静态资源
```

## 🚀 快速开始

### 环境要求

- Node.js ≥ 14
- 已启动后端服务 `show-case`（默认 `http://127.0.0.1:7001`）

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务

```bash
npm run dev
```

默认运行在 `http://127.0.0.1:5173`。开发环境已配置代理，`/api` 与 `/public` 请求会自动转发到后端服务，无需额外配置跨域。

### 3. 代码检查与构建

```bash
# TypeScript 类型检查 + 生产构建
npm run build

# 代码规范检查（自动修复）
npm run lint
npm run stylelint

# 生产预览
npm run preview
```

## 🔌 代理配置

`vite.config.ts` 中已配置开发代理：

| 路径 | 目标 |
|---|---|
| `/api` | `http://127.0.0.1:7001` |
| `/public` | `http://127.0.0.1:7001` |

生产环境请将构建产物部署到任意静态服务器，并由 Nginx 等将 `/api` 反向代理到后端服务。
