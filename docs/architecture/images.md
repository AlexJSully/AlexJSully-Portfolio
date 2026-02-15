# Images & Icons

The portfolio uses two types of visual assets: raster images stored in [public/images/](../../public/images/) and SVG icons in [src/images/icons/](../../src/images/icons/).

## Image Organization

**Project Thumbnails:** Each project has a folder at `public/images/projects/{project-id}/` containing `thumbnail.webp`. The project ID must match the `id` field in [src/data/projects.ts](../../src/data/projects.ts).

**Profile Images:** Hand-drawn profile graphics live in `public/images/drawn/`, including the default avatar and sneeze animation frames.

**Easter Egg Assets:** Special images for the AAAAHHHH transformation live in `public/images/aaaahhhh/`.

Files in `public/` are served statically and referenced by absolute paths (e.g., `/images/projects/gaia/thumbnail.webp`).

## Icon System

SVG icons are stored as files in [src/images/icons/](../../src/images/icons/) and imported as React components via `@svgr/webpack`.

The [icons.tsx](../../src/images/icons.tsx) file exports wrapped icons as MUI-compatible components:

```typescript
import GitHubSVG from './icons/github.svg';
export const GitHubIcon = (props: SvgIconProps) =>
  <SvgIcon component={GitHubSVG} inheritViewBox {...props} />;
```

This pattern allows icons to accept MUI `SvgIconProps` (color, fontSize, etc.) while preserving the SVG viewBox.

Components import icons from `@images/icons`:

```typescript
import { GitHubIcon } from '@images/icons';
```

## Why SVGs as React Components?

The `@svgr/webpack` loader converts SVG files to React components at build time. This provides:

- **Type Safety:** Icons are typed React components, not strings
- **Tree Shaking:** Unused icons are excluded from bundles
- **Props Support:** Icons accept React props for styling
- **No Runtime Parsing:** SVGs are compiled, not parsed at runtime

## Image Formats

**WebP Preferred:** Project thumbnails use WebP format for smaller file sizes. PNG and JPG are supported but less efficient.

**SVG for Icons:** Scalable vectors ensure crisp rendering at any size without multiple asset files.

Implementation: [src/images/icons.tsx](../../src/images/icons.tsx)

## Related Documentation

- [Projects Component](./components/projects.md) — How project thumbnails render
- [Data Architecture](./data.md) — Project data structure
