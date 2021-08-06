import React, { Suspense} from 'react';
import './App.css';
const Toolbar = React.lazy(() => import('./components/toolbar/toolbar'));
const Home = React.lazy(() => import('./components/sections/home/home'));

export default class App extends React.Component {
  render() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="App">
                <Toolbar />
                <Home />
            </div>
        </Suspense>
    );
  }
}