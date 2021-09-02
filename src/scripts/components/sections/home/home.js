import React from 'react';
import { handleMoveBackground } from '../../../interactivity/background-move';
import { WordCarousel } from '../../../interactivity/word-carousel';
import { createHoverColourWords } from '../../../interactivity/create-hover-words'
import './home.css';
import ProfilePic from '../../../../images/me_drawn/profile_pic_drawn.jpg';
import SneezePicStart from '../../../../images/me_drawn/profile_pic_drawn_2.jpg';
import SneezingPic from '../../../../images/me_drawn/profile_pic_drawn_3.jpg';
import SneezingUnsatisfied from '../../../../images/me_drawn/profile_pic_drawn_4.jpg';

export default class Home extends React.Component {
    constructor() {
        super();

        this.descriptionCarousel = ['Full-Stack Web Developer', 'Data Visualization Programmer', 'Laboratory Researcher', 'Bioinformatician', 'Computational Biologist', 'Scientist', 'Gamer'];

        this.moveBackground = false;
        this.hoveredProfilePic = 0;
    };

    handleTriggerSneeze() {
        this.hoveredProfilePic += 1;

        if (this.hoveredProfilePic % 5 === 0) {
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
        };
    };

    componentDidMount() {
        WordCarousel('descriptionText', this.descriptionCarousel);
    };

    render() {
        return (
            <div className="home App" id="home" onMouseMove={(e) => handleMoveBackground(e, 'home')} >
                <img 
                    className="profilePic" id="profilePic" src={ProfilePic} alt="Drawn version of me" loading="lazy" 
                    onMouseEnter={() => this.handleTriggerSneeze()} 
                    onClick={() => this.handleTriggerSneeze()} 
                />
                <h2 className="h2-description">
                    {createHoverColourWords("Alexander Joo-Hyun Sullivan", 'hover-Name')}
                </h2>
                <span id="descriptionText" className="carousel-description h3-description"></span>
                <h3 className="h3-description" hidden={true}>
                    Full-Stack Web Developer | Bioinformatician | Gamer
                </h3>
            </div>
        );
    }
}