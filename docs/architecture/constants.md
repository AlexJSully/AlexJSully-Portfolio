# Constants Module

## Overview

The `constants` module provides centralized application-wide configuration values, thresholds, and magic numbers used throughout the codebase. This approach improves maintainability, testability, and makes it easier to tune application behavior.

## Location

**Path:** `src/constants/index.ts`

## Module Exports

### `DELAYS`

Time delays in milliseconds for various debounce and timing operations.

```typescript
export const DELAYS = {
	/** Debounce delay for console logo (1000ms) */
	CONSOLE_LOGO_DEBOUNCE: 1000,

	/** Delay before showing project video on hover (1000ms) */
	PROJECT_HOVER_VIDEO: 1000,

	/** Delay for avatar sneeze debounce (100ms) */
	AVATAR_SNEEZE_DEBOUNCE: 100,

	/** Initial delay for force star animation (1000ms) */
	STAR_ANIMATION_INITIAL: 1000,
} as const;
```

**Usage Example:**

```typescript
import { DELAYS } from '@constants/index';

const debouncedFunc = debounce(handler, DELAYS.AVATAR_SNEEZE_DEBOUNCE);
```

---

### `THRESHOLDS`

Trigger thresholds for interactive features and animations.

```typescript
export const THRESHOLDS = {
	/** Number of hovers before triggering sneeze (5) */
	SNEEZE_TRIGGER_INTERVAL: 5,

	/** Total sneezes before triggering aaaahhhh easter egg (6) */
	AAAAHHHH_TRIGGER_COUNT: 6,

	/** Minimum number of stars before forcing animation (15) */
	MIN_STARS_FOR_ANIMATION: 15,
} as const;
```

**Usage Example:**

```typescript
import { THRESHOLDS } from '@constants/index';

if (hoverCount % THRESHOLDS.SNEEZE_TRIGGER_INTERVAL === 0) {
	triggerSneeze();
}
```

---

### `NETWORK`

Network performance thresholds used to detect slow connections and adapt behavior accordingly.

```typescript
export const NETWORK = {
	/** Maximum downlink speed (Mbps) to be considered slow (1.5) */
	SLOW_DOWNLINK_THRESHOLD: 1.5,

	/** Maximum RTT (ms) to be considered fast (100) */
	FAST_RTT_THRESHOLD: 100,

	/** Network types considered slow */
	SLOW_NETWORK_TYPES: ['slow-2g', '2g', '3g'] as const,
} as const;
```

**Usage Example:**

```typescript
import { NETWORK } from '@constants/index';

const isSlow = connection.downlink < NETWORK.SLOW_DOWNLINK_THRESHOLD;
```

---

### `ANIMATIONS`

Animation duration values in milliseconds for multi-stage animations.

```typescript
export const ANIMATIONS = {
	/** Avatar sneeze animation stage 1 (500ms) */
	SNEEZE_STAGE_1: 500,

	/** Avatar sneeze animation stage 2 (300ms) */
	SNEEZE_STAGE_2: 300,

	/** Avatar sneeze animation stage 3 (1000ms) */
	SNEEZE_STAGE_3: 1000,
} as const;
```

**Usage Example:**

```typescript
import { ANIMATIONS } from '@constants/index';

setTimeout(() => {
	setImage('sneeze_2');
}, ANIMATIONS.SNEEZE_STAGE_1);
```

---

## Design Rationale

### Why Centralize Constants?

1. **Single Source of Truth:** All timing and threshold values are defined in one place
2. **Easier Tuning:** Adjust application behavior by changing values in one file
3. **Better Testing:** Constants can be imported and verified in tests
4. **Type Safety:** Using `as const` provides literal type inference
5. **Documentation:** Constants are self-documenting with descriptive names

### Best Practices

- **Always use constants instead of magic numbers** in application code
- **Document what each constant represents** using JSDoc comments
- **Group related constants** under appropriate namespaces
- **Use `as const`** for immutability and better type inference
- **Test constants** to ensure they have expected values

---

## Testing

The constants module includes comprehensive unit tests to verify:

- All constant values are positive numbers (where applicable)
- All required constants are exported
- Constants have expected types and structures

**Test Location:** `src/constants/index.test.ts`

---

## Migration Guide

When encountering magic numbers in code, follow these steps:

1. Identify the magic number and its purpose
2. Add an appropriately named constant to the relevant group
3. Replace the magic number with the constant import
4. Update tests if necessary
5. Update documentation

**Example:**

```typescript
// After
import { DELAYS } from '@constants/index';

// Before
setTimeout(handler, 1000);

setTimeout(handler, DELAYS.CONSOLE_LOGO_DEBOUNCE);
```

---

## See Also

- [Utils Documentation](./utils.md) - Utility functions that use these constants
- [Helpers Documentation](./helpers.md) - Helper functions that use these constants
- [Components Documentation](./components/index.md) - Components that consume constants
