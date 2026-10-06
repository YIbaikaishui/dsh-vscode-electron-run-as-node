# dsh-vscode-electron-run-as-node

> 记录开发环境里那些「看起来玄学、其实有确凿根因」的问题。

**第一篇：[Windows 上点「用 VS Code 打开」只弹出一个黑框终端？根因是 `ELECTRON_RUN_AS_NODE=1`](src/content/blog/electron-run-as-node-windows.md)**

在线站点：<https://yibaikaishui.github.io/dsh-vscode-electron-run-as-node/>

---

## 这篇讲了什么

在桌面端应用里点「用 VS Code 打开」，结果**一个窗口都不弹**，有时闪一个黑框终端。排查到最后发现根因只有一个：

```text
ELECTRON_RUN_AS_NODE=1
```

这个变量是 **VS Code 自己的 `bin\code.cmd` 显式设置的**，本来用于让 CLI 快速跑一遍 Node 逻辑；但通过某些调用链它会**泄漏进父进程的环境块**，之后从那里派生的**每一个 Electron 应用**都会被强制拉进 Node 模式 —— 不创建窗口、不加载 `resources/app`，然后立刻退出。

文章记录了完整的定位过程、**三个看起来毫不相干但同源的症状**、以及一个不修改任何官方文件的修复方案（独立启动器 + `App Paths` 注册）。

### 核心结论速查

| 现象 | 真实原因 |
|---|---|
| 点「打开」毫无反应 / 弹终端 | 父进程泄漏 `ELECTRON_RUN_AS_NODE=1`，Electron 退化成了 Node |
| `Cannot find module 'D:\...'` | 同上，Node 把目录当脚本路径解析 |
| 退出码 0 但无窗口 | 同上，Node 拿到空参数后正常退出 |
| `bad option: --cd=...`（exit 9） | `--cd` 是 `code` CLI 选项，GUI 二进制不认 |
| `Invalid file descriptor to ICU data received` | Electron 按 exe 文件名 + 目录推导资源，改名后找不到 |
| 批处理报 `'的选项，' 不是内部命令` | `.cmd`/`.bat` 必须纯 ASCII，中文注释在 OEM 代码页下会崩解析 |

## 技术栈

基于 [Astro 官方 blog 模板](https://github.com/withastro/astro/tree/main/examples/blog)（`withastro/astro` → `examples/blog`），静态站点：

- Astro + MDX
- `@astrojs/rss`（RSS 输出）
- `@astrojs/sitemap`（站点地图）
- 通过 GitHub Actions 部署到 GitHub Pages

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321/dsh-vscode-electron-run-as-node/
npm run build    # 产物在 dist/
npm run preview  # 预览构建结果
```

## 写新文章

在 `src/content/blog/` 下新建 `.md`（或 `.mdx`），frontmatter 至少包含：

```yaml
---
title: '标题'
description: '摘要，会出现在首页列表与 meta 里'
pubDate: 'Oct 06 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
```

## 部署

推送到 `main` 后由 `.github/workflows/deploy.yml` 自动构建并发布到 GitHub Pages。

站点 URL 与 base 路径在 `astro.config.mjs` 里配置：

```js
site: 'https://yibaikaishui.github.io',
base: '/dsh-vscode-electron-run-as-node',
```

若要给仓库改名或用自定义域名，**必须同步改这两项**，否则静态资源会 404。

## License

文章内容版权归作者所有；模板部分来自 Astro 官方示例（MIT）。
