# Layouts Module Documentation

This document describes the layout system in the AlexJSully Portfolio project.

## 📦 Purpose

Layouts define the structure and composition of pages and sections, ensuring consistent UI and navigation.

## 🏗️ Structure

- Location: `src/layouts/`
- Main file: `GeneralLayout.tsx`
- Test file: `GeneralLayout.test.tsx`

## 🔍 Usage Example

```tsx
import GeneralLayout from '@layouts/GeneralLayout';

export default function Page() {
	return <GeneralLayout>{/* Page content here */}</GeneralLayout>;
}
```

## 🧩 Relationships

- Composes components, helpers, and data into pages.
- Used by Next.js page files for consistent structure.

## 🔗 Related Docs

- [System Architecture](./index.md)
- [Component Architecture](./components.md)

---

💡 **Tip:** Extend layouts for new page types and keep them modular.
