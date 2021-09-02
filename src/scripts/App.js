import React from 'react';
import './App.css';
import Toolbar from './components/toolbar/toolbar';
import Home from './components/sections/home/home';
import Projects from './components/sections/projects/projects';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
          <Toolbar />
          <Home />
          <Projects />
      </div>
    );
  }
}