import profile from '@data/profile';

/**
 * Resolves a site-relative path against the canonical site URL.
 * @param path Site-relative path, such as `/llms.txt`
 * @returns The absolute URL on the production domain
 */
export function absoluteUrl(path: string): string {
	return new URL(path, profile.url).href;
}
