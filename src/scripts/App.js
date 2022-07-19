// CSS
import "./App.css";
// React
import React, {Suspense, lazy} from "react";
// Custom components
import Home from "./components/sections/home/home";

// Lazy load components
// Custom components
const Contact = lazy(() => import("./components/sections/contact/contact"));
const Policy = lazy(() => import("./components/sections/policy/policy"));
const Projects = lazy(() => import("./components/sections/projects/projects"));
const Publications = lazy(() => import("./components/sections/publications/publications"));

/** Portfolio and showcase */
export default function App() {
	// prettier-ignore
	const keywords = ['portfolio', 'alex', 'science', 'bioinformatics', 'web-dev', 'gaming', 'showcase', 'computational', 'education', 'uoft', 'crispr', 'pedagogy', 'grna-sequence', 'scigrade', 'game', 'website', 'gamedev', 'design', 'movies', 'news', 'fashion', 'tumblr', 'technology', 'game-development', 'indie', 'comics', 'entertainment', 'web-scraping', 'publication-data', 'bioinformatic', 'rna', 'rna-seq', 'efp-seq-browser', 'efp', 'browser', 'data', 'data-visualization', 'visualization', 'plant', 'biology', 'arabidopsis', 'arabidopsis-thaliana', 'a-thaliana', 'provart', 'rna-seq-mapping', 'mapping', 'webapp', 'web', 'application', 'bam', 'alternative', 'splicing', 'database', 'bioinformatics-tool', 'bioinformatics-data', 'bioinformatics-visualization', 'eplant-plant-efp', 'compendiums', 'svg', 'nlp', 'data-mining', 'agriculture', 'computational-biology', 'gaia', 'web-tool', 'science-research', 'publication', 'scientific-research', 'citations', 'alexander', 'alexander-sullivan', 'joo-hyun', 'joohyun', 'alexjsully', 'kimsul', 'kimsully', 'j00hyun', 'fendo', 'ironjoohyun', 'theironsoul', 'asully', 'sully', 'full-stack-web-developer', 'data-visualization-programmer', 'laboratory-researcher', 'bioinformatician', 'computational-biologist', 'scientist', 'gamer', 'aws', 'apache', 'benchling', 'bootstrap', 'css', 'd3', 'git', 'google-analytics', 'google-cloud', 'html', 'javascript', 'js', 'jquery', 'json', 'markdown', 'material-ui', 'mobile', 'mongodb', 'mysql', 'office', 'php', 'python', 'r', 'react', 'sql', 'teaching', 'impact', 'depth', 'impact-depth', 'id', 'eplant', 'epe', 'assistant', 'teaching-assistant', 'ta', 'general', 'agricultural', 'intelligent', 'agent', 'general-agricultural-intelligent-agent', 's', 'science-grading', 'grading', 'esb', 'seq', 'sequencing', 'igem', 'igem-2016', 'gold-biosensing', 'gold', 'biosensing', 'small-dev-talk', 'sdt', 'small', 'dev', 'talk', 'mai-tutor', 'mt', 'mai', 'tutor', 'creator', 'teacher-assistant', 'project-lead', 'project', 'lead', 'full-stack-developer', 'full', 'stack', 'developer', 'programmer', 'laboratory-research-lead', 'laboratory', 'research', 'co-creator', 'journalist', 'masterpiece studio']

	return (
		<div id="App" className="App" key="App-section" role="main">
			<h1 hidden id="keywords">
				{keywords.join(",")}
			</h1>

			<Home key="Home-section" />

			<Suspense fallback={null}>
				<Projects key="Projects-section" />
				<Publications key="Publications-section" />
				<Contact key="Contact-section" />
				<Policy key="Policy-section" />
			</Suspense>
		</div>
	);
}
