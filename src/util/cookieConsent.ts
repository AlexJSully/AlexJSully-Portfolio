/**
 * Utility functions for GDPR-compliant cookie consent management
 */

const COOKIE_NAME = 'cookie-consent';
const COOKIE_VALUE = 'true';
const COOKIE_OPTIONS = 'max-age=31536000; path=/; SameSite=Strict; Secure';

/**
 * Set the cookie consent cookie to indicate user has accepted
 * Only call this after explicit user action (button click, etc.)
 */
export function setCookieConsent(): void {
	document.cookie = `${COOKIE_NAME}=${COOKIE_VALUE}; ${COOKIE_OPTIONS}`;
}

/**
 * Check if the user has already accepted cookies
 * @returns true if user has accepted cookies, false otherwise
 */
export function hasCookieConsent(): boolean {
	return document.cookie.includes(`${COOKIE_NAME}=${COOKIE_VALUE}`);
}
