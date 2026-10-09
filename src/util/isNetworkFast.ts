import { NETWORK } from '@constants/index';

/** Shape of `navigator.connection`, which TypeScript's DOM types do not yet declare. */
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
 *
 * The raw `downlink` and `rtt` estimates are not compared against thresholds: browsers round them coarsely and they
 * swing across any fixed cut-off between readings, while `effectiveType` is derived from the same measurements with
 * smoothing and is the classification the API intends callers to use.
 *
 * @returns {boolean} True if the network connection is fast, false if slow or saving data.
 *                   Returns true if Network Information API is unavailable (optimistic assumption).
 */
export function isNetworkFast(): boolean {
	if ('connection' in navigator) {
		const connection = (navigator as NavigatorWithConnection).connection;

		if (!connection) {
			return true;
		}

		if (connection.saveData) {
			return false;
		}

		return !(
			connection.effectiveType !== undefined &&
			(NETWORK.SLOW_NETWORK_TYPES as readonly string[]).includes(connection.effectiveType)
		);
	}

	// Assume a fast network where the API is unsupported, rather than degrading every asset.
	return true;
}
