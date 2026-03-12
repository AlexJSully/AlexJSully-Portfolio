/**
 * Utility functions for GDPR-compliant cookie consent management
 */

const COOKIE_NAME = 'cookie-consent';
const COOKIE_VALUE = 'true';

/**
 * Generate cookie options string based on current environment
 * @returns Cookie attributes string (e.g., "max-age=31536000; path=/; SameSite=Strict; Secure")
 */
function getCookieOptions(): string {
	// Only include Secure flag on HTTPS connections (not on localhost)
	const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';

	return `max-age=31536000; path=/; SameSite=Strict${secure}`;
}

/**
 * Set the cookie consent cookie to indicate user has accepted
 * Only call this after explicit user action (button click, etc.)
 */
export function setCookieConsent(): void {
	document.cookie = `${COOKIE_NAME}=${COOKIE_VALUE}; ${getCookieOptions()}`;
}

/**
 * Check if the user has already accepted cookies
 * Parses document.cookie to avoid false positives from substring matching
 * @returns true if user has accepted cookies, false otherwise
 */
export function hasCookieConsent(): boolean {
	if (typeof document === 'undefined') {
		return false;
	}

	// Parse cookies into key-value pairs to avoid substring false positives
	const cookies = document.cookie.split(';');
	for (const cookie of cookies) {
		const [key, value] = cookie.trim().split('=');
		if (key === COOKIE_NAME && value === COOKIE_VALUE) {
			return true;
		}
	}

	return false;
}
