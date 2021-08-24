import React, { Suspense } from 'react';
import './projects.css';
import ProjectsData from './projectsData.json';
import { returnImages } from './imageImporter';
const Grid = React.lazy(() => import('@material-ui/core/Grid'));
const Card = React.lazy(() => import('@material-ui/core/Card'));
const CardActionArea = React.lazy(() => import('@material-ui/core/CardActionArea'));
const CardMedia = React.lazy(() => import('@material-ui/core/CardMedia'));
const CardContent = React.lazy(() => import('@material-ui/core/CardContent'));
const Typography = React.lazy(() => import('@material-ui/core/Typography'));

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
                let url = value?.url || "#";

                displayJSXData.push(
                    <Grid item xs={12} md={3} key={key} className="projects-DisplayContainer" hidden={!value?.showcase} >
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
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {value?.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
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
                        <Grid container spacing={3} className="projects-Grid">
                            {this.state.displayJSX}
                        </Grid>
                    </div>
                </div>
            </Suspense>
        );
    }
}