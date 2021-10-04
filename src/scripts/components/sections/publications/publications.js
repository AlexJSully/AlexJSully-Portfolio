import React, { Suspense } from 'react';
import PublicationsData from './publicationsData.json';
import ProjectsData from '../projects/projectsData.json';
import './publications.css'
const Grid = React.lazy(() => import('@mui/material/Grid'));
const Card = React.lazy(() => import('@mui/material/Card'));
const CardActionArea = React.lazy(() => import('@mui/material/CardActionArea'));
const CardContent = React.lazy(() => import('@mui/material/CardContent'));
const Typography = React.lazy(() => import('@mui/material/Typography'));

/** Display publications */
export default class Publications extends React.Component {
    constructor() {
        super();

        this.state = {
            displayJSX: null
        };
    };

    /**
     * Create JSX to display publications
     */
    displayPublications() {
        /** All publication data */
        let pubs = PublicationsData.publications;
        /** Each publications' JSX */
        let publicationsJSX = [];

        for (let i = 0; i < pubs.length; i++) {
            /** Metadata */
            let metaData = [];
            if (pubs[i]?.doi) {
                metaData.push(`DOI: ${pubs[i].doi}`);
            };
            if (pubs[i]?.journal) {
                metaData.push(`Journal: ${pubs[i].journal}`);
            };
            if (pubs[i]?.date) {
                metaData.push(`Date: ${pubs[i].date}`);
            };

            /** What project the publication relates too */
            let relatedProjectData = [];
            if (pubs[i]?.['related-project']) {
                if (ProjectsData[pubs[i]['related-project']]) {
                    relatedProjectData.push(
                        <a href={ProjectsData[pubs[i]['related-project']].url} target="_blank" rel="noopener noreferrer" className="publications-URL">
                            {ProjectsData[pubs[i]['related-project']].name}
                        </a>
                    );
                };
            };

            /** Abstract to a limited number of words */
            let abstract = pubs[i]?.abstract;
            abstract = abstract.split(' ');
            abstract = abstract.slice(0, 100);
            abstract = abstract.join(' ');
            abstract += '...';

            publicationsJSX.push(
                <Grid item xs={12}>
                    <a href={`https://doi.org/${pubs[i]?.doi}`} target="_blank" rel="noopener noreferrer" className="publications-URL">
                        <Card className="publications-Card">
                            <CardActionArea>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {pubs[i]?.title}
                                    </Typography>
                                    <Typography className="publications-meta publications-authors" variant="body3" component="p">
                                        {pubs[i]?.authors.join(', ')}
                                    </Typography>
                                    <Typography className="publications-meta" variant="body3" component="p">
                                        {metaData?.length > 0 ? metaData.join(' | ') : null}
                                    </Typography>
                                    <Typography className="publications-meta" variant="body3" component="p">
                                        {relatedProjectData?.length > 0 ? 
                                            <span>Related projects: {relatedProjectData}</span> :
                                            null
                                        }
                                    </Typography>
                                    <Typography className="publications-abstract" variant="body1" component="p">
                                        {abstract}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </a>
                </Grid>
            );
        };

        if (publicationsJSX.length > 0) {
            this.setState({
                displayJSX: (
                    <Suspense fallback={null}> 
                        <div id="publicationsContainer" className="publications-Container" key={`publications-Container`}>
                            <div id="publications" className="publications" key={`publications`}>
                                <span className="publications-Title" key={`publications-Title`}>Publications</span>
                                <br />
                                <Grid container className="publications-Grid" key={`publications-Grid`}>
                                    {publicationsJSX}
                                </Grid>
                            </div>
                        </div>
                    </Suspense>
                )
            });
        };
    };

    componentDidMount() {
        this.displayPublications();
    };

    render() {
        return this.state.displayJSX;
    }
}