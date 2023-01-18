import React, { Suspense, lazy, useEffect, useState } from "react";

import ProjectsData from "../../../../data/projectsData.json";
import PublicationsData from "../../../../data/publicationsData.json";
import "./publications.css";

// Lazy load components
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

		pubs.forEach((pub) => {
			/** Metadata */
			const metaData = [];

			if (pub?.doi) {
				metaData.push(`DOI: ${pub.doi}`);
			}

			if (pub?.journal) {
				metaData.push(`Journal: ${pub.journal}`);
			}

			if (pub?.date) {
				metaData.push(`Date: ${pub.date}`);
			}

			/** What project the publication relates too */
			const relatedProjectData = [];
			if (pub?.["related-project"]) {
				if (ProjectsData[pub["related-project"]]) {
					relatedProjectData.push(
						<span
							className="publications-URL"
							key={`research-related-${ProjectsData[pub["related-project"]].name}-url`}
						>
							{ProjectsData[pub["related-project"]].name}
						</span>,
					);
				}
			}

			/** Abstract to a limited number of words */
			let abstract = pub?.abstract;
			abstract = abstract.split(" ");
			abstract = abstract.slice(0, 100);
			abstract = abstract.join(" ");
			abstract += "...";

			publicationsJSX.push(
				<Grid item xs={12} key={`publications-grid-${pub?.doi}`}>
					<a
						href={`https://doi.org/${pub?.doi}`}
						target="_blank"
						rel="noopener noreferrer"
						className="publications-URL"
						key={`research-link-${pub?.title}`}
					>
						<Card className="publications-Card" key={`research-card-${pub?.title}`}>
							<CardActionArea key={`research-card-${pub?.title}-actionArea`}>
								<CardContent key={`research-card-${pub?.title}-content`}>
									<Typography variant="h5" component="h2" key={`research-card-${pub?.title}-title`}>
										{pub?.title}
									</Typography>
									<Typography
										className="publications-meta publications-authors"
										variant="body3"
										component="p"
										key={`research-card-${pub?.title}-authors`}
									>
										{pub?.authors.join(", ")}
									</Typography>
									<Typography
										className="publications-meta"
										variant="body3"
										component="p"
										key={`research-card-${pub?.title}-metaData`}
									>
										{metaData?.length > 0 ? metaData.join(" | ") : null}
									</Typography>
									<Typography
										className="publications-meta"
										variant="body3"
										component="p"
										key={`research-card-${pub?.title}-relatedProjects`}
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
										key={`research-card-${pub?.title}-abstract`}
									>
										{abstract}
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					</a>
				</Grid>,
			);
		});

		if (publicationsJSX.length > 0) {
			setDisplayJSX(
				<Suspense fallback={null} key="publicationJSX">
					<div
						id="publicationsContainer"
						className="publications-Container"
						key="publications-Container"
						role="region"
					>
						<div id="publications" className="publications" key="publications-Content">
							<span className="publications-Title" key="publications-Title" role="heading" aria-level="2">
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
