import React, { Suspense } from "react";
import "./contact.css";
const Button = React.lazy(() => import("@mui/material/Button"));
// Icons
const TwitterIcon = React.lazy(() => import("@mui/icons-material/Twitter"));
const GitHubIcon = React.lazy(() => import("@mui/icons-material/GitHub"));
const LinkedInIcon = React.lazy(() => import("@mui/icons-material/LinkedIn"));
const CopyrightIcon = React.lazy(() => import("@mui/icons-material/Copyright"));

/** Contact section of UI */
export default function Contact() {
	let socialMediaInfo = {
		Twitter: {
			url: "https://twitter.com/alexjsully",
			text: "Twitter",
			icon: <TwitterIcon />,
		},
		GitHub: {
			url: "https://github.com/asully",
			text: "GitHub",
			icon: <GitHubIcon />,
		},
		LinkedIn: {
			url: "https://www.linkedin.com/in/alexanderjsullivan/",
			text: "LinkedIn",
			icon: <LinkedInIcon />,
		},
	};

	let email = `alexjsully.connect@outlook.com`;

	/**
	 * Create social media icons
	 * @returns {JSX.Element[]} JSX of social media icons
	 */
	function socialMediaIcons() {
		/** Social media icons */
		let socialMediaIcons = [];

		// eslint-disable-next-line no-unused-vars
		for (let [key, value] of Object.entries(socialMediaInfo)) {
			socialMediaIcons.push(
				<Button
					href={value?.url}
					key={`contact-button-${value?.text}-social`}
					target="_blank"
					rel="noopener noreferrer"
					className="contact-Button"
					startIcon={value?.icon}
					title={value?.text}
				/>,
			);
		}

		return socialMediaIcons;
	}

	return (
		<Suspense fallback={null}>
			<div
				id="contactContainer"
				className="contact-Container"
				key="contact-Container"
			>
				<div id="contact" className="contact" key="contact-Contact">
					<p key="contact-Text">
						Interested in working together? <br />
						<Button
							className="workTogether-Button"
							variant="contained"
							color="primary"
							href={`mailto:${email}`}
							key="contact-Email"
						>
							Email
						</Button>
					</p>
					{socialMediaIcons()}
					<p className="contact-Footer" key="contact-Footer">
						Handcrafted by <br />
						<CopyrightIcon />
						Alexander Joo-Hyun Sullivan
					</p>
				</div>
			</div>
		</Suspense>
	);
}
