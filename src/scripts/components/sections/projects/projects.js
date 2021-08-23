import React, { Suspense } from 'react';
import './projects.css';
import ProjectsData from './projectsData.json';
import { returnImages } from './imageImporter';
const Grid = React.lazy(() => import('@material-ui/core/Grid'));

export default class Toolbar extends React.Component {
    constructor() {
        super();

        this.state = {
            displayJSX: null
        };
    };

    displayProjectInformation(toChange, project) {
        if (document.getElementById(`${project}-title`)) {
            if (toChange) {
                document.getElementById(`${project}-title`).style.marginTop = `-100%`;

                let topDistance = document.getElementById(`${project}-details`).offsetHeight / 59;

                document.getElementById(`${project}-details`).style.marginTop = `calc(25% + ${topDistance}em)`;
            } else {
                document.getElementById(`${project}-title`).style.marginTop = '';
                document.getElementById(`${project}-details`).style.marginTop = '75%';
            }
        }
    };

    async createProjectsDisplay() {
        if (ProjectsData) {
            let displayJSXData = [];

            for (const [key, value] of Object.entries(ProjectsData)) {
                let thumbnail = await returnImages(key, "thumbnail");

                let style = {
                    backgroundImage: `url(${thumbnail})`
                };

                displayJSXData.push(
                    <Grid item xs={12} md={2} key={key} className="projects-DisplayContainer" hidden={!value?.showcase} onMouseEnter={() => this.displayProjectInformation(true, key)} onMouseLeave={() => this.displayProjectInformation(false, key)} >
                        <a href={value?.url} className="projects-URL">
                            <div id={`${key}-container`} style={style} className="projects-Display" >
                                <div id={`${key}-title`} className="project-TitleContainer">
                                    <span className="project-Title">{value?.name}</span>
                                </div>
                                <div id={`${key}-details`} className="project-DetailsContainer">
                                    <span className="project-Details">{value?.description}</span>
                                </div>
                            </div>
                        </a>
                    </Grid>
                );
            };

            this.setState({
                displayJSX: displayJSXData
            });
        };
    };

    componentDidMount() {
        this.createProjectsDisplay();
    };

    render() {
        return (
            <Suspense fallback={null}>
                <div id="projectsContainer" className="projects-Container">
                    <div id="projects" className="projects">
                        Projects!
                        <Grid container spacing={2} className="projects-Grid">
                            {this.state.displayJSX}
                        </Grid>
                    </div>
                </div>
            </Suspense>
        );
    }
}