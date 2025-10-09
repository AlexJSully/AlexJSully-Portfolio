# Images & Icons Documentation

This document explains how images and icons are used, organized, and named in AlexJSully's Portfolio project, and how contributors can add their own.

## 📦 Purpose

Images and icons provide visual context, branding, and UI elements throughout the portfolio. They are used for project thumbnails, profile pictures, social media links, and custom graphics.

## 🏗️ Structure

### Images

- **Location:** `public/images/`
- **Subfolders:**
    - `projects/` — Project thumbnails and images, organized by project ID
    - `drawn/` — Hand-drawn or custom graphics
    - `aaaahhhh/` — Special or fun images
- **Usage:**
    - Project cards, profile, backgrounds, and custom sections

### Icons

- **Location:** `src/images/icons/`
- **Format:** SVG files for scalability and performance
- **Usage:**
    - Social media links, UI buttons, branding, and navigation

## 📝 Naming Conventions

### Image Naming

- Project images: `public/images/projects/{project-id}/thumbnail.webp`
- Profile: `public/images/profile.webp`
- Custom: Use descriptive, lowercase names (e.g., `drawn/portfolio-sketch.webp`)

### Icon Naming

- Social: `github.svg`, `linkedin.svg`, `twitter.svg`, etc.
- UI: Use clear, lowercase names (e.g., `bar.svg`, `publish.svg`)

## 🔍 Usage Examples

### Using Images in Components

```tsx
<img src='/images/projects/my-project/thumbnail.webp' alt='Project Thumbnail' />
```

### Importing SVG Icons as React Components

```tsx
import GitHubIcon from '@images/icons/github.svg';

<IconButton>
	<GitHubIcon />
</IconButton>;
```

### Referencing Images in Data Files

```ts
// src/data/projects.ts
{
  id: 'my-project',
  thumbnail: '/images/projects/my-project/thumbnail.webp',
  ...otherFields
}
```

### How to Add Your Own Images or Icons

#### Adding Images

1. Place your image in the appropriate subfolder under `public/images/`.
2. For project thumbnails, create a folder named after your project ID and add `thumbnail.webp`.
3. Use `.webp` format for best performance. PNG/JPG are supported but less efficient.
4. Reference your image in the relevant data file or component.

#### Adding Icons

1. Add your SVG file to `src/images/icons/`.
2. Name it descriptively and in lowercase (e.g., `customicon.svg`).
3. Import it in your component as shown above.
4. Use with MUI `IconButton` or directly in JSX.

## 🧩 Relationships

- Images are referenced in data files (e.g., `projects.ts`) and components.
- Icons are imported as React components or used in MUI IconButton.
- Both are essential for UI consistency and branding.

## 🔗 Related Docs

1. Place your image in the appropriate subfolder under `public/images/`.
2. For project thumbnails, create a folder named after your project ID and add `thumbnail.webp`.
3. Use `.webp` format for best performance. PNG/JPG are supported but less efficient.
4. Reference your image in the relevant data file or component.

- [Component Documentation](./components.md)
- [Projects Guide](./components/projects.md)

---

💡 **Tip:** Use `.webp` for images when possible for better performance. Keep icon names lowercase and descriptive. Always optimize images for web.
