# Setup & Installation Guide

This guide walks you through installing, configuring, and running the AlexJSully Portfolio project locally.

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

- **Environment Variables:**
    - See `.env.example` (if present) for required variables.
    - Configure Firebase, Sentry, and other integrations as needed.
- **Path Aliases:**
    - Use TypeScript aliases (see `tsconfig.json`).

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

- See [Troubleshooting Guide](./troubleshooting.md) _(to be added)_
- For help, open an issue or see [README.md](../../README.md)

---

💡 **Tip:** For more details, see [Usage Guides](./index.md) and [Architecture](../architecture/index.md).
