export function handleMoveBackground(event, whichElement, howMuchMove = 55) {
    if (document.getElementById(whichElement)) {
        if (document.getElementById(whichElement) && event?.pageX && event?.pageY) {
            let moveHeight = (howMuchMove / window.innerHeight) * (event.pageY - window.innerHeight);
            let moveWidth = (howMuchMove / window.innerWidth) * (event.pageX - window.innerWidth);
    
            document.getElementById(whichElement).style.backgroundPosition = `${moveWidth}px ${moveHeight}px`;
        };
    };
};