import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	// 本站部署在 GitHub Pages 的项目子路径下，RSS 里的链接必须带上 base 前缀，
	// 否则订阅者点开的是 https://<user>.github.io/blog/... 这个不存在的地址。
	const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `${base}/blog/${post.id}/`,
		})),
	});
}
