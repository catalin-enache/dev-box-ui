import React from 'react';
import PropTypes from 'prop-types';
import GoMarkGithub from 'react-icons/lib/go/mark-github';
import GoThreeBars from 'react-icons/lib/go/three-bars';
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

function highlightBlock() {
  [...document.querySelectorAll('pre code')].forEach((block) => {
    window.hljs && window.hljs.highlightBlock(block);
  });
}

class App extends React.Component {
  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
    highlightBlock();
  }

  onHashChange() {
    this.forceUpdate();
  }

  componentDidUpdate() {
    highlightBlock();
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
    const windowLocationHash = (window.location.hash || `#${screensKeys[0]}`).replace('#', '');

    const links = <ul>
      {
        screensKeys.map((screen, idx) => {
          const isActive = screen === windowLocationHash ? 'active' : undefined;
          return (
            <li key={idx} x-active={isActive}>
              <a key={idx} href={`#${screen}`}>{screenLinkNames[screen] || screen}</a>
            </li>
          );
        })
      }
    </ul>;

    const Screen = windowLocationHash.endsWith('.html') ? IFrameScreen : screens[windowLocationHash];

    if (!Screen) {
      return null;
    }

    return (
      <div>
        <div className="page-header">
          <h2>Dev Box UI</h2><a
            className="head-link"
            href="https://github.com/catalin-enache/dev-box-ui"
            rel="noopener noreferrer"
            target="_blank"><GoMarkGithub size={25} /></a>
        </div>
        <div className="demo-wrapper">
          <label id="links-toggle-label" htmlFor="links-toggle" className="head-link"><GoThreeBars size={25} /></label>
          <input id="links-toggle" type="checkbox" />
          <div className="demo-links" onClick={() => document.querySelector('#links-toggle').checked = false}>
            <div className="locale-dir-switch">
              <a href="#" onClick={this.toggleAppDir}>Toggle Locale Dir</a>
            </div>
            {links}
            {links}
            {links}
            {links}
            {links}
            {links}
            {links}
          </div>
          <div className="demo-area">
            <Screen/>
          </div>
        </div>
      </div>

    );
  }
}

export default App;
