# Constants Module

The constants module centralizes timing, thresholds, and configuration values used throughout the application. These values control interactive behaviors, network detection, and animations.

## Why Centralize Constants?

Using a single source of truth for magic numbers provides:

- **Easier Tuning:** Change behavior across the app by editing one file
- **Testability:** Constants can be imported and verified in tests
- **Maintainability:** No hunting through components to find timing values
- **Documentation:** Descriptive names make values self-explanatory

## Module Exports

The module exports four const objects, each grouping related values, plus a standalone `MAX_STARS` value:

### `DELAYS`

Debounce delays and timing values in milliseconds:

- `CONSOLE_LOGO_DEBOUNCE` (1000ms) - Prevents duplicate ASCII logo prints in console
- `PROJECT_HOVER_VIDEO` (1000ms) - Delay before showing video on project card hover
- `AVATAR_SNEEZE_DEBOUNCE` (100ms) - Debounce for avatar hover interactions
- `STAR_ANIMATION_INITIAL` (1000ms) - Delay before [StarsBackground](../../src/components/Stars/StarsBackground.tsx) starts the forced shooting-star loop

**Usage:** Import to control debouncing and timing in components.

### `THRESHOLDS`

Trigger thresholds for interactive features:

- `SNEEZE_TRIGGER_INTERVAL` (5) - Number of hovers before avatar sneeze animation
- `AAAAHHHH_TRIGGER_COUNT` (6) - Number of sneezes before Easter egg activation
- `MIN_STARS_FOR_ANIMATION` (15) - Unused stars [StarsBackground](../../src/components/Stars/StarsBackground.tsx) requires before shooting another; below it, the field regenerates

**Usage:** Import to control when interactions trigger animations or Easter eggs.

### `NETWORK`

Network performance thresholds for adaptive loading:

- `SLOW_NETWORK_TYPES` (['slow-2g', '2g', '3g']) - Network types considered slow

**Usage:** Import in [isNetworkFast()](../../src/util/isNetworkFast.ts) to determine whether to autoplay videos.

### `ANIMATIONS`

Multi-stage animation durations in milliseconds:

- `SNEEZE_STAGE_1` (500ms) - First frame of avatar sneeze
- `SNEEZE_STAGE_2` (300ms) - Second frame of avatar sneeze
- `SNEEZE_STAGE_3` (1000ms) - Final frame of avatar sneeze

**Usage:** Import to sequence the avatar sneeze animation in [Avatar component](../../src/components/banner/Avatar.tsx).

### `MAX_STARS`

A standalone value (600) capping the number of stars [StarsBackground](../../src/components/Stars/StarsBackground.tsx) renders. The component derives its star count from the window width but limits it to `MAX_STARS` to bound rendering cost.

**Usage:** Import to change the upper bound on rendered stars.

Implementation: [src/constants/index.ts](../../src/constants/index.ts)

## Routes

[`src/constants/routes.ts`](../../src/constants/routes.ts) holds the site's paths, named once for [`proxy.ts`](../../src/proxy.ts) and the Markdown builders:

- `ROUTES` - the home page (`/`), its Markdown form (`/index.md`), `/llms.txt`, and `/sitemap.xml`
- `MAIN_CONTENT_ID` - the ID of the `<main>` element, which receives focus when a closing overlay has nowhere better to return it
- `SECTION_IDS` - the home page fragments a redirect or link targets: `contact`, `privacy` (opens the policy dialog), and `cookie-settings` (reopens the consent banner)
- `POLICY_HREF` and `POLICY_PATHS` - the link that opens the policy dialog and the conventional paths that redirect to it
- `REDIRECTS` and `REWRITES` - the tables the proxy answers before negotiating a representation; see [Agent Readiness](./agent-readiness.md)

Implementation: [src/constants/routes.ts](../../src/constants/routes.ts)

## Related Documentation

- [Utils Documentation](./utils.md) - Utility functions that use these constants
- [Helpers Documentation](./helpers.md) - Helper functions that use these constants
- [Components Documentation](./components/index.md) - Components that consume constants
