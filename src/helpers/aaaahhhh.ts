export const aaaahhhhImage = '/images/aaaahhhh/aaaahhhh.webp';

/** imageAAAAHHHH */
export function imageAAAAHHHH(): void {
	const docs = document.querySelectorAll<HTMLElement>('div[style]');
	for (const doc of docs) {
		if (doc.style.backgroundImage) {
			doc.style.backgroundImage = `url(${aaaahhhhImage})`;
		}
	}

	const imgs = document.getElementsByTagName('img');
	for (const img of imgs) {
		if (img.src) {
			img.src = aaaahhhhImage;
		}

		if (img.srcset) {
			img.srcset = aaaahhhhImage;
		}
	}

	// Change background image of id='sky' to aaaaahhhh image
	const skyElement = document.getElementById('sky');
	if (skyElement) {
		skyElement.style.backgroundImage = `url(${aaaahhhhImage})`;
		skyElement.style.backgroundRepeat = 'no-repeat';
		skyElement.style.backgroundSize = 'cover';
	}
}

/**
 * convertAAAAHH
 * @param {String} aaaahhhh AAAAHHHH STRING
 * @returns {String} aaaahhhh AAAAHHHH STRING
 */
export function convertAAAAHH(aaaaahhhh: string): string {
	let newAAAAHHHH = '';

	/** AAAAHHHHlength */
	const AAAAHHHHlength: number = aaaaahhhh.length;

	/** splitAAAAHHHH */
	const splitAAAAHHHH = aaaaahhhh.split('');
	for (let i = 0; i < AAAAHHHHlength; i += 1) {
		if (splitAAAAHHHH[i] === ' ') {
			newAAAAHHHH += ' ';
		} else {
			/** to AAAAAHHHH */
			const toUpper = splitAAAAHHHH[i].toUpperCase();
			/** is AAAAAHHHH */
			const isUpper = toUpper === splitAAAAHHHH[i];

			/** which AAAAAHHHH */
			let whichLetter: string = i < AAAAHHHHlength / 2 ? 'a' : 'h';
			whichLetter = isUpper ? whichLetter.toUpperCase() : whichLetter;

			newAAAAHHHH += whichLetter;
		}
	}

	if (!newAAAAHHHH || newAAAAHHHH.length === 0) {
		newAAAAHHHH = aaaaahhhh;
	}

	return newAAAAHHHH;
}

/** textAAAAHHHH */
export function textAAAAHHHH(): void {
	const docs = [
		...document.getElementsByTagName('span'),
		...document.getElementsByTagName('p'),
		...document.getElementsByTagName('h1'),
		...document.getElementsByTagName('h2'),
		...document.getElementsByTagName('h3'),
		...document.getElementsByTagName('button'),
	];

	for (const i in docs) {
		if (docs[i]?.childNodes) {
			for (const c in docs[i].childNodes) {
				if (docs[i].childNodes[c].nodeName === '#text') {
					/** AAAAHHHH OLD TEXT */
					const text = docs?.[i]?.childNodes?.[c]?.textContent;

					if (text) {
						/** AAAAHHHH NEW TEXT */
						const newText = convertAAAAHH(text);
						docs[i].childNodes[c].textContent = newText;
					}
				}
			}
		}
	}

	const carouselElement = document.getElementById('description-Carousel');
	if (carouselElement) {
		carouselElement.remove();
	}

	const noMotionDescriptionElement = document.getElementById('no-motion-description');
	if (noMotionDescriptionElement) {
		noMotionDescriptionElement.removeAttribute('hidden');
	}
}

/** aaaahhhh */
export function aaaahhhh(): void {
	imageAAAAHHHH();
	textAAAAHHHH();

	document.title = "Alexander Sullivan's AAAAHHHHH";
}
