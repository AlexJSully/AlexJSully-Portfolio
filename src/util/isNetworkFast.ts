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
 * @returns {boolean} True if the network is fast, false otherwise.
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
