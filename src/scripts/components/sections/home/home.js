import React, { Suspense, useState, useEffect } from 'react';
import { handleMoveBackground } from '../../../interactivity/background-move';
import { WordCarousel } from '../../../interactivity/word-carousel';
import { createHoverColourWords } from '../../../interactivity/create-hover-words';
import { aaaahhhh } from '../../../interactivity/aaaahhhh';
import './home.css';
import ProfilePic from '../../../../images/me_drawn/profile_pic_drawn.webp';
import SneezePicStart from '../../../../images/me_drawn/profile_pic_drawn_2.webp';
import SneezingPic from '../../../../images/me_drawn/profile_pic_drawn_3.webp';
import SneezingUnsatisfied from '../../../../images/me_drawn/profile_pic_drawn_4.webp';
// Material-UI
const FormControlLabel = React.lazy(() => import('@mui/material/FormControlLabel'));
const Checkbox = React.lazy(() => import('@mui/material/Checkbox'));

/** Landing for portfolio website */
export default function Home() {
    const [displayAccessibilityToggles, setDisplayAccessibilityToggles] = useState(null);

    /** Professional descriptions */
    let descriptionCarousel = ['Bioinformatician', 'Computational Biologist', 'Data Visualization Programmer', 'Full-Stack Web Developer', 'Laboratory Researcher'];
    /** How many times the user has hovered over the profile picture */
    let hoveredProfilePic = 0;
    /** The number of times the profile picture has sneezed */
    let sneezeCounter = 0;
    /** AAAHHH */
    let aaahhh = false;

    /**
     * Handle profile picture sneezing
     */
    function handleTriggerSneeze() {
        // If not trigger easter egg:
        if (!aaahhh) {
            // Add to hover count
            hoveredProfilePic += 1;

            // Every 5 times hovered/clicked, trigger sneeze easter egg
            if (hoveredProfilePic % 5 === 0) {
                if (sneezeCounter < 5) {
                    document.getElementById('profilePic').src = SneezePicStart;
    
                    // Have animation trigger based off time
                    setTimeout(() => {
                        document.getElementById('profilePic').src = SneezingPic;
                    }, 500);
        
                    setTimeout(() => {
                        document.getElementById('profilePic').src = SneezingUnsatisfied;
                    }, 800);
        
                    setTimeout(() => {
                        document.getElementById('profilePic').src = ProfilePic;
                    }, 1500);
    
                    sneezeCounter += 1;
                } else {
                    // Trigger sneeze easter egg
                    aaahhh = true;
                    setTimeout(() => {
                        aaaahhhh();
                    }, 2801);
                };
            };
        };
    };

    /**
     * Enable (or disable) global dyslexia font
     */
    function handleGlobalDyslexia() {
        if (document.getElementById('dyslexia-toggle').checked) {
            document.getElementsByTagName('body')[0].classList.add('dyslexia-global');
        } else {
            document.getElementsByTagName('body')[0].classList.remove('dyslexia-global');
        };
    };

    /**
     * Create accessibility toggle/checkbox in JSX
     */
    function createAccessibilityToggles() {
        if (!displayAccessibilityToggles) {
            setDisplayAccessibilityToggles((
                <FormControlLabel
                    control={
                        <Checkbox
                            id="dyslexia-toggle"
                            onChange={() => handleGlobalDyslexia()}
                            color="secondary"
                            key="dyslexia-toggle"
                        />
                    }
                    className="accessibility-toggles dyslexia-toggle"
                    label="Dyslexic Font"
                    title="Change all font to OpenDyslexic2"
                    key="accessibility-toggles"
                />
            ));
        };
    };

    useEffect(() => {
        WordCarousel('description-Carousel', descriptionCarousel);
        createAccessibilityToggles();
    });

    return (
        <Suspense fallback={null}>
            <div className="home" id="home" key="home-Container" onMouseMove={(e) => handleMoveBackground(e, 'App')} >
                {displayAccessibilityToggles}
                <img 
                    className="profilePic" 
                    id="profilePic" 
                    key="home-ProfilePic"
                    src={ProfilePic} 
                    alt="Drawn version of me"
                    loading="lazy" 
                    onMouseEnter={() => handleTriggerSneeze()} 
                    onClick={() => handleTriggerSneeze()} 
                />
                <h2 className="h2-description" key="home-Name">
                    {createHoverColourWords("Alexander Joo-Hyun Sullivan", 'hover-Name')}
                </h2>
                <span id="description-Carousel" className="carousel-description h3-description" key="home-DescriptionCarousel"></span>
                <h3 className="h3-description" id="no-motion-description" key="home-NoMotionDescription" hidden={true}>
                    Full-Stack Web Developer | Bioinformatician | Gamer
                </h3>
            </div>
        </Suspense>
    );
}