/* eslint-disable no-import-assign */

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
// React
import React, { Suspense, lazy, useEffect, useState } from "react";

import ProfilePic from "../../../../images/me_drawn/profile_pic_drawn.webp";
import SneezePicStart from "../../../../images/me_drawn/profile_pic_drawn_2.webp";
import SneezingPic from "../../../../images/me_drawn/profile_pic_drawn_3.webp";
import SneezingUnsatisfied from "../../../../images/me_drawn/profile_pic_drawn_4.webp";
import { aaaahhhh } from "../../../interactivity/aaaahhhh";
import handleMoveBackground from "../../../interactivity/background-move";
import CreateHoverColourWords from "../../../interactivity/create-hover-words";
import { WordCarousel } from "../../../interactivity/word-carousel";
import "./home.css";

// Lazy load Material-UI components
const Checkbox = lazy(() => import("@mui/material/Checkbox"));
const FormControlLabel = lazy(() => import("@mui/material/FormControlLabel"));

/** Landing for portfolio website */
export default function Home() {
	const [displayAccessibilityToggles, setDisplayAccessibilityToggles] = useState(null);

	/** Professional descriptions */
	const descriptionCarousel = [
		"Bioinformatician",
		"Computational Biologist",
		"Data Visualization Programmer",
		"Full-Stack Web Developer",
		"Laboratory Researcher",
	];
	/** How many times the user has hovered over the profile picture */
	let hoveredProfilePic = 0;
	/** The number of times the profile picture has sneezed */
	let sneezeCounter = 0;
	/** AAAHHH */
	let aaahhh = false;

	/**
	 * Handle profile picture sneezing
	 */
	function handleTriggerSneeze(_e) {
		// If not trigger easter egg:
		if (!aaahhh) {
			// Add to hover count
			hoveredProfilePic += 1;

			// Every 5 times hovered/clicked, trigger sneeze easter egg
			if (hoveredProfilePic % 5 === 0) {
				if (sneezeCounter < 5) {
					document.getElementById("profilePic").src = SneezePicStart;

					// Have animation trigger based off time
					setTimeout(() => {
						document.getElementById("profilePic").src = SneezingPic;
					}, 500);

					setTimeout(() => {
						document.getElementById("profilePic").src = SneezingUnsatisfied;
					}, 800);

					setTimeout(() => {
						document.getElementById("profilePic").src = ProfilePic;
					}, 1500);

					sneezeCounter += 1;
				} else {
					// Trigger sneeze easter egg
					aaahhh = true;
					setTimeout(() => {
						aaaahhhh();
					}, 2801);
				}
			}
		}
	}

	/**
	 * Enable (or disable) global dyslexia font
	 */
	function handleGlobalDyslexia() {
		if (document.getElementById("dyslexia-toggle").checked) {
			document.getElementsByTagName("body")[0].classList.add("dyslexia-global");
		} else {
			document.getElementsByTagName("body")[0].classList.remove("dyslexia-global");
		}
	}

	/**
	 * Create accessibility toggle/checkbox in JSX
	 */
	function createAccessibilityToggles() {
		if (!displayAccessibilityToggles) {
			setDisplayAccessibilityToggles(
				<Suspense fallback={<Skeleton width="178px" height="42px" sx={{ bgcolor: "#1e222796" }} />}>
					<Tooltip title="Change all font to OpenDyslexic2" describeChild arrow>
						<FormControlLabel
							control={
								<Checkbox
									id="dyslexia-toggle"
									onChange={() => {
										handleGlobalDyslexia();
									}}
									color="secondary"
									key="dyslexia-toggle"
									role="checkbox"
									aria-checked="false"
									aria-label="Toggle Dyslexic Font - Checkbox"
								/>
							}
							className="accessibility-toggles dyslexia-toggle"
							label="Dyslexic Font"
							key="accessibility-toggles"
							role="switch"
							aria-checked="false"
							aria-label="Toggle Dyslexic Font"
						/>
					</Tooltip>
				</Suspense>,
			);
		}
	}

	useEffect(() => {
		WordCarousel("description-Carousel", descriptionCarousel);
		createAccessibilityToggles();

		// If IE, change profile picture to jpg version
		if (navigator.userAgent.indexOf("MSIE") !== -1 || navigator.userAgent.indexOf("Trident") !== -1) {
			import("../../../../images/me_drawn/profile_pic_drawn.jpg").then((img) => {
				ProfilePic = img.default;
			});

			// Do same for sneezing profile pictures
			import("../../../../images/me_drawn/profile_pic_drawn_2.jpg").then((img) => {
				SneezePicStart = img.default;
			});
			import("../../../../images/me_drawn/profile_pic_drawn_3.jpg").then((img) => {
				SneezingPic = img.default;
			});
			import("../../../../images/me_drawn/profile_pic_drawn_4.jpg").then((img) => {
				SneezingUnsatisfied = img.default;
			});
		}
	});

	return (
		<div className="home" id="home" key="home-Container" onMouseMove={(e) => handleMoveBackground(e, "App")}>
			{displayAccessibilityToggles}
			<img
				alt="Drawn version of me"
				className="profilePic"
				data-testid="profilePic"
				fetchpriority="high"
				height="20%"
				id="profilePic"
				key="home-ProfilePic"
				loading="auto"
				onClick={handleTriggerSneeze}
				onMouseEnter={handleTriggerSneeze}
				src={ProfilePic}
				width="20%"
			/>
			<h1 className="h2-description" key="home-Name" role="banner" id="hover-Name">
				{CreateHoverColourWords("Alexander Joo-Hyun Sullivan", "hover-Name")}
			</h1>
			<span
				aria-level="1"
				className="carousel-description h3-description"
				id="description-Carousel"
				key="home-DescriptionCarousel"
				role="heading"
			/>
			<h2
				aria-level="1"
				className="h3-description"
				hidden
				id="no-motion-description"
				key="home-NoMotionDescription"
			>
				Full-Stack Web Developer | Bioinformatician | Gamer
			</h2>
		</div>
	);
}
