import { returnFilterImages, returnImages } from "./imageImporter";

/** Test filter data */
const filterData = {
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

// Test returnImages function
describe("returnImages", () => {
	it("should return null if the project image is not found", async () => {
		const result = await returnImages("non-existing-project");
		expect(result).toBe(null);
	});
});

// Test returnFilterImages function
describe("returnFilterImages", () => {
	it("should return a valid filter image directory path", async () => {
		const result = await returnFilterImages(filterData, "javascript");
		expect(typeof result).toBe("string");
		expect(result).toMatch(/static\/media\/javascript|javascript.svg/);
	});

	it("should return null if the filter image is not found", async () => {
		const result = await returnFilterImages(filterData, "non-existing-filter");
		expect(result).toBe(null);
	});
});
