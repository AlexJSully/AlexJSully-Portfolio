# Projects Documentation

## Overview

This document explains how the projects grid is displayed and how to add new projects to the codebase.

## Projects Grid Display

The projects grid is displayed using the `ProjectsGrid` component located in [ProjectsGrid.tsx](../../src/components/projects/ProjectsGrid.tsx). This component creates a grid layout to showcase the projects.

### Key Elements

- **State Management**: The component uses the `useState` hook to manage whether to view all projects or only featured projects.
- **Grid Layout**: The projects are displayed in a responsive grid layout using Material-UI's Grid and Stack components.
- **Project Cards**: Each project is displayed as a card with a thumbnail image, project name, title, employer, and links to relevant resources.

### Flowchart

```mermaid
flowchart LR
    A[ProjectsGrid Component] -->|Fetches| B[Projects Data]
    B --> C[Maps Projects to Grid Items]
    C --> D[Displays Project Cards]
    D --> E[Project Thumbnail]
    D --> F[Project Name]
    D --> G[Project Title - Employer]
    D --> I[Links]
    E --> J[Thumbnail Image]
    I --> K[Link Buttons]
```

## Adding New Projects

To add new projects, you need to update the `projects` array in [projects.ts](../../src/data/projects.ts).

### Steps to Add a New Project

1. Open the [projects.ts](../../src/data/projects.ts) file.
2. Add a new object to the projects array with the following structure: (see `Projects` interface in [projects.ts](../../src/data/projects.ts) for more details)

```json
{
	"name": "Project Name",
	"id": "project-id", // unique identifier for the project (associated with the image file name or publication)
	"description": "Project description", // optional
	"employer": "Employer Name", // optional
	"employerURL": "https://employer-website.com", // required if employer is provided
	"title": "Job Title",
	"publication": "https://publication-url.com", // optional
	"type": "Employment", // or 'Personal Project', 'School (MSc)', etc.
	"url": "https://project-url.com", // optional
	"urls": [
		// this is used to create a series of buttons with links
		{
			"text": "Link Text",
			"tooltip": "Tooltip description",
			"icon": "IconComponent", // this is a JSX component
			"url": "https://link-url.com"
		}
	],
	"color": "#colorCode",
	"dates": {
		"startDate": "YYYY-MM",
		"endDate": "YYYY-MM" // or current if ongoing
	},
	"showcase": true, // or false
	"objectFit": "contain" // optional, cover is used if nothing is provided
}
```

### Adding Thumbnail Images

To add a thumbnail image for the new project, place the image in the appropriate directory:

1. **Navigate to the images directory**: Go to the [public image projects directory](../../public/images/projects).
2. **Create a new directory**: Create a new directory with the project ID (e.g., new-project).
3. **Add the thumbnail image**: Place the thumbnail image in the new directory and name it thumbnail. Recommended to use `.webp` format for better performance.

By following these steps, you can successfully add new projects to the projects grid.
