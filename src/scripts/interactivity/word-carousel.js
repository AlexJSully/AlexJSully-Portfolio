let lettersPerSecond = 16;

export function WordCarousel(dom, wordList) {
    if (document.getElementById(dom) && wordList?.length > 0) {
        addLetters(dom, wordList[0], wordList)
    };
};

function addLetters(dom, word, wordList) {
    if (document.getElementById(dom)) {
        if (word?.length > 0) {
            let pos = document.getElementById(dom)?.textContent?.length;
    
            if (pos < word?.length) {
                document.getElementById(dom).textContent += word[pos];
    
                setTimeout(() => {
                    addLetters(dom, word, wordList);
                }, (1000/lettersPerSecond));
            } else {
                setTimeout(() => {
                    removeLetter(dom, word, wordList);
                }, (1500));
            };
        } else {
            nextWord(dom, word, wordList);
        };
    };
};

function removeLetter(dom, word, wordList) {
    if (document.getElementById(dom)) {
        if (word?.length > 0) {
            let pos = document.getElementById(dom)?.textContent?.length;
    
            if (pos > 0) {
                document.getElementById(dom).textContent = document.getElementById(dom).textContent.substr(0, document.getElementById(dom).textContent.length - 1);
    
                setTimeout(() => {
                    removeLetter(dom, word, wordList);
                }, (1000/(lettersPerSecond * 2)));
            } else {
                nextWord(dom, word, wordList);
            };
        } else {
            nextWord(dom, word, wordList);
        };
    };
};

function nextWord(dom, word, wordList) {
    if (document.getElementById(dom)) {
        if (wordList?.length > 0) {
            let pos = wordList.indexOf(word);
            if (pos < 0) {
                pos = 0;
            };
        
            let nextWord = wordList[pos + 1];
            if (!nextWord) {
                nextWord = wordList[0];
            };
        
            setTimeout(() => {
                addLetters(dom, nextWord, wordList);
            }, (1000/(lettersPerSecond * 2)))
        };
    };
};