import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from "web-vitals";

const reportWebVitals = () => {
	if (sendToGoogleAnalytics) {
		onCLS(sendToGoogleAnalytics);
		onFCP(sendToGoogleAnalytics);
		onFID(sendToGoogleAnalytics);
		onINP(sendToGoogleAnalytics);
		onLCP(sendToGoogleAnalytics);
		onTTFB(sendToGoogleAnalytics);
	}
};

function sendToGoogleAnalytics({ name, delta, value, id }) {
	// Assumes the global `gtag()` function exists, see:
	// https://developers.google.com/analytics/devguides/collection/ga4
	// eslint-disable-next-line no-undef
	gtag("event", name, {
		event_category: "Web Vitals",
		// The `id` value will be unique to the current page load. When sending
		// multiple values from the same page (e.g. for CLS), Google Analytics can
		// compute a total by grouping on this ID (note: requires `eventLabel` to
		// be a dimension in your report).
		event_label: id,
		// Use a non-interaction event to avoid affecting bounce rate.
		non_interaction: true,

		// Built-in params:
		value: delta, // Use `delta` so the value can be summed.
		// Custom params:
		metric_id: id, // Needed to aggregate events.
		metric_value: value, // Optional.
		metric_delta: delta, // Optional.

		// OPTIONAL: any additional params or debug info here.
		// See: https://web.dev/debug-performance-in-the-field/
		// metric_rating: 'good' | 'needs-improvement' | 'poor',
		// debug_info: '...',
		// ...
	});
}

export default reportWebVitals;
