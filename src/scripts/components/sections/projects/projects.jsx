/* eslint-disable react/jsx-no-bind */
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Tooltip,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import FilterData from "../../../../data/filterData.json";
import ProjectsData from "../../../../data/projectsData.json";
import { logAnalyticsEvent } from "../../../../firebase";
import { returnImages } from "../../../helper/imageImporter";
import "./projects.scss";

/** Display all projects and experiences I've worked on */
export default function Projects() {
	const [displayJSX, setDisplayJSX] = useState(null);

	/** Default projects being showcased */
	const defaultList = [];

	/**
	 * Flip the expand icon on the filter accordion
	 */
	function flipExpandIcon(whichToFlip) {
		if (document.getElementById(whichToFlip)?.style.transform) {
			document.getElementById(whichToFlip).style.transform = null;
		} else if (document.getElementById(whichToFlip)) {
			document.getElementById(whichToFlip).style.transform = "rotate(180deg)";
		}
	}

	/**
	 * Display projects and experiences in component
	 */
	async function createProjectsDisplay() {
		if (ProjectsData) {
			/** Display projects as JSX */
			const displayJSXData = [];

			for (const [key, value] of Object.entries(ProjectsData)) {
				/** Project thumbnail */
				// eslint-disable-next-line no-await-in-loop
				const thumbnail = await returnImages(key, "thumbnail");
				/** Project URL */
				const url = value?.url || "#";

				if (value?.showcase) {
					defaultList.push(key);
				}

				let displayResponsibilities = null;
				if (value?.responsibilities) {
					displayResponsibilities = [];

					const responsibilities = [];

					for (const i in value.responsibilities) {
						if (value.responsibilities[i]) {
							responsibilities.push(
								<li key={`${key}-responsibilities-${i}`} className="responsibilities-bullets">
									{value.responsibilities[i]}
								</li>,
							);
						}
					}

					displayResponsibilities.push(
						<Accordion
							key={`${key}-responsibilities`}
							className="filter-Accordion responsibilities-Accordion"
							onClick={(e) => e.preventDefault()}
						>
							<AccordionSummary
								className="filter-AccordionHeader responsibilities-AccordionHeader"
								aria-controls={`${key}-responsibilities-content`}
								id={`${key}-responsibilities-header`}
								onClick={() => flipExpandIcon(`${key}-responsibilities-expand`)}
								key={`${key}-responsibilities-summary`}
							>
								<Typography className="filter-Header" key={`${key}-responsibilities-HeaderText`}>
									Responsibilities{" "}
									<ExpandMoreIcon
										className="filter-Expand"
										id={`${key}-responsibilities-expand`}
										fontSize="large"
										key={`${key}-responsibilities-ExpandMoreIcon`}
									/>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<ul>{responsibilities}</ul>
							</AccordionDetails>
						</Accordion>,
					);
				}

				/** Display filter keywords on each project */
				let displayKeywords = null;
				if (value?.filter) {
					displayKeywords = [];

					/** Keywords as JSX */
					const keywordsFilters = [];

					for (const [filter, keywords] of Object.entries(value.filter)) {
						const innerKeywords = [];
						for (const i in keywords) {
							if (FilterData?.[keywords[i]]?.name) {
								innerKeywords.push(FilterData[keywords[i]].name);
							}
						}

						if (innerKeywords.length > 0) {
							keywordsFilters.push(
								<p key={`keywordFilters-${filter}-words`}>{innerKeywords.join(", ")}</p>,
							);
						}
					}

					displayKeywords.push(
						<Accordion
							key={`${key}-languages`}
							className="filter-Accordion responsibilities-Accordion"
							onClick={(e) => e.preventDefault()}
						>
							<AccordionSummary
								className="filter-AccordionHeader responsibilities-AccordionHeader"
								aria-controls={`${key}-languages-content`}
								id={`${key}-languages-header`}
								onClick={() => flipExpandIcon(`${key}-languages-expand`)}
								key={`${key}-languages-summary`}
							>
								<Typography className="filter-Header" key={`${key}-languages-HeaderText`}>
									Languages, Libraries, Frameworks and Tools{" "}
									<ExpandMoreIcon
										className="filter-Expand"
										id={`${key}-languages-expand`}
										fontSize="large"
										key={`${key}-languages-ExpandMoreIcon`}
									/>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>{keywordsFilters}</AccordionDetails>
						</Accordion>,
					);
				}

				displayJSXData.push(
					<Grid
						item
						key={key}
						id={`${key}_project`}
						className="projects-DisplayContainer"
						hidden={!value?.showcase}
					>
						<a
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className="projects-URL"
							onClick={() => {
								logAnalyticsEvent("click_projects", {
									name: value?.name,
								});
							}}
						>
							<Tooltip title={value?.name} describeChild arrow>
								<Card className="projects-Card">
									<CardActionArea>
										<CardMedia
											id={`${key}-thumbnail`}
											className="projects-Thumbnail"
											image={thumbnail}
										/>
										<CardContent>
											<Typography gutterBottom variant="h5" component="h2">
												{value?.name}
											</Typography>
											<Typography variant="body1" component="p">
												{value?.["most-recent-title"]}
											</Typography>
											<hr />
											<Typography variant="body2" color="textSecondary" component="p">
												{value?.description}
											</Typography>
											{displayResponsibilities}
											{displayKeywords}
										</CardContent>
									</CardActionArea>
								</Card>
							</Tooltip>
						</a>
					</Grid>,
				);
			}

			setDisplayJSX(displayJSXData);
		}
	}

	useEffect(() => {
		if (!displayJSX) {
			createProjectsDisplay();
		}
	});

	return (
		<div id="projectsContainer" className="projects-Container" key="projects-Container" role="region">
			<div id="projects" className="projects" key="projects">
				<span className="project-Experiences" key="projects-Title" role="heading" aria-level="2">
					Projects & Experience
				</span>
				<Grid
					container
					direction="row"
					justifyContent="space-evenly"
					alignItems="center"
					spacing={2}
					className="projects-Grid"
					key="projects-Grid"
				>
					{displayJSX}
				</Grid>
			</div>
		</div>
	);
}
