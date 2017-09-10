import React from 'react';
import themeAware from '../src/lib/HOC/themeAware';
import screens from './screens';

const style = ({ vars }) => {
  return {
    sectionLinks: {
      color: vars.colors.primaryTextColor || 'orange'
    }
  };
};

class App extends React.Component {
  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
  }

  onHashChange() {
    this.forceUpdate();
  }

  render() {
    const screensKeys = Object.keys(screens);
    const links = screensKeys
      .map((screen, idx) => <a key={idx} href={`#${screen}`}>{screen}</a>);
    const Screen = screens[(window.location.hash || `#${screensKeys[0]}`).replace('#', '')];

    return (
      <div>
        <div>
          {links}
        </div>
        <div>
          <Screen/>
        </div>
      </div>
    );
  }
}

export default themeAware({ style })(App);
