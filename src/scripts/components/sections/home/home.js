import React, { Suspense } from 'react';
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
const FormControlLabel = React.lazy(() => import('@material-ui/core/FormControlLabel'));
const Checkbox = React.lazy(() => import('@material-ui/core/Checkbox'));

export default class Home extends React.Component {
    constructor() {
        super();

        this.descriptionCarousel = ['Full-Stack Web Developer', 'Data Visualization Programmer', 'Laboratory Researcher', 'Bioinformatician', 'Computational Biologist', 'Scientist', 'Gamer'];

        this.moveBackground = false;
        this.hoveredProfilePic = 0;
        this.sneezeCounter = 0;
        this.aaahhh = false;

        this.state = {
            displayAccessibilityToggles: null
        };
    };

    handleTriggerSneeze() {
        if (!this.aaahhh) {
            this.hoveredProfilePic += 1;

            if (this.hoveredProfilePic % 5 === 0) {
                if (this.sneezeCounter < 5) {
                    document.getElementById('profilePic').src = SneezePicStart;
    
                    setTimeout(() => {
                        document.getElementById('profilePic').src = SneezingPic;
                    }, 500);
        
                    setTimeout(() => {
                        document.getElementById('profilePic').src = SneezingUnsatisfied;
                    }, 800);
        
                    setTimeout(() => {
                        document.getElementById('profilePic').src = ProfilePic;
                    }, 1500);
    
                    this.sneezeCounter += 1;
                } else {
                    this.aaahhh = true;
                    setTimeout(() => {
                        aaaahhhh();
                    }, 2801);
                    
                };
            };
        };
    };

    handleGlobalDyslexia() {
        if (document.getElementById('dyslexia-toggle').checked) {
            document.getElementsByTagName('body')[0].classList.add('dyslexia-global');
        } else {
            document.getElementsByTagName('body')[0].classList.remove('dyslexia-global');
        };
    };

    createAccessibilityToggles() {
        if (!this.state.displayAccessibilityToggles) {
            this.setState({
                displayAccessibilityToggles: (
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="dyslexia-toggle"
                                onChange={() => this.handleGlobalDyslexia()}
                                color="secondary"
                                key="dyslexia-toggle"
                            />
                        }
                        className="accessibility-toggles dyslexia-toggle"
                        label="Dyslexic Font"
                        title="Change all font to OpenDyslexic2"
                        key="accessibility-toggles"
                    />
                )
            });
        };
    };

    componentDidMount() {
        WordCarousel('description-Carousel', this.descriptionCarousel);
        this.createAccessibilityToggles();
    };

    render() {
        return (
            <Suspense fallback={null}>
                <div className="home App" id="home" key="home-Container" onMouseMove={(e) => handleMoveBackground(e, 'home')} >
                    {this.state.displayAccessibilityToggles}
                    <img 
                        className="profilePic" 
                        id="profilePic" 
                        key="home-ProfilePic"
                        src={ProfilePic} 
                        alt="Drawn version of me"
                        loading="lazy" 
                        onMouseEnter={() => this.handleTriggerSneeze()} 
                        onClick={() => this.handleTriggerSneeze()} 
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
}