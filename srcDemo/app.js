import React from 'react';
import PropTypes from 'prop-types';
import screens from './screens';

class IFrameScreen extends React.Component {
  render() {
    const isProd = window.location.pathname.includes('.prod.');
    const windowLocationHash = window.location.hash.replace('#', '');
    return (
      <iframe
        onLoad={(evt) => console.log('iframe loaded')}
        src={`srcDemo/screensWebComponents/${windowLocationHash}?production=${isProd ? '1' : '0'}`} />
    );
  }
}

class App extends React.Component {
  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
  }

  onHashChange() {
    this.forceUpdate();
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering App component');
    }
    const screensKeys = Object.keys(screens);
    const links = <ul>
      {
        screensKeys.map((screen, idx) => (
          <li key={idx}>
            <a key={idx} href={`#${screen}`}>{screen}</a>
          </li>
        ))
      }
    </ul>;

    const windowLocationHash = (window.location.hash || `#${screensKeys[0]}`).replace('#', '');
    const Screen = windowLocationHash.endsWith('.html') ? IFrameScreen : screens[windowLocationHash];

    if (!Screen) {
      return null;
    }

    return (
      <div className="demo-wrapper">
        <div className="demo-links">
          {links}
        </div>
        <div className="demo-area">
          <Screen/>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object,
  theme: PropTypes.object
};

export default App;
