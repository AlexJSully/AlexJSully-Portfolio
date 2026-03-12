import { NETWORK } from '@constants/index';

/** Network connection information interface */
interface NetworkInformation {
	saveData?: boolean;
	effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
	downlink?: number;
	rtt?: number;
}

interface NavigatorWithConnection extends Navigator {
	connection?: NetworkInformation;
}

/**
 * Checks if the current network connection is fast.
 *
 * Uses the Network Information API to determine connection quality based on:
 * - Data saver mode (saveData flag indicates user preference for reduced data usage)
 * - Effective connection type (2g, 3g, 4g, slow-2g categorization)
 * - Downlink speed in Mbps (>= 1.5 Mbps considered fast for video/media)
 * - Round-trip time in milliseconds (<= 100ms considered fast for interactivity)
 *
 * Threshold rationale:
 * - 1.5 Mbps downlink: Sufficient for video playback and heavy asset loading
 * - 100ms RTT: Acceptable for interactive features and real-time responsiveness
 * - Slow network types (2g, slow-2g, 3g): Limited performance for heavy assets
 *
 * @returns {boolean} True if the network connection is fast, false if slow or saving data.
 *                   Returns true if Network Information API is unavailable (optimistic assumption).
 */
export function isNetworkFast(): boolean {
	// Check if the connection API is available in the navigator
	if ('connection' in navigator) {
		/** Get the connection object from the navigator */
		const connection = (navigator as NavigatorWithConnection).connection;

		if (!connection) {
			return true;
		}

		if (connection.saveData) {
			// Save data mode is enabled
			return false;
		}

		/** Check if the network is slow based on the known slow network types */
		const slowType = connection.effectiveType
			? (NETWORK.SLOW_NETWORK_TYPES as readonly string[]).includes(connection.effectiveType)
			: false;
		/** Check if the network is slow based on the downlink/download speed */
		const slowDown =
			connection.downlink !== undefined ? connection.downlink < NETWORK.SLOW_DOWNLINK_THRESHOLD : false;
		/** Check if the network is slow based on the round-trip time (RTT) */
		const slowRTT = connection.rtt !== undefined ? connection.rtt > NETWORK.FAST_RTT_THRESHOLD : false;

		return !(slowType || slowDown || slowRTT);
	}

	// Assume fast network if the API is not supported
	return true;
}
