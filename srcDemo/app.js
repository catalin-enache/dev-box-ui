import React from 'react';
import PropTypes from 'prop-types';
import { screens, screenLinkNames } from './screens';
import localeAware from '../src/lib/HOC/localeAware';

let IFrameScreen = class IFrameScreen extends React.Component {
  constructor(props) {
    super(props);
    this.iframeNode = null;
  }

  componentWillReceiveProps(nextProps) {
    const { locale: { dir } } = nextProps;
    this.iframeNode.contentWindow.postMessage(`changeDir ${dir}`, '*');
  }

  render() {
    const isProd = !window.location.pathname.includes('.dev.');
    const windowLocationHash = window.location.hash.replace('#', '');
    return (
      <iframe
        ref={(node) => this.iframeNode = node}
        src={`srcDemo/screens/${windowLocationHash}?production=${isProd ? '1' : '0'}`} />
    );
  }
};
IFrameScreen.propTypes = {
  locale: PropTypes.shape({
    dir: PropTypes.string,
    lang: PropTypes.string
  })
};
IFrameScreen = localeAware(IFrameScreen);

class App extends React.Component {
  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
  }

  onHashChange() {
    this.forceUpdate();
  }

  toggleAppDir(evt) {
    evt.preventDefault();
    const documentElement = window.document.documentElement;
    const currentDir = documentElement.getAttribute('dir');
    const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    documentElement.setAttribute('dir', nextDir);
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
            <a key={idx} href={`#${screen}`}>{screenLinkNames[screen] || screen}</a>
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
          <div className="locale-dir-switch">
            <a href="#" onClick={this.toggleAppDir}>Toggle Locale Dir</a>
          </div>
          {links}
        </div>
        <div className="demo-area">
          <Screen/>
        </div>
      </div>
    );
  }
}

export default App;
