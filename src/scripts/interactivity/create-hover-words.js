/**
 * Covert string to element where each letter is surrounded by a span with the given class
 * @param {String} text What to convert
 * @param {String} className Which class to give it
 * @returns {JSX.Element[]} Each letter is surrounded by a span with the given class
 */
export function createHoverColourWords(text, className) {
	/** Each letter is surrounded by a span with the given class as JSX */
	const returnJSX = [];

	for (const i in text) {
		returnJSX.push(
			<span key={`${text[i]}-${i}`} className={className}>
				{text[i]}
			</span>,
		);
	}

	return returnJSX;
}
