# Service Workers & PWA Documentation

This document explains how Progressive Web App (PWA) features and service workers are implemented in the AlexJSully Portfolio project.

## 📦 Purpose

PWA support enables offline access, faster load times, and installable experiences for users.

## 🏗️ Structure

## 🔍 Usage Example

## 🚀 Features

- **Offline caching:** Assets, pages, and API responses are cached for offline use.
- **Service worker:** Handles background sync, cache updates, and push notifications.
- **Web App Manifest:** Enables installability and controls app appearance on devices.
- **Responsive design:** Optimized for mobile and desktop.

## ⚙️ Technical Implementation

### next-pwa Configuration

- The `next-pwa` plugin is configured in `next.config.js`:
    - Specifies service worker location, caching strategies, and runtime behaviors.
    - Example config:

```js
// next.config.js
const withPWA = require('next-pwa');
module.exports = withPWA({
	pwa: {
		dest: 'public',
		register: true,
		skipWaiting: true,
		disable: process.env.NODE_ENV === 'development',
	},
});
```

### Manifest & Icons

- `public/manifest.json` defines app name, icons, theme color, and display mode.
- Icons for various devices are in `public/icon/`.

### Integration Flow

1. User visits site; service worker is registered.
2. Assets and pages are cached according to config.
3. Manifest enables "Add to Home Screen" prompt.
4. Updates are pushed via service worker when available.

## 🛠️ Customization & Extensibility

- Modify caching strategies in `next.config.js` for custom needs.
- Add push notification support via service worker.
- Update manifest for branding and install experience.

## 🔗 Related Docs

- [Architecture Overview](./index.md)
- [Usage Guides](../usage/index.md)
