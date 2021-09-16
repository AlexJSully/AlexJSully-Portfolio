import React from 'react';
import './App.css';
import Home from './components/sections/home/home';
import Projects from './components/sections/projects/projects';
import Contact from './components/sections/contact/contact';

export default class App extends React.Component {
  render() {
    return (
      <div className="App" key={'App-section'}>
          <Home key={'Home-section'} />
          <Projects key={'Projects-section'} />
          <Contact key={'Contact-section'} />
      </div>
    );
  }
}