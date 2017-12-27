import React from 'react';
import GoMarkGithub from 'react-icons/lib/go/mark-github';
import GoThreeBars from 'react-icons/lib/go/three-bars';
import { screens, screenLinksGen } from './screens';
import IFrameScreen from './internals/reactComponents/IFrameScreen';
import {
  toggleAppDir
} from './internals/appUtils';

class App extends React.Component {
  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
    // re-using the helper defined for iFrame
    window.makeTabs();
    window.highlightBlocks();
  }

  onHashChange() {
    this.forceUpdate();
  }

  componentDidUpdate() {
    window.makeTabs();
    window.highlightBlocks();
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering App component');
    }

    const screensKeys = Object.keys(screens);
    const windowLocationHash = (window.location.hash || `#${screensKeys[0]}`).replace('#', '');

    const links = screenLinksGen.map((section, idx) => {
      return (
        <div key={idx}>
          <div className="links-section-group">{section.title}</div>
          <ul>
            {
              section.links.map((link, idx) => {
                const isActive = link.path === windowLocationHash ? 'active' : undefined;
                return (
                  <li key={idx} x-active={isActive}>
                    <a href={`#${link.path}`}>{link.title}</a>
                  </li>
                );
              })
            }
          </ul>
        </div>
      );
    });

    const Screen = windowLocationHash.endsWith('.html') ? IFrameScreen : (screens[windowLocationHash] || 'div');

    return (
      <div>
        <div className="page-header">
          <h2>DEV BOX UI</h2><a
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
              <a href="#" onClick={toggleAppDir}>TOGGLE LOCALE DIR</a>
            </div>
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
