import { MetadataRoute } from 'next';

/** Generates /robots.txt allowing all crawlers and pointing to the sitemap. */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
		},
		sitemap: 'https://alexjsully.me/sitemap.xml',
	};
}
