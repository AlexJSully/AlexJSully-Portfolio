# Utils Module Documentation

This document describes the utility functions in the AlexJSully Portfolio project, their technical details, and integration patterns.

## 📦 Purpose

Utils provide general-purpose functions for network checks, type guards, and other logic not specific to UI or data. They help keep business logic clean and reusable.

## 🏗️ Structure

- Location: `src/util/`
- Example files:
    - `isNetworkFast.ts`: Checks if the user's network is fast enough for high-res assets.

## 🔍 Usage Examples

### Network Speed Check

```ts
import { isNetworkFast } from '@util/isNetworkFast';

if (isNetworkFast()) {
	// Load high-res images
}
```

### Type Guard Utility

```ts
import { isString } from '@util/typeGuards';

function printIfString(val: unknown) {
	if (isString(val)) {
		console.log(val);
	}
}
```

## 🧩 Integration & Relationships

- Utils are used by components, helpers, and layouts for logic that is not UI-specific.
- All utility functions are tested with Jest for reliability and maintainability.
- TypeScript ensures type safety and autocompletion for utility functions.

## Extending Utils

- Add new utility functions in `src/util/`.
- Write corresponding unit tests for each function.
- Use path aliases (`@util/`) for clean imports.

## Related Docs

- [System Architecture](./index.md)
- [Helpers Documentation](./helpers.md)
