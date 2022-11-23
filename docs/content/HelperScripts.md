# Helper scripts

All helper scripts will be located in the following directory: [`./src/scripts/helper/`](https://github.com/AlexJSully/AlexJSully-Portfolio/tree/main/src/scripts/helper).

## Image Importer

This helper script is used to import images from a project directory in different file formats and enable them to be imported in Internet Explorer. This script will be located in the following directory: [`./src/scripts/helper/imageImporter.js`](../src/scripts/helper/imageImporter.js).

### returnImages(which, type)

Returns project thumbnails.

`which` (type `string`) - Which projects thumbnails you want returned. Must match a project ID in the projects data: [projectsData.json](../src/data/projectsData.json).

`type` (type `string`) | default: `thumbnail` - Which project image you want returned (currently only thumbnails available).

_`return`_ (type `string`) - Directory path to project image. This can be used as a image source in HTML.

### returnFilterImages(filterData, which)

Return desired filter image thumbnail

`filterData` (type `object`) - All filter data that will be used to display filter options. Default filter data can be found in [filtersData.json](../src/data/filtersData.json). The key names must match a filter file name found in [`./src/images/icons/`](https://github.com/AlexJSully/AlexJSully-Portfolio/tree/main/src/images/icons).

`which` (type `string`) - Which filter image you want returned. Must match a filter ID in the filter data: [filtersData.json](../src/data/filtersData.json) and match a filter file name found in [`./src/images/icons/`](https://github.com/AlexJSully/AlexJSully-Portfolio/tree/main/src/images/icons)

_`return`_ (type `string`) - Directory path to filter image. This can be used as a image source in HTML.
