import { screen } from '@testing-library/react';
import { aaaahhhh, aaaahhhhImage, convertAAAAHH, imageAAAAHHHH, textAAAAHHHH } from './aaaahhhh';

describe('aaaahhhh', () => {
	afterEach(() => {
		document.body.innerHTML = '';
		document.title = '';
	});

	describe('convertAAAAHH', () => {
		it.each([
			{ label: 'lower-case words, keeping the space', input: 'hello world', expected: 'aaaaa hhhhh' },
			{ label: 'an upper-case word', input: 'HELLO', expected: 'AAAHH' },
			{ label: 'a mixed-case word', input: 'Hello', expected: 'Aaahh' },
			{ label: 'an even-length string at its midpoint', input: 'aaaaahhhhh', expected: 'aaaaahhhhh' },
			{ label: 'an empty string', input: '', expected: '' },
			{ label: 'a whitespace-only string', input: '     ', expected: '     ' },
		])('converts $label', ({ input, expected }) => {
			expect(convertAAAAHH(input)).toBe(expected);
		});
	});

	describe('textAAAAHHHH', () => {
		it('converts direct text, removes the carousel, and reveals the no-motion description', () => {
			document.body.innerHTML = `
				<span id="span">hello</span>
				<h1>HELLO</h1>
				<button type="button">button</button>
				<div id="untouched">untouched</div>
				<div id="description-Carousel">carousel</div>
				<div id="no-motion-description" hidden></div>
			`;

			textAAAAHHHH();

			expect(document.getElementById('span')).toHaveTextContent('aaahh');
			expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('AAAHH');
			expect(screen.getByRole('button')).toHaveTextContent('aaahhh');
			expect(document.getElementById('untouched')).toHaveTextContent('untouched');
			expect(document.getElementById('description-Carousel')).toBeNull();
			expect(document.getElementById('no-motion-description')).not.toHaveAttribute('hidden');
		});

		it('converts only the direct text children of each element', () => {
			document.body.innerHTML = '<p id="paragraph">world <em>inner</em></p>';

			textAAAAHHHH();

			expect(document.getElementById('paragraph')?.textContent).toBe('aaahh inner');
		});

		it('converts text when the carousel and no-motion elements are absent', () => {
			document.body.innerHTML = '<span id="span">hello</span>';

			expect(() => textAAAAHHHH()).not.toThrow();
			expect(document.getElementById('span')).toHaveTextContent('aaahh');
		});
	});

	describe('imageAAAAHHHH', () => {
		beforeEach(() => {
			document.body.innerHTML = `
				<div id="background" style="background-image: url(/some/old/image.jpg)"></div>
				<div id="no-background" style="color: red"></div>
				<img src="/some/old/image.jpg" srcset="/some/old/image-set.jpg 2x" alt="old" />
				<img alt="no source" />
				<div id="sky"></div>
			`;

			imageAAAAHHHH();
		});

		it('replaces the background image of a styled div', () => {
			expect(document.getElementById('background')?.style.backgroundImage).toBe(`url("${aaaahhhhImage}")`);
		});

		it('replaces the src and srcset of each image', () => {
			const image = screen.getByRole('img', { name: 'old' });

			expect(image).toHaveAttribute('src', aaaahhhhImage);
			expect(image).toHaveAttribute('srcset', aaaahhhhImage);
		});

		it('covers the sky element with the image, unrepeated', () => {
			const sky = document.getElementById('sky');

			expect(sky?.style.backgroundImage).toBe(`url("${aaaahhhhImage}")`);
			expect(sky?.style.backgroundRepeat).toBe('no-repeat');
			expect(sky?.style.backgroundSize).toBe('cover');
		});

		it('leaves a div with no background image and an image with no source untouched', () => {
			const image = screen.getByRole('img', { name: 'no source' });

			expect(document.getElementById('no-background')?.style.backgroundImage).toBe('');
			expect(image).not.toHaveAttribute('src');
			expect(image).not.toHaveAttribute('srcset');
		});
	});

	describe('aaaahhhh', () => {
		it('retitles the page and transforms its images and text', () => {
			document.body.innerHTML = '<h1>HELLO</h1><img src="/some/old/image.jpg" alt="old" />';

			aaaahhhh();

			expect(document.title).toBe("Alexander Sullivan's AAAAHHHHH");
			expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('AAAHH');
			expect(screen.getByRole('img', { name: 'old' })).toHaveAttribute('src', aaaahhhhImage);
		});
	});
});
