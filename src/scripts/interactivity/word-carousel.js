/** How many letters per second */
const lettersPerSecond = 16;

/**
 * Display list of words as a carousel
 * @param {String} dom Which element will contain the word carousel
 * @param {Array} wordList The list of words within the word carousel
 */
export function WordCarousel(dom, wordList) {
	if (document.getElementById(dom) && wordList?.length > 0) {
		addLetters(dom, wordList[0], wordList);
	}
}

/**
 * Add letters to the word carousel
 * @param {String} dom Which element will contain the word carousel
 * @param {String} word Current word
 * @param {Array} wordList The list of words within the word carousel
 */
function addLetters(dom, word, wordList) {
	if (document.getElementById(dom)) {
		if (word?.length > 0) {
			/** Position of the word's letter */
			const pos = document.getElementById(dom)?.textContent?.length;

			if (pos < word?.length) {
				document.getElementById(dom).textContent += word[pos];

				setTimeout(() => {
					addLetters(dom, word, wordList);
				}, 1000 / lettersPerSecond);
			} else {
				setTimeout(() => {
					removeLetter(dom, word, wordList);
				}, 1750);
			}
		} else {
			nextWord(dom, word, wordList);
		}
	}
}

/**
 * Remove letters from word carousel
 * @param {String} dom Which element will contain the word carousel
 * @param {String} word Current word
 * @param {Array} wordList The list of words within the word carousel
 */
function removeLetter(dom, word, wordList) {
	if (document.getElementById(dom)) {
		if (word?.length > 0) {
			/** Position of the word's letter */
			const pos = document.getElementById(dom)?.textContent?.length;

			if (pos > 0) {
				document.getElementById(dom).textContent = document
					.getElementById(dom)
					.textContent.substr(0, document.getElementById(dom).textContent.length - 1);

				setTimeout(() => {
					removeLetter(dom, word, wordList);
				}, 1000 / (lettersPerSecond * 2));
			} else {
				nextWord(dom, word, wordList);
			}
		} else {
			nextWord(dom, word, wordList);
		}
	}
}

/**
 * Move onto the next word in the word carousel's list
 * @param {String} dom Which element will contain the word carousel
 * @param {String} word Current word
 * @param {Array} wordList The list of words within the word carousel
 */
function nextWord(dom, word, wordList) {
	if (document.getElementById(dom)) {
		if (wordList?.length > 0) {
			/** Word position within word list */
			let pos = wordList.indexOf(word);
			if (pos < 0) {
				pos = 0;
			}

			/** Next word */
			let nextWord = wordList[pos + 1];
			if (!nextWord) {
				nextWord = wordList[0];
			}

			setTimeout(() => {
				addLetters(dom, nextWord, wordList);
			}, 1000 / (lettersPerSecond * 2));
		}
	}
}
