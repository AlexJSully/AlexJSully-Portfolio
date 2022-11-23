# Customize Projects

Adding and removing projects are very simple. In [./src/data](https://github.com/AlexJSully/AlexJSully-Portfolio/tree/main/src/data) there exists a [projectsData.json](../src/data/projectsData.json) file that contains the list of existing projects with corresponding images found under [./src/images/projects/](https://github.com/AlexJSully/AlexJSully-Portfolio/tree/main/src/images/projects).

To add a project, it must be sorted in the following way:

```json
{
	"project-id": {
		"name": "string",
		"description": "string",
		"employer": "string",
		"most-recent-title": "string",
		"url": "string",
		"dates": {
			"startDate": "YYYY-MM",
			"endDate": "YYYY-MM || Current"
		},
		"showcase": true,
		"filter": {
			"language": ["string"],
			"frameworks": ["string"],
			"type": ["string"]
		},
		"responsibilities": ["string"]
	}
}
```

Let's break this down:
The `project-id` will **need** to match the directory/folder name in [./src/images/projects/](https://github.com/AlexJSully/AlexJSully-Portfolio/tree/main/src/images/projects). So if the `project-id` is `portfolio`, then the directory/folder name must be `portfolio` and in there will contain the thumbnail image which is named `thumbnail` and can be any of the following image formats:

-   bmp
-   gif
-   ico
-   jpeg
-   jpg
-   png
-   svg
-   tif
-   tiff
-   webp

The `name` (type `string`) is the name of the project. This is what will be displayed on the project card. Write in readable text.

The `description` (type `string`) is a short description of the project. This is what will be displayed on the project card. Write in readable text.

The `employer` (type `string`) is the name of the company that the project was for. This is what will be displayed on the project card. Write in readable text.

The `most-recent-title` (type `string`) is the most recent title you held at the company. This is what will be displayed on the project card. Write in readable text.

The `url` (type `string`) is the URL to the project. This is what will be displayed on the project card. Write in readable text. Ensure that the URL is valid and using the [`https://`](https://en.wikipedia.org/wiki/HTTPS) protocol.

The `dates` (type `object`) is the start and end date of the project. This is what will be displayed on the project card. Write in readable text. The `startDate` must be in the format `YYYY-MM` and the `endDate` must be in the format `YYYY-MM` or `Current`. Both type `string`.

The `showcase` (type `boolean`) is whether or not the project will be displayed on the project showcase page by default. When set to `false`, the project will not be displayed immediately until the user interacts with the filter setting and selects the project's filter.

The `filter` (type `object`) is the filter settings for the project. The `language`, `frameworks`, and `type` are all lists of type `string`. Each of these correspond with the [filterData.json](../src/data/filterData.json) information which lets the user filter through the projects. `language` is the programming language used in the project (example `Markdown` or `JavaScript`), `frameworks` is the framework used in the project (example `React` or `Node.js`), and `type` is the type of project (example `Website` or `Mobile App`).

The `responsibilities` (type `array` or `string`) is a list of the responsibilities had in the project. This is what will be displayed on the project card. Write in readable text.

Editing and adding to [projectsData](../src/data/projectsData.json) will automatically update the project showcase page on next render/build.

# Customize Publications

In the same way Customize Projects work, there is a JSON file in [./src/data](https://github.com/AlexJSully/AlexJSully-Portfolio/tree/main/src/data) called [publicationsData.json](../src/data/publicationsData.json) that contains the list of existing publications. This file followings the following format:

```json
{
	"title": "string",
	"authors": ["string"],
	"abstract": "string",
	"doi": "string",
	"journal": "string",
	"date": "YYYY-MM-DD",
	"related-project": "string"
},
```

Let's break this down:

The `title` (type `string`) is the title of the publication. This is what will be displayed on the publication card. Write in readable text.

The `authors` (type `array` of `string`) is a list of the authors of the publication. This is what will be displayed on the publication card. Write in readable text.

The `abstract` (type `string`) is a the description/summary of the publication. This is what will be displayed on the publication card. Write in readable text.

The `doi` (type `string`) is the DOI of the publication. This will be a link to the DOI address on the publication card in the following format: `https://doi.org/{doi}`. Write in readable text.

The `journal` (type `string`) is the journal that the publication was published in. This is what will be displayed on the publication card. Write in readable text.

The `date` (type `string`) is the date that the publication was published. The date must be in the format `YYYY-MM-DD`. Write in readable text.

The `related-project` (type `string`) is the only optional field. This is the project ID that the publication is related to. This **must** match a project ID in [projectsData.json](../src/data/projectsData.json). This will be displayed on the publication card and will take the title of the project and link to the project page.
