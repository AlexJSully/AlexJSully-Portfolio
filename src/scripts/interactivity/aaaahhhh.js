import aaaaaahhhhhh from '../../images/aaaahhhh/aaaahhhh.webp';

export function aaaahhhh() {
    imageAAAAHHHH();
    textAAAAHHHH();

    document.title = `Alexander Sullivan's AAAAHHHHH`;
};

function imageAAAAHHHH() {
    let docs = document.querySelectorAll(`div[style]`);
    for (let i in docs) {
        if (docs[i]?.style?.backgroundImage) {
            docs[i].style.backgroundImage = `url(${aaaaaahhhhhh})`;
        };
    };

    let imgs = document.getElementsByTagName('img');
    for (let i in imgs) {
        if (imgs[i]?.src) {
            imgs[i].src = aaaaaahhhhhh;
        };
    };

    document.getElementById('home').style.backgroundImage = `url(${aaaaaahhhhhh})`;
};

function textAAAAHHHH() {
    let docs = [
        ...document.getElementsByTagName('span'),
        ...document.getElementsByTagName('p'),
        ...document.getElementsByTagName('h1'),
        ...document.getElementsByTagName('h2'),
        ...document.getElementsByTagName('h3'),
    ];

    for (let i in docs) {
        if (docs[i]?.childNodes) {
            for (let c in docs[i].childNodes) {
                if (docs[i]?.childNodes[c]?.nodeName === '#text' && docs[i]?.childNodes[c]?.textContent?.length > 0) {
                    let text = docs[i].childNodes[c].textContent;
                    let newText = convertAAAAHH(text);
                    docs[i].childNodes[c].textContent = newText;
                };
            };
        };
    };

    document.getElementById('description-Carousel').remove();
    document.getElementById('no-motion-description').removeAttribute('hidden');
};

function convertAAAAHH(aaaahhhh) {
    let newAAAAHHHH = '';

    let AAAAHHHHlength = aaaahhhh.length;

    let splitAAAAHHHH = aaaahhhh.split('');
    for (let i in splitAAAAHHHH) {
        if (splitAAAAHHHH[i] === ' ') {
            newAAAAHHHH += ' ';
        } else {
            let toUpper = splitAAAAHHHH[i].toUpperCase();
            let isUpper = toUpper === splitAAAAHHHH[i];
    
            let whichLetter =  i < AAAAHHHHlength / 2 ? 'a' : 'h';
            whichLetter = isUpper ? whichLetter.toUpperCase() : whichLetter;

            newAAAAHHHH += whichLetter;
        };
    };

    if (!newAAAAHHHH || newAAAAHHHH?.length === 0) {
        newAAAAHHHH = aaaahhhh; 
    };

    return newAAAAHHHH;
};