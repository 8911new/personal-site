# 林深 · 个人网站

简洁现代风格的个人网站，杂志编辑风 + 极简主义美学。

包含三个核心模块：个人介绍、文章展示、作品集。

## 技术栈

- 纯静态站点：HTML + CSS + 原生 JS（无构建步骤）
- 字体：Fraunces 可变衬线 + Manrope + JetBrains Mono（Google Fonts CDN）
- 视觉记忆点：衬线大标题 + 章节编号系统 + 鼠标光晕跟随 + 滚动渐入动画

## 文件结构

```
.
├── index.html                  # 单页应用，4 个 section
├── css/style.css               # 全部样式 + 响应式
├── js/main.js                  # 光晕/导航/移动菜单/IO渐入
├── .nojekyll                   # 禁用 Jekyll 处理（保留所有文件原样）
└── .github/workflows/deploy.yml # GitHub Pages 自动部署
```

## 本地预览

```bash
python -m http.server 8765
# 浏览器打开 http://localhost:8765
```

## 部署到 GitHub Pages

本仓库已配置自动部署 workflow。两种方式二选一：

### 方式 A：用 GitHub Actions（推荐）

1. 把本仓库推到 GitHub（或新建仓库后上传所有文件到 `main` 分支）
2. 仓库 → Settings → Pages → Source 选 **GitHub Actions**
3. 等待 Actions 跑完（约 30 秒），访问：
   - 仓库名为 `<用户名>.github.io` → `https://<用户名>.github.io/`
   - 仓库名为其他 → `https://<用户名>.github.io/<仓库名>/`

### 方式 B：直接 main 分支部署

1. 推送代码到 `main` 分支
2. 仓库 → Settings → Pages → Source 选 **Deploy from a branch** → `main` / `root`
3. 等待几分钟，访问同上

## 修改后更新

改了任何文件 → 提交并推送到 `main` → Actions 自动重新部署 → 几十秒后线上生效。

## 内容声明

站内人物「林深」、文章、作品均为虚构示例，用于演示网站结构。
