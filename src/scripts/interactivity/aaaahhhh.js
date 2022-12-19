import aaaaaahhhhhh from "../../images/aaaahhhh/aaaahhhh.webp";

/**
 * imageAAAAHHHH
 */
function imageAAAAHHHH() {
	/** Document's AAAAHHHH */
	const docs = document.querySelectorAll("div[style]");
	for (const i in docs) {
		if (docs[i]?.style?.backgroundImage) {
			docs[i].style.backgroundImage = `url(${aaaaaahhhhhh})`;
		}
	}

	/** Document's AAAAHHHH part 2 */
	const imgs = document.getElementsByTagName("img");
	for (const i in imgs) {
		if (imgs[i]?.src) {
			imgs[i].src = aaaaaahhhhhh;
		}
	}

	document.getElementById("home").style.backgroundImage = `url(${aaaaaahhhhhh})`;
}

/**
 * convertAAAAHH
 * @param {String} aaaahhhh AAAAHHHH STRING
 * @returns {String} aaaahhhh AAAAHHHH STRING
 */
export function convertAAAAHH(aaaaahhhh) {
	/** newAAAAHHHH */
	let newAAAAHHHH = "";

	/** AAAAHHHHlength */
	const AAAAHHHHlength = aaaaahhhh.length;

	/** splitAAAAHHHH */
	const splitAAAAHHHH = aaaaahhhh.split("");
	for (const i in splitAAAAHHHH) {
		if (splitAAAAHHHH[i] === " ") {
			newAAAAHHHH += " ";
		} else {
			/** to AAAAAHHHH */
			const toUpper = splitAAAAHHHH[i].toUpperCase();
			/** is AAAAAHHHH */
			const isUpper = toUpper === splitAAAAHHHH[i];

			/** which AAAAAHHHH */
			let whichLetter = i < AAAAHHHHlength / 2 ? "a" : "h";
			whichLetter = isUpper ? whichLetter.toUpperCase() : whichLetter;

			newAAAAHHHH += whichLetter;
		}
	}

	if (!newAAAAHHHH || newAAAAHHHH?.length === 0) {
		newAAAAHHHH = aaaaahhhh;
	}

	return newAAAAHHHH;
}

/**
 * textAAAAHHHH
 */
function textAAAAHHHH() {
	/** AAAAHHHH LIST OF DOCUMENT TAGS */
	const docs = [
		...document.getElementsByTagName("span"),
		...document.getElementsByTagName("p"),
		...document.getElementsByTagName("h1"),
		...document.getElementsByTagName("h2"),
		...document.getElementsByTagName("h3"),
	];

	for (const i in docs) {
		if (docs[i]?.childNodes) {
			for (const c in docs[i].childNodes) {
				if (docs[i]?.childNodes[c]?.nodeName === "#text" && docs[i]?.childNodes[c]?.textContent?.length > 0) {
					/** AAAAHHHH OLD TEXT */
					const text = docs[i].childNodes[c].textContent;
					/** AAAAHHHH NEW TEXT */
					const newText = convertAAAAHH(text);
					docs[i].childNodes[c].textContent = newText;
				}
			}
		}
	}

	document.getElementById("description-Carousel").remove();
	document.getElementById("no-motion-description").removeAttribute("hidden");
}

/**
 * aaaahhhh
 */
export function aaaahhhh() {
	imageAAAAHHHH();
	textAAAAHHHH();

	document.title = "Alexander Sullivan's AAAAHHHHH";
}
