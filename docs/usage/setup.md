# Setup & Installation Guide

This guide walks you through installing, configuring, and running the Alexander Sullivan's Portfolio project locally.

## Prerequisites

- Node.js
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

- **Environment Variables (common keys):**
    - `NEXT_PUBLIC_FIREBASE_API_KEY`
    - `NEXT_PUBLIC_FIREBASE_ID`
    - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    - `NEXT_PUBLIC_FIREBASE_APP_ID`
    - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
    - `NEXT_PUBLIC_SENTRY_DSN` (if Sentry is used in your environment). Set these keys as environment variables during development (commonly via a local untracked [`.env.example`](../../.env.example) template). Do not commit real secrets to git.
- **Path Aliases:**
    - Use TypeScript aliases (see [`tsconfig.json`](../../tsconfig.json)). The project exposes aliases like `@components`, `@data`, `@configs`, `@helpers`, and `@images` for cleaner imports.

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
