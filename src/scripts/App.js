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
	return (
		<div id="App" className="App" key="App-section" role="main">
			<h2 hidden id="keywords">
				{process.env.REACT_APP_KEYWORDS.join(",")}
			</h2>

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
