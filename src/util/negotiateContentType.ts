/** Representation of a page chosen for a request's `Accept` header. */
export type PageRepresentation = 'html' | 'markdown' | 'not-acceptable';

/** One media range from an `Accept` header. */
interface MediaRange {
	/** Top-level type, lower-cased, or `*`. */
	type: string;
	/** Subtype, lower-cased, or `*`. */
	subtype: string;
	/** Quality weight between 0 and 1. */
	quality: number;
}

/** A media range's weight for one candidate type, with how precisely the range named it. */
interface RangeMatch {
	/** Quality weight of the matching range. */
	quality: number;
	/** 3 for an exact `type/subtype`, 2 for a `type/*` range, 1 for the full wildcard. */
	specificity: number;
}

/**
 * Parses an `Accept` header into media ranges, skipping malformed entries.
 * @param accept Raw `Accept` header value
 * @returns The well-formed media ranges, in header order
 */
function parseAccept(accept: string): MediaRange[] {
	const ranges: MediaRange[] = [];

	for (const entry of accept.split(',')) {
		const [mediaType, ...params] = entry.split(';').map((part) => part.trim().toLowerCase());
		const [type, subtype] = mediaType.split('/');
		const qualityParam = params.find((param) => param.startsWith('q='));
		const quality = qualityParam === undefined ? 1 : Number(qualityParam.slice(2));

		if (type && subtype && Number.isFinite(quality) && quality >= 0 && quality <= 1) {
			ranges.push({ type, subtype, quality });
		}
	}

	return ranges;
}

/**
 * Finds the most specific media range matching a candidate type, as RFC 9110 section 12.5.1 requires.
 * @param ranges Parsed media ranges
 * @param candidate Candidate media type, such as `text/html`
 * @returns The matching range's quality and specificity, or `null` when no range matches
 */
function matchRange(ranges: MediaRange[], candidate: string): RangeMatch | null {
	const [type, subtype] = candidate.split('/');
	let best: RangeMatch | null = null;

	for (const range of ranges) {
		let specificity = 0;
		if (range.type === type && range.subtype === subtype) {
			specificity = 3;
		} else if (range.type === type && range.subtype === '*') {
			specificity = 2;
		} else if (range.type === '*' && range.subtype === '*') {
			specificity = 1;
		}

		if (specificity > 0 && (best === null || specificity > best.specificity)) {
			best = { quality: range.quality, specificity };
		}
	}

	return best;
}

/**
 * Chooses between the HTML and Markdown representations of a page for an `Accept` header.
 *
 * HTML is the default for a missing header, the full wildcard, and every browser. Markdown is chosen when it carries a
 * higher weight than HTML, or the same weight with `text/markdown` named explicitly, since browsers never name it.
 * @param accept Raw `Accept` header value, or `null` when the request has none
 * @returns The representation to serve, or `not-acceptable` when the client accepts neither
 */
export function negotiateContentType(accept: string | null): PageRepresentation {
	const ranges = parseAccept(accept ?? '');
	if (ranges.length === 0) {
		return 'html';
	}

	const html = matchRange(ranges, 'text/html');
	const markdown = matchRange(ranges, 'text/markdown');
	const htmlQuality = html?.quality ?? 0;
	const markdownQuality = markdown?.quality ?? 0;

	if (htmlQuality === 0 && markdownQuality === 0) {
		return 'not-acceptable';
	}

	if (markdownQuality > htmlQuality || (markdownQuality === htmlQuality && markdown?.specificity === 3)) {
		return 'markdown';
	}

	return 'html';
}
