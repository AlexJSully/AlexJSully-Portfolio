import '@testing-library/jest-dom';

// Polyfills for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
	global.TextEncoder = require('util').TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
	global.TextDecoder = require('util').TextDecoder;
}

// Every test starts without cookies, so a consent choice saved by one test never leaks into the next.
afterEach(() => {
	if (typeof document === 'undefined') {
		return;
	}

	for (const pair of document.cookie.split(';')) {
		const name = pair.trim().split('=')[0];
		if (name) {
			document.cookie = `${name}=; max-age=0; path=/`;
		}
	}
});
