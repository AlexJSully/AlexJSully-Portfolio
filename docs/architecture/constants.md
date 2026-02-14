# Constants Module

The constants module centralizes timing, thresholds, and configuration values used throughout the application. These values control interactive behaviors, network detection, and animations.

## Why Centralize Constants?

Using a single source of truth for magic numbers provides:

- **Easier Tuning:** Change behavior across the app by editing one file
- **Testability:** Constants can be imported and verified in tests
- **Maintainability:** No hunting through components to find timing values
- **Documentation:** Descriptive names make values self-explanatory

## Module Exports

The module exports four const objects, each grouping related values:

### `DELAYS`

Debounce delays and timing values in milliseconds:

- `CONSOLE_LOGO_DEBOUNCE` (1000ms) — Prevents duplicate ASCII logo prints in console
- `PROJECT_HOVER_VIDEO` (1000ms) — Delay before showing video on project card hover
- `AVATAR_SNEEZE_DEBOUNCE` (100ms) — Debounce for avatar hover interactions
- `STAR_ANIMATION_INITIAL` (1000ms) — Initial delay for forced star shooting animations

**Usage:** Import to control debouncing and timing in components.

### `THRESHOLDS`

Trigger thresholds for interactive features:

- `SNEEZE_TRIGGER_INTERVAL` (5) — Number of hovers before avatar sneeze animation
- `AAAAHHHH_TRIGGER_COUNT` (6) — Number of sneezes before Easter egg activation
- `MIN_STARS_FOR_ANIMATION` (15) — Minimum stars required before forcing animation

**Usage:** Import to control when interactions trigger animations or Easter eggs.

### `NETWORK`

Network performance thresholds for adaptive loading:

- `SLOW_DOWNLINK_THRESHOLD` (1.5 Mbps) — Maximum speed considered slow
- `FAST_RTT_THRESHOLD` (100ms) — Maximum round-trip time considered fast
- `SLOW_NETWORK_TYPES` (['slow-2g', '2g', '3g']) — Network types always considered slow

**Usage:** Import in [isNetworkFast()](../../src/util/isNetworkFast.ts) to determine whether to autoplay videos.

### `ANIMATIONS`

Multi-stage animation durations in milliseconds:

- `SNEEZE_STAGE_1` (500ms) — First frame of avatar sneeze
- `SNEEZE_STAGE_2` (300ms) — Second frame of avatar sneeze
- `SNEEZE_STAGE_3` (1000ms) — Final frame of avatar sneeze

**Usage:** Import to sequence the avatar sneeze animation in [Avatar component](../../src/components/banner/Avatar.tsx).

Implementation: [src/constants/index.ts](../../src/constants/index.ts)

- [Utils Documentation](./utils.md) - Utility functions that use these constants
- [Helpers Documentation](./helpers.md) - Helper functions that use these constants
- [Components Documentation](./components/index.md) - Components that consume constants
