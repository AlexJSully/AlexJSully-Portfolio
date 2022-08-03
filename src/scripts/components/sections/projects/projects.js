// CSS
import "./projects.css";
// React
import React, {Suspense, lazy, useEffect, useState} from "react";
// Data
import FilterData from "../../../../data/filterData.json";
import ProjectsData from "../../../../data/projectsData.json";
// Helper functions
import {returnFilterImages, returnImages} from "../../../helper/imageImporter";

// Lazy load Material-UI components
const Grid = lazy(() => import("@mui/material/Grid"));
const Card = lazy(() => import("@mui/material/Card"));
const CardActionArea = lazy(() => import("@mui/material/CardActionArea"));
const CardContent = lazy(() => import("@mui/material/CardContent"));
const CardMedia = lazy(() => import("@mui/material/CardMedia"));
const Typography = lazy(() => import("@mui/material/Typography"));
const Accordion = lazy(() => import("@mui/material/Accordion"));
const AccordionSummary = lazy(() => import("@mui/material/AccordionSummary"));
const AccordionDetails = lazy(() => import("@mui/material/AccordionDetails"));
const ExpandMoreIcon = lazy(() => import("@mui/icons-material/ExpandMore"));
const Switch = lazy(() => import("@mui/material/Switch"));
const Button = lazy(() => import("@mui/material/Button"));

/** Display all projects and experiences I've worked on */
export default function Projects() {
	const [displayJSX, setDisplayJSX] = useState(null);
	const [displayFilter, setDisplayFilter] = useState(null);

	/** Filter toggle for including mutually exclusive filters or not */
	let and = true;
	/** What filters have been selected */
	let filterList = [];
	/** Default projects being showcased */
	const defaultList = [];

	/**
	 * Filter all projects that have been selected
	 * @param {String | Array} whichToFilter What is being filtered
	 * @param {Boolean} reset Whether should reset all filters [true] or not [false, default]
	 */
	function filterProjects(whichToFilter, reset = false) {
		/** All available filter document elements */
		const keywordFiltersDocuments = document.getElementsByClassName("projects-KeywordThumbnail");

		// If reset, then remove all filter classes and projects
		if (reset) {
			for (const i in keywordFiltersDocuments) {
				if (keywordFiltersDocuments[i].classList) {
					keywordFiltersDocuments[i].classList.add("projects-Thumbnail");
					keywordFiltersDocuments[i].classList.remove("filter-Filtering");
				}
			}

			filterList = [];
		} else if (whichToFilter) {
			// If in instance that filterList becomes undefined, make array again
			if (!filterList) {
				filterList = [];
			}

			// If filterList doesn't include which to filter, then add. If does, then remove
			if (filterList.includes(whichToFilter)) {
				filterList.splice(filterList.indexOf(whichToFilter), 1);
			} else {
				filterList.push(whichToFilter);
			}

			for (const i in keywordFiltersDocuments) {
				if (keywordFiltersDocuments[i]?.id && keywordFiltersDocuments[i]?.classList) {
					/** What is being filtered for */
					const currentFilter = keywordFiltersDocuments[i].id.substring(
						0,
						keywordFiltersDocuments[i].id.length - 7,
					);
					/** All class for current filter */
					const currentClasses = [...keywordFiltersDocuments[i].classList];

					if (filterList?.length > 0) {
						if (filterList.includes(currentFilter) && !currentClasses.includes("projects-Thumbnail")) {
							// If to filter for
							keywordFiltersDocuments[i].classList.add("projects-Thumbnail");
							keywordFiltersDocuments[i].classList.remove("filter-Filtering");
						} else if (
							!filterList.includes(currentFilter) &&
							!currentClasses.includes("filter-Filtering")
						) {
							// If not to filter for
							keywordFiltersDocuments[i].classList.add("filter-Filtering");
							keywordFiltersDocuments[i].classList.remove("projects-Thumbnail");
						}
					} else {
						if (currentClasses) {
							keywordFiltersDocuments[i].classList.add("projects-Thumbnail");
							keywordFiltersDocuments[i].classList.remove("filter-Filtering");
						}
					}
				}
			}
		}

		for (const [key, value] of Object.entries(ProjectsData)) {
			if (filterList?.length > 0) {
				// Should display project?
				let toDisplay = false;

				if (value?.combinedKeywords) {
					if (and) {
						/** Count of filter keywords that match filter list */
						let containsAll = 0;

						for (const i in filterList) {
							if (value.combinedKeywords.includes(filterList[i])) {
								containsAll += 1;
							}
						}

						if (containsAll === filterList.length) {
							toDisplay = true;
						}
					} else {
						for (const i in filterList) {
							if (value.combinedKeywords.includes(filterList[i])) {
								toDisplay = true;

								break;
							}
						}
					}
				}

				if (document.getElementById(`${key}_project`)) {
					if (toDisplay) {
						document.getElementById(`${key}_project`).removeAttribute("hidden");
					} else {
						document.getElementById(`${key}_project`).setAttribute("hidden", true);
					}
				}
			} else {
				if (defaultList.includes(key)) {
					document.getElementById(`${key}_project`).removeAttribute("hidden");
				} else {
					document.getElementById(`${key}_project`).setAttribute("hidden", true);
				}
			}
		}
	}

	/**
	 * Toggle including mutually exclusive filters or not
	 */
	function handleAndOrChange() {
		if (document.getElementById("andOrSwitcher")) {
			and = !document.getElementById("andOrSwitcher").checked;

			filterProjects();
		}
	}

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
	 * Reset selected filters
	 */
	function resetFilters() {
		filterProjects(filterList, true);
	}

	/**
	 * Create filter options and display in component
	 */
	async function createFilterDisplay() {
		/** What filter options are available */
		const filters = {
			language: [],
			frameworks: [],
			type: [],
		};

		// eslint-disable-next-line no-unused-vars
		for (const [key, value] of Object.entries(ProjectsData)) {
			if (value?.filter) {
				/** All filter options */
				let combinedKeywords = [];

				for (const [type, names] of Object.entries(value.filter)) {
					combinedKeywords = [...combinedKeywords, ...names];

					if (filters[type]) {
						filters[type] = [...filters[type], ...names];
						filters[type] = [...new Set(filters[type])];
						filters[type].sort();
					}
				}

				ProjectsData[key].combinedKeywords = combinedKeywords;
			}
		}

		/** Filter JSX */
		const filterJSX = [];

		/** Material-UI grid item size */
		let colSize = parseInt(12 / Number(filters ? Object.keys(filters).length : 1));
		if (!colSize || colSize < 1) {
			colSize = 1;
		}

		for (const [key, value] of Object.entries(filters)) {
			/** Each individual filter JSX */
			const innerFilterJSX = [];

			for (const i in value) {
				/** Filter thumbnail */
				const keywordThumbnail = await returnFilterImages(filters, value[i]);

				if (keywordThumbnail) {
					innerFilterJSX.push(
						<Grid item xs={3} key={`${key}-${value[i]}-Grid`}>
							<Card className="projects-Card filter-Cards" key={`${key}-${value[i]}-Card`}>
								<CardActionArea
									className="filter-ActionCard"
									onClick={() => filterProjects(`${value[i]}`)}
									id={`${value[i]}_card`}
									key={`${key}-${value[i]}-CardAction`}
								>
									<CardMedia
										id={`${value[i]}_filter`}
										className="projects-KeywordThumbnail"
										image={keywordThumbnail}
										title={`${FilterData?.[value[i]]?.name || value[i]}`}
										key={`${key}-${value[i]}`}
									/>
									{FilterData?.[value[i]]?.name || value[i]}
								</CardActionArea>
							</Card>
						</Grid>,
					);
				}
			}

			filterJSX.push(
				<Grid item xs={12} md={colSize} key={`${key}-filtering`} className="projects-DisplayContainer">
					<Card className="projects-Card" key={`${key}-Card`}>
						<CardContent key={`${key}-CardContent`}>
							<Grid
								container
								key={`${key}-GridContainer`}
								spacing={1}
								justifyContent="center"
								alignItems="flex-start"
							>
								{innerFilterJSX}
							</Grid>
						</CardContent>
					</Card>
				</Grid>,
			);
		}

		if (filterJSX?.length > 0) {
			/** Filter's JSX */
			const toDisplay = [];

			toDisplay.push(
				<Accordion className="filter-Accordion" key="filter-Accordion">
					<AccordionSummary
						className="filter-AccordionHeader"
						aria-controls="filter-content"
						id="filter-header"
						onClick={() => flipExpandIcon("filter-Expand")}
						key="filter-Summary"
					>
						<Typography className="filter-Header" key="filter-HeaderText">
							<h3>Filter</h3>{" "}
							<ExpandMoreIcon
								className="filter-Expand"
								id="filter-Expand"
								fontSize="large"
								key="filter-ExpandMoreIcon"
							/>
						</Typography>
					</AccordionSummary>
					<AccordionDetails key="filter-AccordionDetails">
						<Grid
							container
							spacing={3}
							className="projects-Grid"
							key="filter-AccordionGrid"
							justifyContent="center"
							alignItems="flex-start"
						>
							<Grid item xs={12} className="filter-Switcher" key="filter-AccordionSwitcher">
								<p className="filter-SwitcherDescription" key="filter-AccordionSwitcherDescription">
									Select one or more icons to filter my experiences. <br />
									Toggle between &quot;AND&quot; for experiences that contain all selected filters,{" "}
									<br />
									or &quot;OR&quot; for experiences that contain at least one selected filter.
								</p>
								AND
								<Switch
									onChange={() => handleAndOrChange()}
									color="secondary"
									name="checkedB"
									inputProps={{"aria-label": "primary checkbox"}}
									id="andOrSwitcher"
									key="filter-AccordionSwitch"
								/>
								OR
								<br />
								<Button
									variant="contained"
									color="primary"
									className="filter-Reset"
									onClick={() => resetFilters()}
									key="filter-Reset"
								>
									Reset Filters
								</Button>
							</Grid>
							{filterJSX}
						</Grid>
					</AccordionDetails>
				</Accordion>,
			);

			setDisplayFilter(toDisplay);
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
						responsibilities.push(
							<li key={`${key}-responsibilities-${i}`} className="responsibilities-bullets">
								{value.responsibilities[i]}
							</li>,
						);
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
						<a href={url} target="_blank" rel="noopener noreferrer" className="projects-URL">
							<Card className="projects-Card">
								<CardActionArea>
									<CardMedia
										id={`${key}-thumbnail`}
										className="projects-Thumbnail"
										image={thumbnail}
										title={key}
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
						</a>
					</Grid>,
				);
			}

			setDisplayJSX(displayJSXData);
		}
	}

	useEffect(() => {
		if (!displayJSX) {
			createFilterDisplay();
			createProjectsDisplay();
		}
	});

	return (
		<Suspense fallback={null}>
			<div id="projectsContainer" className="projects-Container" key="projects-Container" role="region">
				<div id="projects" className="projects" key="projects">
					<span className="project-Experiences" key="projects-Title" role="heading" aria-level="2">
						Projects & Experience
					</span>
					<br />
					{displayFilter}
					<br />
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
		</Suspense>
	);
}
