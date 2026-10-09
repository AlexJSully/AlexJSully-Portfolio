import { startErrorReporting } from '@configs/sentry';
import { readConsent } from '@util/consent/consentStore';

// Runs before the page hydrates, so a visitor who allowed Analytics on an earlier visit has errors reported from the
// start. A choice made during this visit starts reporting from ConsentedServices instead.
if (readConsent()?.analytics) {
	void startErrorReporting();
}
