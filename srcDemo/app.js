import React from 'react';
import PropTypes from 'prop-types';
import screens from './screens';

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
    const Screen = screens[(window.location.hash || `#${screensKeys[0]}`).replace('#', '')];

    if (!Screen) {
      return null;
    }

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

App.propTypes = {
  classes: PropTypes.object,
  theme: PropTypes.object
};

export default App;
