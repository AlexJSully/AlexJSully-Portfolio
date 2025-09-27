import { aaaahhhh, aaaahhhhImage, convertAAAAHH, imageAAAAHHHH, textAAAAHHHH } from './aaaahhhh';

describe('aaaahhhh', () => {
	describe('convertAAAAHH', () => {
		it('should convert a string to AAAAHHHH format', () => {
			expect(convertAAAAHH('hello world')).toBe('aaaaa hhhhh');
			expect(convertAAAAHH('HELLO')).toBe('AAAHH');
			expect(convertAAAAHH('aaaaahhhhh')).toBe('aaaaahhhhh');
			expect(convertAAAAHH('')).toBe('');
		});

		it('should handle empty and whitespace-only strings', () => {
			expect(convertAAAAHH('     ')).toBe('     ');
		});
	});

	describe('textAAAAHHHH', () => {
		let mockSpan: any, mockP: any, mockH1: any, mockButton: any, mockCarousel: any, mockNoMotion: any;
		beforeEach(() => {
			mockSpan = { childNodes: [{ nodeName: '#text', textContent: 'hello' }] };
			mockP = { childNodes: [{ nodeName: '#text', textContent: 'world' }] };
			mockH1 = { childNodes: [{ nodeName: '#text', textContent: 'HELLO' }] };
			mockButton = { childNodes: [{ nodeName: '#text', textContent: 'button' }] };
			mockCarousel = { remove: jest.fn() };
			mockNoMotion = { removeAttribute: jest.fn() };

			jest.spyOn(document, 'getElementsByTagName').mockImplementation((tag: string) => {
				let arr: any[] = [];
				if (tag === 'span') arr = [mockSpan];
				if (tag === 'p') arr = [mockP];
				if (tag === 'h1') arr = [mockH1];
				if (tag === 'h2' || tag === 'h3') arr = [];
				if (tag === 'button') arr = [mockButton];
				// Return as HTMLCollectionOf<Element>
				return Object.assign(
					{
						length: arr.length,
						item: (i: number) => arr[i] ?? null,
						namedItem: () => null,
						[Symbol.iterator]: function* () {
							for (let el of arr) yield el;
						},
					},
					arr,
				) as unknown as HTMLCollectionOf<Element>;
			});
			jest.spyOn(document, 'getElementById').mockImplementation((id) => {
				if (id === 'description-Carousel') return mockCarousel;
				if (id === 'no-motion-description') return mockNoMotion;
				return null;
			});
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('should convert text nodes and remove carousel/enable no-motion', () => {
			textAAAAHHHH();
			expect(mockSpan.childNodes[0].textContent).toBe('aaahh');
			expect(mockP.childNodes[0].textContent).toBe('aaahh');
			expect(mockH1.childNodes[0].textContent).toBe('AAAHH');
			expect(mockButton.childNodes[0].textContent).toBe('aaahhh');
			expect(mockCarousel.remove).toHaveBeenCalled();
			expect(mockNoMotion.removeAttribute).toHaveBeenCalledWith('hidden');
		});

		it('should not throw if elements are missing', () => {
			jest.spyOn(document, 'getElementById').mockReturnValue(null);
			expect(() => textAAAAHHHH()).not.toThrow();
		});
	});

	describe('aaaahhhhImage', () => {
		it('should export the correct image path', () => {
			expect(aaaahhhhImage).toBe('/images/aaaahhhh/aaaahhhh.webp');
		});
	});

	describe('imageAAAAHHHH', () => {
		let mockQuerySelectorAll: jest.SpyInstance;
		let mockGetElementsByTagName: jest.SpyInstance;
		let mockGetElementById: jest.SpyInstance;

		beforeEach(() => {
			mockQuerySelectorAll = jest.spyOn(document, 'querySelectorAll');
			mockGetElementsByTagName = jest.spyOn(document, 'getElementsByTagName');
			mockGetElementById = jest.spyOn(document, 'getElementById');
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('should replace background images in divs with style attribute', () => {
			const mockDiv = {
				style: {
					backgroundImage: 'url(/some/old/image.jpg)',
				},
			} as HTMLElement;

			mockQuerySelectorAll.mockReturnValue([mockDiv] as any);
			mockGetElementsByTagName.mockReturnValue([] as any);
			mockGetElementById.mockReturnValue(null);

			imageAAAAHHHH();

			expect(mockQuerySelectorAll).toHaveBeenCalledWith('div[style]');
			expect(mockDiv.style.backgroundImage).toBe(`url(${aaaahhhhImage})`);
		});

		it('should replace src attribute in img elements', () => {
			const mockImg = {
				src: '/some/old/image.jpg',
				srcset: '/some/old/image-set.jpg',
			} as HTMLImageElement;

			mockQuerySelectorAll.mockReturnValue([] as any);
			mockGetElementsByTagName.mockReturnValue([mockImg] as any);
			mockGetElementById.mockReturnValue(null);

			imageAAAAHHHH();

			expect(mockGetElementsByTagName).toHaveBeenCalledWith('img');
			expect(mockImg.src).toBe(aaaahhhhImage);
			expect(mockImg.srcset).toBe(aaaahhhhImage);
		});

		it('should replace background image of sky element', () => {
			const mockSkyElement = {
				style: {
					backgroundImage: '',
					backgroundRepeat: '',
					backgroundSize: '',
				},
			} as HTMLElement;

			mockQuerySelectorAll.mockReturnValue([] as any);
			mockGetElementsByTagName.mockReturnValue([] as any);
			mockGetElementById.mockReturnValue(mockSkyElement);

			imageAAAAHHHH();

			expect(mockGetElementById).toHaveBeenCalledWith('sky');
			expect(mockSkyElement.style.backgroundImage).toBe(`url(${aaaahhhhImage})`);
			expect(mockSkyElement.style.backgroundRepeat).toBe('no-repeat');
			expect(mockSkyElement.style.backgroundSize).toBe('cover');
		});

		it('should handle elements without background images or src', () => {
			const mockDivNoStyle = { style: {} } as HTMLElement;
			const mockImgNoSrc = {} as HTMLImageElement;

			mockQuerySelectorAll.mockReturnValue([mockDivNoStyle] as any);
			mockGetElementsByTagName.mockReturnValue([mockImgNoSrc] as any);
			mockGetElementById.mockReturnValue(null);

			expect(() => imageAAAAHHHH()).not.toThrow();
		});
	});
});
