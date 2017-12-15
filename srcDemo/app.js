import React from 'react';
import GoMarkGithub from 'react-icons/lib/go/mark-github';
import GoThreeBars from 'react-icons/lib/go/three-bars';
import { screens, screenLinkNames } from './screens';
import IFrameScreen from './internals/components/IFrameScreen';
import {
  highlightBlock,
  toggleAppDir
} from './internals/utils';

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

  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering App component');
    }

    const screensKeys = Object.keys(screens);
    const windowLocationHash = (window.location.hash || `#${screensKeys[0]}`).replace('#', '');

    const links = <ul>{
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

    const Screen = windowLocationHash.endsWith('.html') ? IFrameScreen : (screens[windowLocationHash] || 'div');

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
              <a href="#" onClick={toggleAppDir}>Toggle Locale Dir</a>
            </div>
            <hr />
            {links}
            <hr />
            {links}
            <hr />
            {links}
            <hr />
            {links}
            <hr />
            {links}
            <hr />
            {links}
            <hr />
            {links}
            <hr />
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
