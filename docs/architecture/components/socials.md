# Socials Documentation

The social links in the footer are driven entirely by one data file, so adding a platform is a data change rather than a component change. This document covers how they render and what an entry has to supply.

## Overview

This document explains how the social media links are displayed and how to add new social media links to the codebase.

## Social Media Links Display

The social media links are displayed using the `Footer` component located in [Footer.tsx](../../../src/components/footer/Footer.tsx). This component creates a grid layout to showcase the social media links.

### Key Elements

- **Grid Layout**: The social media links are displayed in a responsive grid layout using Material-UI's `Grid` and `Tooltip` components.
- **Social Media Icons**: Each social media link is displayed as an icon button with a tooltip.
- **Contact Buttons**: "Email me" (to `profile.email`) and "Resume" (to `profile.resumePath`) are [`PillButton`](../../../src/components/pill-button/PillButton.tsx)s, with values from [profile.ts](../../../src/data/profile.ts). The footer's root element carries the `contact` ID that `/contact` redirects to.
- **Policy Links**: Two [`PanelLink`](../../../src/components/panel-link/PanelLink.tsx)s at the end of the footer open the privacy and cookie policy dialog and reopen the consent banner's switches ("Cookie settings"); see [Consent Banner](./consent-banner.md).

### Flowchart

```mermaid
flowchart LR
    accTitle: Social Media Links Display Flow
    accDescr: Footer component imports socials data, maps to grid items, displays social media icons with tooltips and links to each platform
    A[Footer Component] -->|Imports| B[Socials Data]
    B --> C[Maps Socials to Grid Items]
    C --> D[Displays Social Media Icons]
    D --> E[Social Media Icon]
    D --> F[Social Media Tooltip]
    D --> G[Social Media Link]
```

## Adding New Social Media Links

To add new social media links, update the `socials` array in [socials.ts](../../../src/data/socials.ts).

### Steps to Add a New Social Media Link

1. Open the [socials.ts](../../../src/data/socials.ts) file.
2. Add a new object to the socials array with the following structure:

    ```typescript
    {
    	name: 'Social Media Name',
    	url: 'https://social-media-url.com',
    	icon: SocialMediaIconComponent,
    	color: '#colorCode',
    }
    ```

The `icon` value is the component itself, not an element: [Footer](../../../src/components/footer/Footer.tsx) invokes it as `social.icon({})`, so pass an export from [icons.tsx](../../../src/images/icons.tsx) such as `GitHubIcon`. The `color` value tints the icon and its drop shadow on hover, falling back to the theme's `primary.main` when absent, and `name` does triple duty as the tooltip text, the accessible label, and the suffix of the analytics event, which is built as `` `footer-${social.name.toLowerCase()}` `` and therefore keeps any spaces in the name.

## Related Documentation

- [Components Overview](./index.md)
- [Data Architecture](../data.md) - How the socials array reaches the footer
- [Images & Icons](../images.md) - Where the icon components come from
