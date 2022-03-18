import React, {Suspense, lazy, useState, useEffect} from "react";
import PublicationsData from "./publicationsData.json";
import ProjectsData from "../projects/projectsData.json";
import "./publications.css";
const Grid = lazy(() => import("@mui/material/Grid"));
const Card = lazy(() => import("@mui/material/Card"));
const CardActionArea = lazy(() => import("@mui/material/CardActionArea"));
const CardContent = lazy(() => import("@mui/material/CardContent"));
const Typography = lazy(() => import("@mui/material/Typography"));

/** Display publications */
export default function Publications() {
	const [displayJSX, setDisplayJSX] = useState(null);

	/**
	 * Create JSX to display publications
	 */
	function displayPublications() {
		/** All publication data */
		const pubs = PublicationsData.publications;
		/** Each publications' JSX */
		const publicationsJSX = [];

		for (let i = 0; i < pubs.length; i++) {
			/** Metadata */
			const metaData = [];
			if (pubs[i]?.doi) {
				metaData.push(`DOI: ${pubs[i].doi}`);
			}
			if (pubs[i]?.journal) {
				metaData.push(`Journal: ${pubs[i].journal}`);
			}
			if (pubs[i]?.date) {
				metaData.push(`Date: ${pubs[i].date}`);
			}

			/** What project the publication relates too */
			const relatedProjectData = [];
			if (pubs[i]?.["related-project"]) {
				if (ProjectsData[pubs[i]["related-project"]]) {
					relatedProjectData.push(
						<span
							className="publications-URL"
							key={`research-related-${ProjectsData[pubs[i]["related-project"]].name}-url`}
						>
							{ProjectsData[pubs[i]["related-project"]].name}
						</span>,
					);
				}
			}

			/** Abstract to a limited number of words */
			let abstract = pubs[i]?.abstract;
			abstract = abstract.split(" ");
			abstract = abstract.slice(0, 100);
			abstract = abstract.join(" ");
			abstract += "...";

			publicationsJSX.push(
				<Grid item xs={12} key={`publications-grid-${pubs[i]?.doi}`}>
					<a
						href={`https://doi.org/${pubs[i]?.doi}`}
						target="_blank"
						rel="noopener noreferrer"
						className="publications-URL"
						key={`research-link-${pubs[i]?.title}`}
					>
						<Card className="publications-Card" key={`research-card-${pubs[i]?.title}`}>
							<CardActionArea key={`research-card-${pubs[i]?.title}-actionArea`}>
								<CardContent key={`research-card-${pubs[i]?.title}-content`}>
									<Typography
										variant="h5"
										component="h2"
										key={`research-card-${pubs[i]?.title}-title`}
									>
										{pubs[i]?.title}
									</Typography>
									<Typography
										className="publications-meta publications-authors"
										variant="body3"
										component="p"
										key={`research-card-${pubs[i]?.title}-authors`}
									>
										{pubs[i]?.authors.join(", ")}
									</Typography>
									<Typography
										className="publications-meta"
										variant="body3"
										component="p"
										key={`research-card-${pubs[i]?.title}-metaData`}
									>
										{metaData?.length > 0 ? metaData.join(" | ") : null}
									</Typography>
									<Typography
										className="publications-meta"
										variant="body3"
										component="p"
										key={`research-card-${pubs[i]?.title}-relatedProjects`}
									>
										{relatedProjectData?.length > 0 ? (
											<span key={`related-project-${relatedProjectData}`}>
												Related projects: {relatedProjectData}
											</span>
										) : null}
									</Typography>
									<Typography
										className="publications-abstract"
										variant="body1"
										component="p"
										key={`research-card-${pubs[i]?.title}-abstract`}
									>
										{abstract}
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					</a>
				</Grid>,
			);
		}

		if (publicationsJSX.length > 0) {
			setDisplayJSX(
				<Suspense fallback={null} key="publicationJSX">
					<div id="publicationsContainer" className="publications-Container" key="publications-Container">
						<div id="publications" className="publications" key="publications-Content">
							<span className="publications-Title" key="publications-Title">
								Publications
							</span>
							<br key="publications-break" />
							<Grid container className="publications-Grid" key="publications-Grid">
								{publicationsJSX}
							</Grid>
						</div>
					</div>
				</Suspense>,
			);
		}
	}

	useEffect(() => {
		displayPublications();
	}, []);

	return displayJSX;
}
