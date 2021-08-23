import React, { Suspense} from 'react';
import './App.css';
const Toolbar = React.lazy(() => import('./components/toolbar/toolbar'));
const Home = React.lazy(() => import('./components/sections/home/home'));
const Projects = React.lazy(() => import('./components/sections/projects/projects'));

export default class App extends React.Component {
  render() {
    return (
        <Suspense fallback={null}>
            <div className="App">
                <Toolbar />
                <Home />
                <Projects />
            </div>
        </Suspense>
    );
  }
}