'use client';

import profile from '@data/profile';
import { Box } from '@mui/material';
import { readConsent, subscribeConsent } from '@util/consent/consentStore';
import { glyphDataUri, linkIconFor, rememberIconMiss } from '@util/linkIcon';
import { type ReactElement, useState, useSyncExternalStore } from 'react';

/** This site's own icon, the mark for a link that stays on the site. */
const SITE_ICON = '/icon/favicon.ico';

/**
 * The canonical site origin a same-site link is judged against. The canonical URL rather than `window.location`, so the
 * server and the browser choose the same mark and hydration never mismatches, on `localhost` as in production.
 */
const SITE_ORIGIN = new URL(profile.url).origin;

interface LinkIconProps {
	/** The link's target, absolute or relative. */
	href: string;
}

/**
 * Renders the mark beside a phrase link, naming where it goes: this site's icon for a same-site link, the linked
 * site's real icon once the visitor allows Link icons, and a generated globe otherwise. A link that is not a web page,
 * such as `mailto:`, renders nothing.
 *
 * Always an `<img>` of one fixed size, so switching kinds only changes `src` and the line never reflows. A link that is
 * a whole card, or that already shows an icon, carries no mark.
 */
export default function LinkIcon({ href }: Readonly<LinkIconProps>): ReactElement | null {
	// Only the Link icons choice matters here, so other consent changes do not re-render every icon.
	const remoteAllowed = useSyncExternalStore(
		subscribeConsent,
		() => readConsent()?.linkIcons === true,
		() => false,
	);
	/** Bumped when a remote icon fails, so the render after a miss draws the globe. */
	const [, setMisses] = useState(0);

	const source = linkIconFor(href, SITE_ORIGIN, remoteAllowed);
	if (source === null) {
		return null;
	}
	const src = source.kind === 'remote' ? source.src : source.kind === 'site' ? SITE_ICON : glyphDataUri(source.hue);

	return (
		<Box
			alt=''
			component='img'
			data-kind={source.kind}
			decoding='async'
			loading='lazy'
			onError={
				source.kind === 'remote'
					? () => {
							rememberIconMiss(source.hostname);
							setMisses((count) => count + 1);
						}
					: undefined
			}
			referrerPolicy='no-referrer'
			src={src}
			sx={{
				borderRadius: '2px',
				height: '1em',
				marginInlineEnd: '0.3em',
				objectFit: 'contain',
				verticalAlign: '-0.125em',
				width: '1em',
			}}
		/>
	);
}
