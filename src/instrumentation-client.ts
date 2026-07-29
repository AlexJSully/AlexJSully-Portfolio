import * as Sentry from '@sentry/nextjs';

/** Next.js client navigation hook; opens a Sentry span for each router transition. */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
