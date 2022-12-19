import ProjectsData from "../../data/projectsData.json";

// Image data
const images = {};

/** Supported image formats */
const imageFormats = ["webp", "svg", "jpg"];

/**
 * Return project thumbnails
 * @param {String} which Which project you want returned
 * @param {String} [type="thumbnail"] Which project image you want returned (currently only thumbnails available)
 * @returns {String} Directory path to project image
 */
export async function returnImages(which, type = "thumbnail") {
	// Grab all images on first time this function is called
	if (Object.keys(images).length < 1) {
		for (const [key] of Object.entries(ProjectsData)) {
			/** Thumbnail image */
			let thumbnail;

			// If Internet Explorer, remove any non-compatible image formats
			if (
				imageFormats.includes("webp") &&
				(navigator.userAgent.indexOf("MSIE") !== -1 || navigator.userAgent.indexOf("Trident") !== -1)
			) {
				imageFormats.splice(imageFormats.indexOf("webp"), 1);
			}

			for (const i in imageFormats) {
				// Only proceed if the image does not exist
				if (!thumbnail) {
					// Try to find image, if not, move to next format
					try {
						// eslint-disable-next-line no-await-in-loop
						thumbnail = await import(`../../images/projects/${key}/thumbnail.${imageFormats[i]}`);

						break;
					} catch (error) {
						continue;
					}
				} else {
					// If image found, stop looping
					break;
				}
			}

			if (thumbnail?.default) {
				images[key] = {};
				images[key].thumbnail = thumbnail.default;
			}
		}
	}

	// If image exists, then return it
	return images?.[which.toString()]?.[type.toString()] || null;
}

// All filter option thumbnails
const filterImages = {};

/**
 * Return desired filter image thumbnail
 * @param {Object} filterData All filter data
 * @param {String} which Which filtered image thumbnail you want returned
 * @returns {String} Directory path to filter image thumbnail
 */
export async function returnFilterImages(filterData, which) {
	// Grab all images on first time this function is called
	if (Object.keys(filterImages).length < 1) {
		// eslint-disable-next-line no-unused-vars
		for (const [, value] of Object.entries(filterData)) {
			for (const i in value) {
				if (value[i]) {
					let thumbnail;
					try {
						// eslint-disable-next-line no-await-in-loop
						thumbnail = await import(`../../images/icons/${value[i]}.svg`);
					} catch (error) {
						continue;
					}

					filterImages[value[i]] = thumbnail?.default || null;
				}
			}
		}
	}

	// If image exists, then return it
	return filterImages?.[which.toString()] || null;
}
