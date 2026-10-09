// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import { SENTRY_DATA_COLLECTION } from '@configs/sentry';
import * as Sentry from '@sentry/nextjs';

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

	dataCollection: SENTRY_DATA_COLLECTION,

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: 1,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
});
