export function createHoverColourWords(text, className) {
    let returnJSX = [];

    for (let i in text) {
        returnJSX.push(
            <span key={`${text[i]}-${i}`} className={className}>{text[i]}</span>
        );
    };

    return returnJSX;
};