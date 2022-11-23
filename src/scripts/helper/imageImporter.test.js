import "./imageImporter";
import { returnFilterImages } from "./imageImporter";

/** Test filter data */
let filterData = {
	language: [
		"bash",
		"css",
		"scss/sass",
		"html",
		"javascript",
		"typescript",
		"json",
		"markdown",
		"php",
		"python",
		"r",
		"sql",
		"postgres",
		"xml",
	],
};
test(`Ensure returnFilter returns known image`, async () => {
	// Expect the returnFilterImages function to return a string that begins with "static/media/javascript" or contains "javascript.svg"
	expect(await returnFilterImages(filterData, "javascript")).toMatch(/static\/media\/javascript|javascript.svg/);
});
