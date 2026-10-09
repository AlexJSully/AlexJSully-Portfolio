/**
 * Which mark a link carries: this site's own icon for a same-origin link, the linked site's real icon when the
 * visitor allows Link icons, and a generated globe otherwise. Every kind is drawn as an `<img>`, so switching between
 * them only changes `src` and never the element, and the row around it never reflows.
 */
export type LinkIconSource =
	| {
			/** This site's own icon. */
			kind: 'site';
	  }
	| {
			/** The linked site's real icon, through the proxy. */
			kind: 'remote';
			/** The linked site's normalised hostname, recorded if its icon fails to load. */
			hostname: string;
			/** The proxy URL of the icon. */
			src: string;
	  }
	| {
			/** The generated globe. */
			kind: 'glyph';
			/** The globe's tint, derived from the hostname. */
			hue: number;
	  };

/**
 * Where a remote icon is fetched from: DuckDuckGo's icon proxy, which sets no cookies.
 *
 * The linked site's own `/favicon.ico` is never requested, because a cross-origin `<img>` carries that origin's
 * `SameSite=None` cookies, handing social networks an authenticated read on everyone who loads the page.
 */
const ICON_HOST = 'https://icons.duckduckgo.com/ip3';

/** The generated mark: a globe drawn as three strokes, tinted by the hostname's own hue. */
const GLYPH_PATHS = ['M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z', 'M2.5 8h11', 'M8 2.5c3 3 3 8 0 11'];

/** Generated globes, keyed by hue, so a page of links to the same site builds its mark once. */
const glyphCache = new Map<number, string>();

/** Hostnames whose icon the proxy has already failed to serve in this session. */
const missing = new Set<string>();

/**
 * Lower-cases a hostname and strips a leading `www.`, which the proxy treats as the same site.
 * @param hostname The hostname
 * @returns The normalised hostname
 */
export function normaliseHostname(hostname: string): string {
	return hostname.toLowerCase().replace(/^www\./, '');
}

/**
 * Derives a stable hue from a hostname with FNV-1a, so a site's generated mark is the same colour everywhere and
 * anagrams of one another do not systematically share a colour.
 * @param value The hostname
 * @returns A hue in degrees
 */
export function hueFor(value: string): number {
	let hash = 2166136261;
	for (let index = 0; index < value.length; index += 1) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return Math.abs(hash) % 360;
}

/**
 * Draws the generated globe as a `data:` URI, so it renders as an `<img>` like the other kinds.
 * @param hue The hostname's hue, in degrees
 * @returns A `data:` URI holding the mark
 */
export function glyphDataUri(hue: number): string {
	const cached = glyphCache.get(hue);
	if (cached !== undefined) {
		return cached;
	}

	const paths = GLYPH_PATHS.map((d) => `<path d='${d}'/>`).join('');
	const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='hsl(${hue} 55% 70%)' stroke-width='1.25'>${paths}</svg>`;
	const uri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
	glyphCache.set(hue, uri);
	return uri;
}

/**
 * Chooses the mark for one link.
 * @param href The link's target, absolute or relative
 * @param origin The origin a same-origin link is judged against
 * @param remoteAllowed Whether the visitor allows Link icons, so a real icon may be fetched
 * @returns The mark to draw, or `null` for a link that is not a web page, such as `mailto:`, which carries no mark
 */
export function linkIconFor(href: string, origin: string, remoteAllowed: boolean): LinkIconSource | null {
	let url: URL;
	try {
		url = new URL(href, origin);
	} catch {
		// A malformed href must never throw into a render.
		return { kind: 'glyph', hue: hueFor('') };
	}

	if (url.protocol !== 'https:' && url.protocol !== 'http:') {
		return null;
	}

	if (url.origin === origin) {
		return { kind: 'site' };
	}

	const hostname = normaliseHostname(url.hostname);
	if (!hostname || !remoteAllowed || missing.has(hostname)) {
		return { kind: 'glyph', hue: hueFor(hostname) };
	}

	return { kind: 'remote', hostname, src: `${ICON_HOST}/${encodeURIComponent(hostname)}.ico` };
}

/**
 * Records that the proxy had no icon for a hostname, so the next render draws the globe instead of asking again.
 * @param hostname The hostname whose icon failed to load
 */
export function rememberIconMiss(hostname: string): void {
	missing.add(normaliseHostname(hostname));
}

/** Forgets every recorded miss, so one test cannot leak a miss into the next. */
export function resetIconMisses(): void {
	missing.clear();
}
