/**
 * Checks if the current network connection is fast.
 *
 * @returns {boolean} True if the network is fast, false otherwise.
 */
export function isNetworkFast(): boolean {
	// Check if the connection API is available in the navigator
	if ('connection' in navigator) {
		/** Get the connection object from the navigator */
		const connection = (navigator as any).connection;

		if (connection.saveData) {
			// Save data mode is enabled
			return false;
		}

		/** Check if the network is slow based on the known slow network types */
		const slowType = ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
		/** Check if the network is slow based on the downlink/download speed */
		const slowDown = connection.downlink < 1.5;
		/** Check if the network is slow based on the round-trip time (RTT) */
		const slowRTT = connection.rtt > 100;

		return !(slowType || slowDown || slowRTT);
	}

	// Assume fast network if the API is not supported
	return true;
}
