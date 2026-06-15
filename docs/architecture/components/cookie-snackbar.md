# Cookie Snackbar Component

This document details the CookieSnackbar component that manages cookie consent notifications.

## Overview

Location: [`src/components/cookie-snackbar/CookieSnackbar.tsx`](../../../src/components/cookie-snackbar/CookieSnackbar.tsx)

The CookieSnackbar component displays a cookie consent notification to users when they first visit the site. It uses browser cookies to remember user consent and avoid showing the notification on subsequent visits.

## Component Structure

```mermaid
flowchart TD
    accTitle: Cookie Snackbar State Management
    accDescr: CookieSnackbar checks if browser cookie is set. If not set, shows notification and expires in 1 year. If set, hides notification
    CookieSnackbar[CookieSnackbar] -->|Checks| Cookie[Browser Cookie]
    Cookie -->|Not Set| Show[Show Notification]
    Cookie -->|Set| Hide[Hide Notification]
    Show -->|User Closes| SetCookie[Set Cookie]
    SetCookie -->|Expires in| OneYear[1 Year]
```

## Key Features

1. **Cookie Consent Management:** Tracks and stores user consent using browser cookies
2. **SSR/Client Safety:** Prevents hydration mismatches with mounted state
3. **User-initiated consent:** The consent cookie is set when the user dismisses the snackbar (clicking the close button, clicking away, or pressing Escape), never automatically on load
4. **Persistent Storage:** Stores consent for 1 year (31,536,000 seconds)
5. **MUI Integration:** Uses Material-UI Snackbar and Alert components
6. **Accessibility:** Includes proper ARIA labels for close button

## Implementation

### State Management

```typescript
const [mounted, setMounted] = useState(false); // Client-side hydration guard
const [open, setOpen] = useState(false); // Controls snackbar visibility
```

### Cookie Check Logic

```typescript
useEffect(() => {
	setMounted(true);

	// Only show snackbar if user hasn't already accepted cookies
	if (!hasCookieConsent()) {
		setOpen(true);
	}
}, []);
```

### Close Handler

```typescript
const handleClose = () => {
	setCookieConsent();
	setOpen(false);
};
```

## Component Flow

```mermaid
sequenceDiagram
    accTitle: Cookie Consent Component Sequence
    accDescr: When user visits site, component mounts on client and checks for existing consent. If consent exists, notification is hidden. If not, it shows the notification, and the cookie is set when the user dismisses it (close button, clicking away, or Escape)
    participant User
    participant Component
    participant Browser
    participant Cookie

    User->>Component: Visits site
    Component->>Component: Mount on client
    Component->>Browser: Check document.cookie
    Browser->>Cookie: Read cookie-consent

    alt Cookie exists
        Cookie-->>Component: cookie-consent=true
        Component->>Component: setOpen(false)
    else Cookie doesn't exist
        Cookie-->>Component: Not found
        Component->>Component: setOpen(true)
        Component->>User: Show notification

        User->>Component: Dismiss (close, clickaway, or Escape)
        Component->>Cookie: Set cookie-consent=true
        Component->>Component: setOpen(false)
    end
```

## Cookie Details

**Cookie Name:** `cookie-consent`
**Cookie Value:** `true`
**Max Age:** 31,536,000 seconds (1 year)
**Path:** `/` (site-wide)
**SameSite:** `Strict`
**Secure:** Set when the connection is HTTPS

## SSR Considerations

The component uses a `mounted` state to prevent server-side rendering issues:

```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
	setMounted(true);
	// Cookie logic here
}, []);

if (!mounted) return null;
```

This ensures:

- No cookie access during SSR (server has no `document.cookie`)
- No hydration mismatches between server and client
- Component only renders on client after mounting

## Accessibility

```tsx
<IconButton aria-label='close' color='inherit' onClick={handleClose} size='small'>
	<CloseRoundedIcon fontSize='small' />
</IconButton>
```

- **ARIA Label:** Close button has descriptive `aria-label`
- **Keyboard Accessible:** Full keyboard navigation support
- **Focus Management:** Proper focus indicators via MUI

## Testing

Test file: [`src/components/cookie-snackbar/CookieSnackbar.test.tsx`](../../../src/components/cookie-snackbar/CookieSnackbar.test.tsx)

**Test Coverage:**

- Component renders on client
- Snackbar opens when cookie not present
- Snackbar closes when cookie exists
- Close button sets cookie and hides snackbar
- SSR safety (no crash on server)

## Integration

The component is rendered in [`GeneralLayout`](../../../src/layouts/GeneralLayout.tsx):

```tsx
export default function GeneralLayout({ children }) {
	return (
		<div id='content'>
			<Navbar />
			<main>
				{children}
				<StarsBackground />
				<CookieSnackbar />
			</main>
			<Footer />
		</div>
	);
}
```

## Customization

To customize the cookie snackbar:

1. **Message:** Modify the text in the Alert component
2. **Cookie Duration:** Change the `max-age=31536000` value in `getCookieOptions()`
3. **Severity:** Change `severity='info'` to `success`, `warning`, or `error`
4. **Position:** Add `anchorOrigin` prop to Snackbar for positioning

**Custom Position Configuration:**

The `anchorOrigin` prop accepts an object with two properties:

- `vertical`: Position on vertical axis (`'top'`, `'bottom'`)
- `horizontal`: Position on horizontal axis (`'left'`, `'center'`, `'right'`)

Example: To center the snackbar at the bottom, set `anchorOrigin` to `vertical: 'bottom'` and `horizontal: 'center'`.

## Related Documentation

- [GeneralLayout](../layouts.md)
- [Components Overview](./index.md)
- [MUI Snackbar Documentation](https://mui.com/material-ui/react-snackbar/)

---

**Tip:** The consent cookie is set only when the user dismisses the snackbar; `hasCookieConsent()` parses cookies to avoid substring false positives.
