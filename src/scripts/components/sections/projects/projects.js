import React, { Suspense } from 'react';
import './projects.css';
import ProjectsData from './projectsData.json';
import { returnImages, returnFilterImages } from './components/imageImporter';
// Material-UI
const Grid = React.lazy(() => import('@mui/material/Grid'));
const Card = React.lazy(() => import('@mui/material/Card'));
const CardActionArea = React.lazy(() => import('@mui/material/CardActionArea'));
const CardContent = React.lazy(() => import('@mui/material/CardContent'));
const CardMedia = React.lazy(() => import('@mui/material/CardMedia'));
const Typography = React.lazy(() => import('@mui/material/Typography'));
const Accordion = React.lazy(() => import('@mui/material/Accordion'));
const AccordionSummary = React.lazy(() => import('@mui/material/AccordionSummary'));
const AccordionDetails = React.lazy(() => import('@mui/material/AccordionDetails'));
const ExpandMoreIcon = React.lazy(() => import('@mui/icons-material/ExpandMore'));
const Switch = React.lazy(() => import('@mui/material/Switch'));
const Button = React.lazy(() => import('@mui/material/Button'));

/** Display all projects and experiences I've worked on */
export default class Projects extends React.Component {
    constructor() {
        super();

        /** Filter toggle for including mutually exclusive filters or not */
        this.and = true;
        /** What filters have been selected */
        this.filterList = [];
        /** Default projects being showcased */
        this.defaultList = [];

        this.state = {
            displayJSX: null,
            displayFilter: null,
        };
    };

    /**
     * Toggle including mutually exclusive filters or not
     */
    handleAndOrChange() {
        if (document.getElementById('andOrSwitcher')) {
            this.and = !document.getElementById('andOrSwitcher').checked;

            this.filterProjects(undefined);
        };
    };

    /**
     * Flip the expand icon on the filter accordion
     */
    flipExpandIcon() {
        if (document.getElementById('filter-Expand')?.style.transform) {
            document.getElementById('filter-Expand').style.transform = null;
        } else if (document.getElementById('filter-Expand')) {
            document.getElementById('filter-Expand').style.transform = 'rotate(180deg)';
        };
    };

    /**
     * Create filter options and display in component
     */
    async createFilterDisplay() {
        /** What filter options are available */
        let filters = {
            'language': [],
            'frameworks': [],
            'type': []
        };

        // eslint-disable-next-line no-unused-vars
        for (const [key, value] of Object.entries(ProjectsData)) {
            if (value?.filter) {
                /** All filter options */
                let combinedKeywords = [];

                for (const [innerKey, innerValue] of Object.entries(value.filter)) {
                    // eslint-disable-next-line no-unused-vars
                    for (const [innerKey, innerValue] of Object.entries(value.filter)) {
                        combinedKeywords = [...combinedKeywords, ...innerValue];
                    };

                    if (filters[innerKey]) {
                        filters[innerKey] = [...filters[innerKey], ...innerValue];
                        filters[innerKey] = [...new Set(filters[innerKey])];
                    };
                };

                ProjectsData[key]['combinedKeywords'] = combinedKeywords;
            };
        };

        /** Filter JSX */
        let filterJSX = [];

        /** Material-UI grid item size */
        let colSize = parseInt(12 / Object.keys(filters)?.length);
        if (!colSize || colSize < 1) {
            colSize = 1;
        };

        for (const [key, value] of Object.entries(filters)) {
            /** Each individual filter JSX */
            let innerFilterJSX = [];

            for (let i in value) {
                /** Filter thumbnail */
                let keywordThumbnail = await returnFilterImages(filters, value[i]);

                if (keywordThumbnail) {
                    innerFilterJSX.push(
                        <Card className="projects-Card filter-Cards" key={`${key}-${value[i]}-Card`}>
                            <CardActionArea className="filter-ActionCard" onClick={() => this.filterProjects(`${value[i]}`)} id={`${value[i]}_card`}  key={`${key}-${value[i]}-CardAction`}>
                                <CardMedia
                                    id={`${value[i]}_filter`}
                                    className="projects-KeywordThumbnail"
                                    image={keywordThumbnail}
                                    title={`${value[i]}`}
                                    key={`${key}-${value[i]}`}
                                />
                            </CardActionArea>
                        </Card>
                    );
                };
            };

            filterJSX.push(
                <Grid item xs={12} md={colSize} key={`${key}-filtering`} className="projects-DisplayContainer" >
                    <Card className="projects-Card" key={`${key}-Card`}>
                        <CardContent key={`${key}-CardContent`}>
                            <Grid container key={`${key}-GridContainer`}>
                                {innerFilterJSX}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            );
        };

        if (filterJSX?.length > 0) {
            /** Filter's JSX */
            let toDisplay = [];

            toDisplay.push(
                <Accordion className="filter-Accordion" key={`filter-Accordion`}>
                    <AccordionSummary
                        className="filter-AccordionHeader"
                        aria-controls="filter-content"
                        id="filter-header"
                        onClick={() => this.flipExpandIcon()}
                        key={`filter-Summary`}
                    >
                        <Typography className="filter-Header" key={`filter-HeaderText`}>
                            Filter <ExpandMoreIcon className="filter-Expand" id="filter-Expand" fontSize="large" key={`filter-ExpandMoreIcon`}/>
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails key={`filter-AccordionDetails`}>
                        <Grid container spacing={3} className="projects-Grid" key={`filter-AccordionGrid`}>
                            <Grid item xs={12} className="filter-Switcher" key={`filter-AccordionSwitcher`}>
                                <p className="filter-SwitcherDescription" key={`filter-AccordionSwitcherDescription`}>
                                    Select one or more icons to filter my experiences. <br/>
                                    Toggle between "AND" for experiences that contain all selected filters, <br />
                                    or "OR" for experiences that contain at least one selected filter.
                                </p>
                                AND
                                <Switch
                                    onChange={() => this.handleAndOrChange()}
                                    color="secondary"
                                    name="checkedB"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                    id="andOrSwitcher"
                                    key={`filter-AccordionSwitch`}
                                />
                                OR
                                <br />
                                <Button variant="contained" color="primary" className="filter-Reset" onClick={() => this.resetFilters()} key={`filter-Reset`}>Reset Filters</Button>
                            </Grid>
                            {filterJSX}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            );

            this.setState({
                displayFilter: toDisplay
            });
        };
    };

    /**
     * Filter all projects that have been selected
     * @param {String | Array} whichToFilter What is being filtered
     * @param {Boolean} reset Whether should reset all filters [true] or not [false, default] 
     */
    filterProjects(whichToFilter = undefined, reset = false) {
        /** All available filter document elements */
        let keywordFiltersDocuments = document.getElementsByClassName('projects-KeywordThumbnail');

        // If reset, then remove all filter classes and projects
        if (reset) {
            for (let i in keywordFiltersDocuments) {
                if (keywordFiltersDocuments[i].classList) {
                    keywordFiltersDocuments[i].classList.add('projects-Thumbnail');
                    keywordFiltersDocuments[i].classList.remove('filter-Filtering'); 
                };
            };

            this.filterList = [];
        } else {
            // If in instance that filterList becomes undefined, make array again
            if (!this.filterList) {
                this.filterList = [];
            };

            // If filterList doesn't include which to filter, then add. If does, then remove
            if (this.filterList.includes(whichToFilter)) {
                this.filterList.splice(this.filterList.indexOf(whichToFilter), 1);
            } else {
                this.filterList.push(whichToFilter);
            };

            for (let i in keywordFiltersDocuments) {
                if (keywordFiltersDocuments[i]?.id && keywordFiltersDocuments[i]?.classList) {
                    /** What is being filtered for */
                    let currentFilter = keywordFiltersDocuments[i].id.substr(0, keywordFiltersDocuments[i].id.length - 7);
                    /** All class for current filter */
                    let currentClasses = [...keywordFiltersDocuments[i].classList];
                    
                    if (this.filterList.includes(currentFilter) && !currentClasses.includes('projects-Thumbnail')) {
                        // If to filter for
                        keywordFiltersDocuments[i].classList.add('projects-Thumbnail');
                        keywordFiltersDocuments[i].classList.remove('filter-Filtering'); 
                    } else if (!this.filterList.includes(currentFilter) && !currentClasses.includes('filter-Filtering')) {
                        // If not to filter for
                        keywordFiltersDocuments[i].classList.add('filter-Filtering');
                        keywordFiltersDocuments[i].classList.remove('projects-Thumbnail');  
                    };
                }
                
            };
        };
        
        for (const [key, value] of Object.entries(ProjectsData)) {
            if (this.filterList?.length > 0) {
                // Should display project?
                let toDisplay = false;

                if (value?.combinedKeywords) {
                    if (this.and) {
                        /** Count of filter keywords that match filter list */
                        let containsAll = 0;
    
                        for (let i in this.filterList) {
                            if (value.combinedKeywords.includes(this.filterList[i])) {
                                containsAll += 1;
                            };
                        };
    
                        if (containsAll === this.filterList.length) {
                            toDisplay = true;
                        };
                    } else {
                        for (let i in this.filterList) {
                            if (value.combinedKeywords.includes(this.filterList[i])) {
                                toDisplay = true;
    
                                break;
                            };
                        };
                    };
                };
    
                if (document.getElementById(`${key}_project`)) {
                    if (toDisplay) {
                        document.getElementById(`${key}_project`).removeAttribute('hidden');
                    } else {
                        document.getElementById(`${key}_project`).setAttribute('hidden', true);
                    };
                };
            } else {
                if (this.defaultList.includes(key)) {
                    document.getElementById(`${key}_project`).removeAttribute('hidden');
                } else {
                    document.getElementById(`${key}_project`).setAttribute('hidden', true);
                };
            };
        };
    };

    /**
     * Reset selected filters
     */
    resetFilters() {
        this.filterProjects(this.filterList, true);
    };

    /**
     * Display projects and experiences in component
     */
    async createProjectsDisplay() {
        if (ProjectsData) {
            /** Display projects as JSX */
            let displayJSXData = [];

            for (const [key, value] of Object.entries(ProjectsData)) {
                /** Project thumbnail */
                let thumbnail = await returnImages(key, "thumbnail");
                /** Project URL */
                let url = value?.url || "#";

                if (value?.showcase) {
                    this.defaultList.push(key);
                };

                displayJSXData.push(
                    <Grid item xs={12} md={3} key={key} id={`${key}_project`} className="projects-DisplayContainer" hidden={!value?.showcase} >
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
                                            {value?.['most-recent-title']}
                                        </Typography>
                                        <hr />
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
        this.createFilterDisplay();
        this.createProjectsDisplay();
    };

    render() {
        return (
            <Suspense fallback={null}>
                <div id="projectsContainer" className="projects-Container" key={`projects-Container`}>
                    <div id="projects" className="projects" key={`projects`}>
                        <span className="project-Experiences" key={`projects-Title`}>Projects & Experience</span>
                        <br />
                        {this.state.displayFilter}
                        <br />
                        <Grid container spacing={2} className="projects-Grid" key={`projects-Grid`}>
                            {this.state.displayJSX}
                        </Grid>
                    </div>
                </div>
            </Suspense>
        );
    };
};