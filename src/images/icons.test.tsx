import { render } from '@testing-library/react';
import * as Icons from './icons';

describe('Icon exports', () => {
	const iconMap = [
		{ name: 'BarIcon' },
		{ name: 'BlueSkyIcon' },
		{ name: 'GitHubIcon' },
		{ name: 'ImpactDepthIcon' },
		{ name: 'InstagramIcon' },
		{ name: 'LinkedInIcon' },
		{ name: 'MPXIcon' },
		{ name: 'MetaIcon' },
		{ name: 'PublishIcon' },
		{ name: 'SciGradeIcon' },
		{ name: 'SmallDevTalkIcon' },
		{ name: 'ThreadsIcon' },
		{ name: 'TwitchIcon' },
		{ name: 'UofTIcon' },
		{ name: 'VerilyIcon' },
		{ name: 'XIcon' },
	];

	iconMap.forEach(({ name }) => {
		it(`${name} renders without crashing and has SVG`, () => {
			const Icon = (Icons as any)[name];
			const { container } = render(<Icon data-custom='foo' />);
			// Should render an SVG element
			const svg = container.querySelector('svg');
			expect(svg).toBeInTheDocument();
			// Should pass custom props
			expect(svg?.getAttribute('data-custom')).toBe('foo');
		});
	});
});
