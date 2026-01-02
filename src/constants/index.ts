/** Time delays (in milliseconds) */
export const DELAYS = {
	/** Debounce delay for console logo */
	CONSOLE_LOGO_DEBOUNCE: 1000,
	/** Delay before showing project video on hover */
	PROJECT_HOVER_VIDEO: 1000,
	/** Delay for avatar sneeze debounce */
	AVATAR_SNEEZE_DEBOUNCE: 100,
	/** Initial delay for force star animation */
	STAR_ANIMATION_INITIAL: 1000,
} as const;

/** Trigger thresholds */
export const THRESHOLDS = {
	/** Number of hovers before triggering sneeze */
	SNEEZE_TRIGGER_INTERVAL: 5,
	/** Total sneezes before triggering aaaahhhh */
	AAAAHHHH_TRIGGER_COUNT: 6,
	/** Minimum number of stars before forcing animation */
	MIN_STARS_FOR_ANIMATION: 15,
} as const;

/** Network performance thresholds */
export const NETWORK = {
	/** Maximum downlink speed (Mbps) to be considered slow */
	SLOW_DOWNLINK_THRESHOLD: 1.5,
	/** Maximum RTT (ms) to be considered fast */
	FAST_RTT_THRESHOLD: 100,
	/** Network types considered slow */
	SLOW_NETWORK_TYPES: ['slow-2g', '2g', '3g'] as const,
} as const;

/** Animation durations (in milliseconds) */
export const ANIMATIONS = {
	/** Avatar sneeze animation stages */
	SNEEZE_STAGE_1: 500,
	SNEEZE_STAGE_2: 300,
	SNEEZE_STAGE_3: 1000,
} as const;
