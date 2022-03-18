import ProjectsData from "../projectsData.json";

// Image data
const images = {};

/**
 * Return project thumbnails
 * @param {String} which Which project you want returned
 * @param {String} type Which project image you want returned (currently only thumbnails available)
 * @returns {String} Directory path to project image
 */
export async function returnImages(which, type) {
	// Grab all images on first time this function is called
	if (Object.keys(images).length < 1) {
		// eslint-disable-next-line no-unused-vars
		for (const [key, value] of Object.entries(ProjectsData)) {
			/** Thumbnail image */
			let thumbnail;

			/** Supported image formats */
			const imageFormats = ["webp", "png", "jpg", "gif", "jpeg", "svg", "bmp", "ico", "tiff", "tif"];

			for (const i in imageFormats) {
				// Only proceed if the image does not exist
				if (!thumbnail) {
					// Try to find image, if not, move to next format
					try {
						thumbnail = await import(`../../../../../images/projects/${key}/thumbnail.${imageFormats[i]}`);

						break;
					} catch (error) {
						continue;
					}
				} else {
					// If image found, stop looping
					break;
				}
			}

			images[key] = {};
			images[key].thumbnail = thumbnail?.default;
		}
	}

	// If image exists, then return it
	if (images?.[which.toString()]?.[type.toString()]) {
		return images[which.toString()][type.toString()];
	} else {
		return undefined;
	}
}

// All filter option thumbnails
const filterImages = {};

/**
 * Return desired filter image thumbnail
 * @param {String} filterData All filter data
 * @param {String} which Which filtered image thumbnail you want returned
 * @returns {String} Directory path to filter image thumbnail
 */
export async function returnFilterImages(filterData, which) {
	// Grab all images on first time this function is called
	if (Object.keys(filterImages).length < 1) {
		// eslint-disable-next-line no-unused-vars
		for (const [key, value] of Object.entries(filterData)) {
			for (const i in value) {
				let thumbnail;

				try {
					thumbnail = await import(`../../../../../images/icons/${value[i]}.svg`);
				} catch (error) {
					// Nothing
				}

				filterImages[value[i]] = thumbnail?.default;
			}
		}
	}

	// If image exists, then return it
	if (filterImages?.[which.toString()]) {
		return filterImages[which.toString()];
	} else {
		return undefined;
	}
}
