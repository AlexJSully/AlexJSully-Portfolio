import { ACCEPT_ALL } from '@util/consent/consentStore';
import { clearUnconsentedStorage } from './clearUnconsentedStorage';

// navigator.serviceWorker, Cache Storage, and IndexedDB are browser APIs jsdom omits.
const unregister = jest.fn().mockResolvedValue(true);
const deleteDatabase = jest.fn();
const deleteCache = jest.fn().mockResolvedValue(true);

beforeAll(() => {
	Object.defineProperty(navigator, 'serviceWorker', {
		configurable: true,
		value: { getRegistrations: jest.fn().mockResolvedValue([{ unregister }]) },
	});
	Object.defineProperty(globalThis, 'caches', {
		configurable: true,
		value: { delete: deleteCache, keys: jest.fn().mockResolvedValue(['runtime-cache']) },
	});
	Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: { deleteDatabase } });
});

afterAll(() => {
	Reflect.deleteProperty(navigator, 'serviceWorker');
	Reflect.deleteProperty(globalThis, 'caches');
	Reflect.deleteProperty(globalThis, 'indexedDB');
});

describe('clearUnconsentedStorage', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		document.cookie = '_ga=GA1.1.123; path=/';
		document.cookie = '_ga_ABC123=GS1.1.456; path=/';
		document.cookie = 'unrelated=keep; path=/';
	});

	afterEach(() => {
		document.cookie = 'unrelated=; max-age=0; path=/';
	});

	it('clears analytics and offline storage for an undecided visitor', async () => {
		await clearUnconsentedStorage(null);

		expect(document.cookie).not.toContain('_ga');
		expect(document.cookie).toContain('unrelated=keep');
		expect(deleteDatabase).toHaveBeenCalledWith('firebase-installations-database');
		expect(deleteDatabase).toHaveBeenCalledWith('firebase-heartbeat-database');
		expect(unregister).toHaveBeenCalled();
		expect(deleteCache).toHaveBeenCalledWith('runtime-cache');
	});

	it('keeps everything the visitor allowed', async () => {
		await clearUnconsentedStorage(ACCEPT_ALL);

		expect(document.cookie).toContain('_ga=GA1.1.123');
		expect(deleteDatabase).not.toHaveBeenCalled();
		expect(unregister).not.toHaveBeenCalled();
		expect(deleteCache).not.toHaveBeenCalled();
	});

	it('clears only the purposes that are refused', async () => {
		await clearUnconsentedStorage({ analytics: true, media: false, offline: false, linkIcons: false });

		expect(document.cookie).toContain('_ga=GA1.1.123');
		expect(unregister).toHaveBeenCalled();
	});
});
