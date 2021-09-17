import React, { Suspense } from 'react';
import './contact.css';
const Button = React.lazy(() => import('@material-ui/core/Button'));
// Icons
const TwitterIcon = React.lazy(() => import('@material-ui/icons/Twitter'));
const GitHubIcon = React.lazy(() => import('@material-ui/icons/GitHub'));
const LinkedInIcon = React.lazy(() => import('@material-ui/icons/LinkedIn'));
const CopyrightIcon = React.lazy(() => import('@material-ui/icons/Copyright'));

export default class Contact extends React.Component {
    constructor(props) {
        super(props);

        this.socialMediaInfo = {
            "Twitter": {
                "url": "https://twitter.com/alexjsully",
                "text": "Twitter",
                "icon": <TwitterIcon />,
            },
            "GitHub": {
                "url": "https://github.com/asully",
                "text": "GitHub",
                "icon": <GitHubIcon />,
            },
            "LinkedIn": {
                "url": "https://www.linkedin.com/in/alexanderjsullivan/",
                "text": "LinkedIn",
                "icon": <LinkedInIcon />,
            }
        };

        this.email = `alexjsully.connect@outlook.com`;
    };

    socialMediaIcons() {
        let socialMediaIcons = [];

        // eslint-disable-next-line no-unused-vars
        for (let [key, value] of Object.entries(this.socialMediaInfo)) {
            socialMediaIcons.push(
                <Button
                    href={value?.url}
                    key={`contact-button-${value?.text}-social`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-Button"
                    startIcon={value?.icon}
                    title={value?.text}
                />
            );
        };
        
        return socialMediaIcons;
    };

    render() {
        return (
            <Suspense fallback={null}>
                <div id="contactContainer" className="contact-Container" key="contact-Container">
                    <div id="contact" className="contact" key="contact-Contact">
                        <p key="contact-Text">
                            Interested in working together? <br />
                            <Button className="workTogether-Button" variant="contained" color="primary" href={`mailto:${this.email}`}  key="contact-Email">
                                Email
                            </Button>
                        </p>
                        {this.socialMediaIcons()}
                        <p className="contact-Footer" key="contact-Footer">
                            Handcrafted by <br />
                            <CopyrightIcon/>Alexander Joo-Hyun Sullivan
                        </p>
                    </div>
                </div>
            </Suspense>
        );
    }
}