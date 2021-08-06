import React, { Suspense } from 'react';
import './toolbar.css';
const AppBar = React.lazy(() => import('@material-ui/core/AppBar'));
const ToolBar = React.lazy(() => import('@material-ui/core/ToolBar'));
const Button = React.lazy(() => import('@material-ui/core/Button'));

export default class Toolbar extends React.Component {
    render() {
        return (
            <Suspense fallback={null}>
                <AppBar position="fixed">
                    <ToolBar>
                        <Button className="viewPoint-active" variant="h6">Home</Button>
                        <Button variant="h6">About</Button>
                        <Button variant="h6">Projects</Button>
                        <Button variant="h6">Gaming</Button>
                        <Button variant="h6">Contact</Button>
                    </ToolBar>
                </AppBar>
            </Suspense>
        );
    }
}