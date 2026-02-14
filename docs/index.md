# AlexJSully's Portfolio Documentation

This documentation explains the architecture and usage of AlexJSully's Portfolio—a Next.js-based portfolio website showcasing projects, publications, and professional work.

## What This Portfolio Does

The portfolio is a client-side rendered application that displays:

- **Projects:** Interactive grid showing employment history and personal projects with video previews
- **Publications:** Academic publications with DOIs and abstracts
- **Profile:** Animated avatar with Easter egg interactions
- **Analytics:** User interaction tracking via Firebase
- **PWA Support:** Installable web app with offline capabilities

## For External Users

If you want to use this portfolio template for your own site:

- [Setup & Installation](./usage/setup.md) — Get started with local development
- [Adding Projects](./architecture/components/projects.md) — Customize the projects grid
- [Testing Guide](./usage/testing.md) — Run tests and validation

## For Internal Developers

If you're maintaining or extending this codebase:

- [Architecture Overview](./architecture/index.md) — System design and patterns
- [Component Documentation](./architecture/components/index.md) — UI component behaviors
- [Data Architecture](./architecture/data.md) — How data flows through the application

## Architecture

- [Architecture Overview](./architecture/index.md)
- [App Directory (Next.js)](./architecture/app-directory.md)
- [Constants](./architecture/constants.md)
- [Data Architecture](./architecture/data.md)
- [Helpers](./architecture/helpers.md)
- [Images & Icons](./architecture/images.md)
- [Layouts](./architecture/layouts.md)
- [PWA & Service Workers](./architecture/pwa.md)
- [Configs](./architecture/configs.md)
- [Utils](./architecture/utils.md)
- [Detailed Components](./architecture/components/index.md)

## Usage Guides

- [Usage Overview](./usage/index.md)
- [Setup & Installation](./usage/setup.md)
- [Testing Guide](./usage/testing.md)

## Key Features

- **Network-Aware Loading:** Adapts video autoplay based on connection speed
- **Easter Egg:** Hidden interaction triggered by avatar hover
- **Progressive Web App:** Installable with offline support via service worker
- **Analytics Tracking:** Firebase integration for user behavior insights
- **Accessibility:** ARIA labels, semantic HTML, and keyboard navigation

## Contributing & Code of Conduct

- [Contributing Guide](../CONTRIBUTING.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)
