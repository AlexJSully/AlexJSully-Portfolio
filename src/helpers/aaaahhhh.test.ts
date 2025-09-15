import { aaaahhhhImage, imageAAAAHHHH } from './aaaahhhh';

describe('aaaahhhh', () => {
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
