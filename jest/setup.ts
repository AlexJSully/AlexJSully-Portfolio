import '@testing-library/jest-dom';

// Polyfills for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
	global.TextEncoder = require('util').TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
	global.TextDecoder = require('util').TextDecoder;
}
