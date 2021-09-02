import React from 'react';
import './toolbar.css';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/ToolBar';
import Button from '@material-ui/core/Button';

export default class Toolbar extends React.Component {
    render() {
        return (
            <AppBar position="fixed">
                <ToolBar>
                    <Button className="viewPoint-active">Home</Button>
                    <Button>Experiences</Button>
                    <Button>Contact</Button>
                </ToolBar>
            </AppBar>
        );
    }
}