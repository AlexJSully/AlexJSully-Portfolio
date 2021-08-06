import React, { Suspense } from 'react';
import './home.css';
import ProfilePic from '../../../../images/me_drawn/profile_pic_drawn.jpg';
import SneezePicStart from '../../../../images/me_drawn/profile_pic_drawn_2.jpg';
import SneezingPic from '../../../../images/me_drawn/profile_pic_drawn_3.jpg';
import SneezingUnsatisfied from '../../../../images/me_drawn/profile_pic_drawn_4.jpg';

export default class Home extends React.Component {
    constructor() {
        super();

        this.moveBackground = false;
        this.hoveredProfilePic = 0;
    }

    handleMoveBackground(event) {
        let howMuchMove = 55;

        if (document.getElementById('home') && event?.pageX && event?.pageY) {
            let moveHeight = (howMuchMove / window.innerHeight) * (event.pageY - window.innerHeight);
            let moveWidth = (howMuchMove / window.innerWidth) * (event.pageX - window.innerWidth);

            document.getElementById('home').style.backgroundPosition = `${moveWidth}px ${moveHeight}px`;
        };
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
        }
    }

    render() {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <div className="home App" id="home" onMouseMove={(e) => this.handleMoveBackground(e)}>
                    <img className="profilePic" id="profilePic" src={ProfilePic} alt="Drawn version of me" loading="lazy" onMouseEnter={() => this.handleTriggerSneeze()}/>
                    <h3 className="h3-description">
                        Full-Stack Web Developer | Bioinformatician | Gamer
                    </h3>
                </div>
            </Suspense>
        );
    }
}