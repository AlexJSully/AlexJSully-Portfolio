import React from 'react';
import './App.css';
import Home from './components/sections/home/home';
import Projects from './components/sections/projects/projects';
import Contact from './components/sections/contact/contact';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
          <Home />
          <Projects />
          <Contact />
      </div>
    );
  }
}