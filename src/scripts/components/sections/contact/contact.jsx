// Material-UI Icons
import CopyrightIcon from "@mui/icons-material/Copyright";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
// Material-UI
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
// React
import React from "react";
import "./contact.css";

/** Contact section of UI */
export default function Contact() {
	const socialMediaInfo = {
		Twitter: {
			url: "https://twitter.com/alexjsully",
			text: "Twitter",
			icon: <TwitterIcon />,
		},
		GitHub: {
			url: "https://github.com/alexjsully",
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
				<Tooltip title={value?.text} describeChild arrow key={`contact-button-${value?.text}-social-tooltip`}>
					<Button
						arial-label={value?.text}
						className="contact-Button"
						href={value?.url || ""}
						key={`contact-button-${value?.text}-social`}
						rel="noopener noreferrer"
						startIcon={value?.icon}
						target="_blank"
					/>
				</Tooltip>,
			);
		}

		return socialMediaIconsList;
	}

	return (
		<div id="contactContainer" className="contact-Container" key="contact-Container" role="region">
			<div id="contact" className="contact" key="contact-Contact">
				<p key="contact-Text" role="heading" aria-level="2">
					<span>Interested in working together?</span> <br />
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
	);
}
