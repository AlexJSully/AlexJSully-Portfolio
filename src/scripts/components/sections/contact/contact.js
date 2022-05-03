import React, {Suspense, lazy} from "react";
import "./contact.css";
// Lazy load Material-UI components
const Button = lazy(() => import("@mui/material/Button"));
// Icons
const TwitterIcon = lazy(() => import("@mui/icons-material/Twitter"));
const GitHubIcon = lazy(() => import("@mui/icons-material/GitHub"));
const LinkedInIcon = lazy(() => import("@mui/icons-material/LinkedIn"));
const CopyrightIcon = lazy(() => import("@mui/icons-material/Copyright"));

/** Contact section of UI */
export default function Contact() {
	const socialMediaInfo = {
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

	const email = "alexjsully.connect@outlook.com";

	/**
	 * Create social media icons
	 * @returns {JSX.Element[]} JSX of social media icons
	 */
	function socialMediaIcons() {
		/** Social media icons */
		const socialMediaIconsList = [];

		for (const [, value] of Object.entries(socialMediaInfo)) {
			socialMediaIconsList.push(
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

		return socialMediaIconsList;
	}

	return (
		<Suspense fallback={null}>
			<div id="contactContainer" className="contact-Container" key="contact-Container" role="region">
				<div id="contact" className="contact" key="contact-Contact">
					<p key="contact-Text" role="heading" aria-level="2">
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
					<p className="contact-Footer" key="contact-Footer" role="complementary">
						Handcrafted by <br />
						<CopyrightIcon />
						Alexander Joo-Hyun Sullivan
					</p>
				</div>
			</div>
		</Suspense>
	);
}
