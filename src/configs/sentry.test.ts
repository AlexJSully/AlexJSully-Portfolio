const mockInit = jest.fn();
const mockCaptureException = jest.fn();
const mockConsoleIntegration = { name: 'CaptureConsole' };
const mockCaptureConsoleIntegration = jest.fn(() => mockConsoleIntegration);

// The Sentry SDK sends reports over the network; this wrapper sits directly on it.
jest.mock('@sentry/nextjs', () => ({
	captureConsoleIntegration: mockCaptureConsoleIntegration,
	captureException: mockCaptureException,
	init: mockInit,
}));

/**
 * Loads a fresh copy of the wrapper, so each test starts with Sentry not yet running.
 * @returns The wrapper module
 */
function loadSentry(): typeof import('./sentry') {
	let sentry = {} as typeof import('./sentry');
	jest.isolateModules(() => {
		sentry = jest.requireActual('./sentry');
	});
	return sentry;
}

describe('sentry config', () => {
	const originalEnv = process.env;

	beforeEach(() => {
		jest.clearAllMocks();
		process.env = { ...originalEnv, NEXT_PUBLIC_SENTRY_DSN: 'https://public@o0.ingest.sentry.io/0' };
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	it('starts the browser SDK with the DSN and without user fields, cookies, or request bodies', async () => {
		await loadSentry().startErrorReporting();

		expect(mockInit).toHaveBeenCalledTimes(1);
		expect(mockInit).toHaveBeenCalledWith(
			expect.objectContaining({
				dsn: 'https://public@o0.ingest.sentry.io/0',
				dataCollection: { userInfo: false, cookies: false, httpBodies: [] },
			}),
		);
		expect(mockInit.mock.calls[0][0]).not.toHaveProperty('tracesSampleRate');
	});

	it('drops tracing and session counting from the defaults, and adds console error capture', async () => {
		await loadSentry().startErrorReporting();
		const { integrations } = mockInit.mock.calls[0][0];

		const kept = integrations([{ name: 'GlobalHandlers' }, { name: 'BrowserTracing' }, { name: 'BrowserSession' }]);

		expect(kept).toEqual([{ name: 'GlobalHandlers' }, mockConsoleIntegration]);
		expect(mockCaptureConsoleIntegration).toHaveBeenCalledWith({ levels: ['error'] });
	});

	it('shares one start between repeated calls', async () => {
		const sentry = loadSentry();

		await Promise.all([sentry.startErrorReporting(), sentry.startErrorReporting()]);

		expect(mockInit).toHaveBeenCalledTimes(1);
	});

	it('retries on the next call after a failed start', async () => {
		mockInit.mockImplementationOnce(() => {
			throw new Error('blocked');
		});
		const sentry = loadSentry();

		await sentry.startErrorReporting();
		await sentry.startErrorReporting();

		expect(mockInit).toHaveBeenCalledTimes(2);
	});

	it('reports nothing before error reporting has started', async () => {
		await loadSentry().captureError(new Error('boom'));

		expect(mockCaptureException).not.toHaveBeenCalled();
	});

	it('reports an error once error reporting has started', async () => {
		const sentry = loadSentry();
		const error = new Error('boom');

		void sentry.startErrorReporting();
		await sentry.captureError(error);

		expect(mockCaptureException).toHaveBeenCalledWith(error);
	});
});
