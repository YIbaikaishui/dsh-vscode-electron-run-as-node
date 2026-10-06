// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = '一杯白开水的技术笔记';
export const SITE_DESCRIPTION =
	'记录开发环境里那些"看起来玄学、其实有确凿根因"的问题。第一篇：Windows 上 Electron 应用被 ELECTRON_RUN_AS_NODE=1 污染，导致 VS Code 只弹终端不开窗口。';

/**
 * 给站内绝对路径补上 Astro 的 base 前缀。
 *
 * 本站部署在 GitHub Pages 的项目子路径 `/dsh-vscode-electron-run-as-node/` 下，
 * 而 Astro 的 `base` **不会**自动改写手写的 `href="/xxx"`：那些链接会解析到
 * 域名根目录（`https://yibaikaishui.github.io/xxx`）从而 404。
 * 所以站内链接一律走这个函数，不要再手写裸的 `/xxx`。
 *
 * 用法：url('blog')、url('about')、url('')（等价于站点首页）。
 */
export function url(path = ''): string {
	const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
	const clean = path.replace(/^\/+/, '');
	return clean ? `${base}/${clean}` : `${base}/`;
}
