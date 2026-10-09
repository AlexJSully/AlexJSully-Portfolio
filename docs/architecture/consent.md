# Consent

Nothing optional runs, and nothing optional is stored on the visitor's device, until the visitor allows it. This page records how the site asks for consent, what each choice switches on, and how a choice is stored and withdrawn. The visitor-facing account is the privacy and cookie policy in [`src/data/policy.ts`](../../src/data/policy.ts), shown in the policy dialog and in the Markdown home page.

## Purposes

Each optional service belongs to one purpose, a flag in `ConsentChoices` in [`consentStore.ts`](../../src/util/consent/consentStore.ts). [`ConsentedServices`](../../src/components/consent/services/ConsentedServices.tsx), mounted once in the root layout, starts the services for Analytics and Offline access, and [`instrumentation-client.ts`](../../src/instrumentation-client.ts) starts Sentry's browser error reporting before hydration when Analytics is already allowed; the components that embed videos and draw link icons read their own purpose, as the table below names.

| Purpose         | Flag        | What it starts                                                                                                                                                                                                                              |
| --------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Analytics       | `analytics` | `init()` in [`firebase.ts`](../../src/configs/firebase.ts) (Firebase Analytics and Performance Monitoring), Vercel Speed Insights, and `startErrorReporting()` in [`sentry.ts`](../../src/configs/sentry.ts) (Sentry browser error reports) |
| Embedded videos | `media`     | The YouTube preview a project card plays on hover in [`ProjectsGrid`](../../src/components/projects/ProjectsGrid.tsx), from `youtube-nocookie.com`                                                                                          |
| Link icons      | `linkIcons` | The linked site's own icon beside each phrase link, through [`LinkIcon`](../../src/components/link-icon/LinkIcon.tsx), fetched from DuckDuckGo's icon proxy; refused, links carry a generated globe                                         |
| Offline access  | `offline`   | [`ServiceWorkerRegister`](../../src/components/ServiceWorkerRegister.tsx), which registers [`sw.js`](../../public/sw.js)                                                                                                                    |

Essential processing has no flag and needs no consent: Vercel's hosting logs and server-side Sentry error reports (browser error reports belong to Analytics), which no browser setting can gate, and the consent cookie itself.

`init()` sets Google Consent Mode with analytics storage granted and every advertising signal denied, and turns off Google signals and ad-personalization signals in the tag configuration. The site has no advertising purpose, so no consent choice can turn those on. The Firebase SDK is fetched inside `init()`, so a visitor who never allows Analytics never downloads it.

## Asking and storing

[`ConsentBanner`](../../src/components/consent/banner/ConsentBanner.tsx) asks on the first visit. "Essential only" and "Accept all" share one style so neither is favoured, "Customize" shows a switch per purpose through [`ConsentControls`](../../src/components/consent/controls/ConsentControls.tsx), and pressing Escape or clicking elsewhere chooses nothing. The banner is not rendered on the server, so a visitor who has already chosen never sees it flash before the page hydrates.

The choice is one first-party cookie, `cookie-consent`, holding the consent version, the four flags, and the time the choice was made (the record GDPR Article 7(1) asks for). It lasts `CONSENT_MAX_AGE_DAYS`, 180 days, after which the banner asks again. A value from an earlier `CONSENT_VERSION`, or the `true` the earlier notice wrote, counts as undecided; raising `CONSENT_VERSION` when a vendor or purpose changes asks every visitor again. A saved choice is posted on a `BroadcastChannel` named after the cookie, so the site's other open tabs start or clear services without a reload.

A Global Privacy Control or Do Not Track signal is not treated as a choice. The visitor stays undecided, so nothing optional runs and the banner still asks; treating the signal as "Essential only" would hide the banner from anyone whose browser sends it by default, with no way to allow anything.

## Withdrawing

"Cookie settings" in the footer is a [`PanelLink`](../../src/components/panel-link/PanelLink.tsx) that reopens the banner with its switches without changing the URL. Its `href` to `/#cookie-settings` keeps it working before the page hydrates. The policy dialog carries the same switches. On every page load, not only when a choice changes, and once the browser is idle ([`runWhenIdle`](../../src/util/runWhenIdle.ts)), [`clearUnconsentedStorage`](../../src/util/consent/clearUnconsentedStorage.ts) removes what each refused purpose stored: Google Analytics cookies and Firebase's IndexedDB databases for Analytics, and every service worker registration and cache for Offline access. It runs on load because storage can predate the banner. A newer choice cancels clearing still queued for an earlier one, so it never removes storage the visitor has since allowed. Firebase cannot be stopped once started, so withdrawing Analytics reloads the page after clearing.

## Related documentation

- [Consent banner](./components/consent-banner.md) - The banner, the switches, and the policy dialog
- [Service Worker Implementation](./service-worker.md) - What Offline access registers
- [Agent Readiness](./agent-readiness.md) - The policy paths that open the dialog
