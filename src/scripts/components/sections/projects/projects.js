import React from 'react';
import './projects.css';
import ProjectsData from './projectsData.json';
import { returnImages, returnFilterImages } from './components/imageImporter';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Switch from '@material-ui/core/Switch';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

export default class Toolbar extends React.Component {
    constructor() {
        super();

        this.and = true;
        this.filterList = [];
        this.defaultList = [];

        this.state = {
            displayJSX: null,
            displayFilter: null,
        };
    };

    handleAndOrChange() {
        if (document.getElementById('andOrSwitcher')) {
            this.and = !document.getElementById('andOrSwitcher').checked;

            this.filterProjects(undefined);
        };
    };

    flipExpandIcon() {
        if (document.getElementById('filter-Expand')?.style.transform) {
            document.getElementById('filter-Expand').style.transform = null;
        } else if (document.getElementById('filter-Expand')) {
            document.getElementById('filter-Expand').style.transform = 'rotate(180deg)';
        };
    };

    async createFilterDisplay() {
        let filters = {
            'language': [],
            'frameworks': [],
            'type': []
        };

        // eslint-disable-next-line no-unused-vars
        for (const [key, value] of Object.entries(ProjectsData)) {
            if (value?.filter) {
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

        let filterJSX = [];

        let colSize = parseInt(12 / Object.keys(filters)?.length);
        if (!colSize || colSize < 1) {
            colSize = 1;
        };

        for (const [key, value] of Object.entries(filters)) {
            let innerFilterJSX = [];

            for (let i in value) {
                let keywordThumbnail = await returnFilterImages(filters, value[i]);

                if (keywordThumbnail) {
                    innerFilterJSX.push(
                        <Card className="projects-Card filter-Cards">
                            <CardActionArea className="filter-ActionCard" onClick={() => this.filterProjects(`${value[i]}`)} id={`${value[i]}_card`}>
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
                    <Card className="projects-Card">
                        <CardContent>
                            <Grid container>
                                {innerFilterJSX}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            );
        };

        if (filterJSX?.length > 0) {
            let toDisplay = [];

            toDisplay.push(
                <Accordion className="filter-Accordion" >
                    <AccordionSummary
                        className="filter-AccordionHeader"
                        aria-controls="filter-content"
                        id="filter-header"
                        onClick={() => this.flipExpandIcon()}
                    >
                        <Typography className="filter-Header">
                            Filter <ExpandMoreIcon className="filter-Expand" id="filter-Expand" fontSize="large" />
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3} className="projects-Grid">
                            <Grid item xs={12} className="filter-Switcher">
                                <p className="filter-SwitcherDescription">
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
                                />
                                OR
                            </Grid>
                            {filterJSX}
                            <br />
                            <Button variant="contained" color="primary" className="filter-Reset" onClick={() => this.resetFilters()}>Reset Filters</Button>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            );

            this.setState({
                displayFilter: toDisplay
            });
        };
    };

    filterProjects(whichToFilter = undefined) {
        if (this.filterList.includes(whichToFilter)) {
            this.filterList.splice(this.filterList.indexOf(whichToFilter), 1);

            document.getElementById(`${whichToFilter}_filter`).classList.add('projects-Thumbnail');
            document.getElementById(`${whichToFilter}_filter`).classList.remove('filter-Filtering');
        } else if (whichToFilter) {
            this.filterList.push(whichToFilter);

            document.getElementById(`${whichToFilter}_filter`).classList.add('filter-Filtering');
            document.getElementById(`${whichToFilter}_filter`).classList.remove('projects-Thumbnail');  
        };

        
        for (const [key, value] of Object.entries(ProjectsData)) {
            if (this.filterList?.length > 0) {
                let toDisplay = false;

                if (value?.combinedKeywords) {
                    if (this.and) {
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

    resetFilters() {
        let toReset = {...this.filterList};

        for (let i in toReset) {
            this.filterProjects(toReset[i]);
        };
    };

    async createProjectsDisplay() {
        if (ProjectsData) {
            let displayJSXData = [];

            for (const [key, value] of Object.entries(ProjectsData)) {
                let thumbnail = await returnImages(key, "thumbnail");
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
                                        <Typography variant="body1" color="white" component="p">
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
            <div id="projectsContainer" className="projects-Container">
                <div id="projects" className="projects">
                    <span className="project-Experiences">Experiences</span>
                    <br />
                    {this.state.displayFilter}
                    <br />
                    <Grid container spacing={3} className="projects-Grid">
                        {this.state.displayJSX}
                    </Grid>
                </div>
            </div>
        );
    };
};