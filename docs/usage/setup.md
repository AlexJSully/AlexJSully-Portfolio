# Setup & Installation Guide

This guide walks you through installing, configuring, and running the Alexander Sullivan's Portfolio project locally.

## Prerequisites

- Node.js 24.x, the version continuous integration installs ([`code-qa.yaml`](../../.github/workflows/code-qa.yaml))
- npm
- Git

## 🚀 Installation Steps

1. **Clone the Repository**

    ```sh
    git clone https://github.com/AlexJSully/AlexJSully-Portfolio.git
    cd AlexJSully-Portfolio
    ```

2. **Install Dependencies**

    ```sh
    npm ci
    ```

3. **Run the Development Server**

    ```sh
    npm run dev
    # Visit http://localhost:3000
    ```

4. **Build for Production**

    ```sh
    npm run build
    npm start
    ```

## ⚙️ Configuration

- **Environment Variables:** every key the code reads is prefixed `NEXT_PUBLIC_`, so all of them reach the browser bundle. None holds a secret, and none may.
    - `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_ID`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`, and `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` populate the Firebase credentials in [`firebase.ts`](../../src/configs/firebase.ts). `NEXT_PUBLIC_FIREBASE_ID` is interpolated into the auth domain and storage bucket as well as the project ID, so it is the one to set first.
    - `NEXT_PUBLIC_SENTRY_DSN` is the destination the three [`sentry.client.config.ts`](../../sentry.client.config.ts) style configs report to. Leaving it unset starts Sentry with no destination rather than failing the build.
    - `NEXT_PUBLIC_SENTRY_ORG` names the organization the Sentry webpack plugin uploads source maps to ([`next.config.js`](../../next.config.js)).
    - `NEXT_PUBLIC_ENVIRONMENT` selects the build shape: [`next.config.js`](../../next.config.js) skips `withSentryConfig` entirely when it equals `development`, and wraps the config with it otherwise. Set it to `development` locally to build without source-map upload.
    - `NEXT_PUBLIC_FACEBOOK_APP_ID` fills the Facebook app ID in the root layout's metadata ([`layout.tsx`](../../src/app/layout.tsx)) and falls back to an empty string when unset.

    Set these keys as environment variables during development (commonly via a local untracked `.env` file). Do not commit real secrets to git.

- **Path Aliases:**
    - Use TypeScript aliases (see [`tsconfig.json`](../../tsconfig.json)). Each alias is a prefix ending in a slash, so an import names a file beneath it: `@/`, `@components/`, `@configs/`, `@constants/`, `@data/`, `@helpers/`, `@images/`, `@layouts/`, `@styles/`, and `@util/`. Write `@components/banner/Avatar`, not a relative path and not a bare `@components`. [`jest.config.js`](../../jest.config.js) mirrors the same prefixes through `moduleNameMapper` so tests resolve them identically.

## 🧪 Testing & Validation

- **Run all checks:**

```sh
npm run validate
```

- **Run Cypress E2E tests:**

```sh
npm run test:cypress:e2e
```

- **Run Jest unit tests:**

```sh
npm run test:jest
```

## 📝 Troubleshooting

- For help, open an issue or see [README.md](../../README.md)

---

💡 **Tip:** For more details, see [Usage Guides](./index.md) and [Architecture](../architecture/index.md).
