import {
	Copyright as CopyrightIcon,
	GitHub as GitHubIcon,
	LinkedIn as LinkedInIcon,
	Twitter as TwitterIcon,
} from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { logAnalyticsEvent } from "../../../../firebase";
import "./contact.scss";

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
						onClick={() => {
							logAnalyticsEvent("click_contact", {
								contact: value?.text,
							});
						}}
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
