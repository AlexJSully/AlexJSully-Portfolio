import { MAIN_CONTENT_ID } from '@constants/routes';

/**
 * Moves focus to the main content, making it focusable only for as long as it holds focus, so the page keeps no
 * permanent `tabindex` that a click could land on.
 */
export function focusMainContent(): void {
	const main = document.getElementById(MAIN_CONTENT_ID);
	if (main === null) {
		return;
	}

	main.setAttribute('tabindex', '-1');
	main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
	main.focus();
}
