import type { MetadataRoute } from 'next';

export type ManifestWithScopeExtensions = MetadataRoute.Manifest & {
	scope_extensions?: Array<{
		origin: string;
		type: string;
	}>;
	edge_side_panel?: {
		preferred_width?: number;
	};
};

export default function manifest(): ManifestWithScopeExtensions {
	return {
		name: "Alexander Sullivan's Portfolio",
		short_name: "Alexander Sullivan's Portfolio",
		description: 'Portfolio showcase for Alexander Joo-Hyun Sullivan.',
		start_url: '/',
		display: 'standalone',
		background_color: '#131518',
		theme_color: '#131518',
		orientation: 'any',
		scope: '/',
		lang: 'en',
		dir: 'ltr',
		id: '/',
		display_override: ['standalone', 'minimal-ui', 'window-controls-overlay'],
		launch_handler: {
			client_mode: ['focus-existing', 'auto'],
		},
		prefer_related_applications: false,
		scope_extensions: [
			{
				origin: 'https://alexjsully.me/',
				type: 'web',
			},
			{
				origin: 'https://alexjsully.com/',
				type: 'web',
			},
		],
		edge_side_panel: {},
		icons: [
			{
				src: '/icon/android-chrome-36x36.png',
				sizes: '36x36',
				type: 'image/png',
			},
			{
				src: '/icon/android-chrome-48x48.png',
				sizes: '48x48',
				type: 'image/png',
			},
			{
				src: '/icon/android-chrome-72x72.png',
				sizes: '72x72',
				type: 'image/png',
			},
			{
				src: '/icon/android-chrome-96x96.png',
				sizes: '96x96',
				type: 'image/png',
			},
			{
				src: '/icon/android-chrome-144x144.png',
				sizes: '144x144',
				type: 'image/png',
			},
			{
				src: '/icon/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/icon/android-chrome-256x256.png',
				sizes: '256x256',
				type: 'image/png',
			},
			{
				src: '/icon/android-chrome-384x384.png',
				sizes: '384x384',
				type: 'image/png',
			},
			{
				src: '/icon/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
			{
				src: '/icon/maskable_icon_x48.png',
				sizes: '48x48',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icon/maskable_icon_x72.png',
				sizes: '72x72',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icon/maskable_icon_x96.png',
				sizes: '96x96',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icon/maskable_icon_x128.png',
				sizes: '128x128',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icon/maskable_icon_x192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icon/maskable_icon_x384.png',
				sizes: '384x384',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icon/maskable_icon_x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icon/maskable_icon.png',
				sizes: 'any',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/icon/safari-pinned-tab.svg',
				sizes: 'any',
				purpose: 'monochrome',
				type: 'image/svg+xml',
			},
			{
				src: '/icon/favicon.ico',
				sizes: 'any',
				type: 'image/x-icon',
			},
		],
		screenshots: [
			{
				src: '/icon/screenshot1.webp',
				label: 'Landing page',
				form_factor: 'wide',
				sizes: '1280x800',
				type: 'image/webp',
			},
			{
				src: '/icon/screenshot2.webp',
				label: 'Mobile landing page',
				form_factor: 'narrow',
				sizes: '1072x1930',
				type: 'image/webp',
			},
			{
				src: '/icon/screenshot3.webp',
				label: 'Current and previous projects and experiences',
				sizes: '1600x1089',
				type: 'image/webp',
			},
		],
		categories: [
			'bioinformatics',
			'business',
			'education',
			'entertainment',
			'finance',
			'games',
			'health',
			'lifestyle',
			'medical',
			'personal',
			'personalization',
			'portfolio',
			'productivity',
			'research',
			'resume',
			'science',
			'social',
			'video games',
			'virtual reality',
			'website',
		],
	};
}
