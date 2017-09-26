import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { themeAware } from 'dev-box-ui';
import screens from './screens';

const style = ({ vars }) => {
  return {
    sectionLinks: {
      float: 'left'
    },
    sectionScreen: {
      float: 'left'
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
    const {
      classes: {
        sectionLinks, sectionScreen
      },
      theme: {
        common: {
          row, col, m3, m9, l6, xl3, xl9, xs3, xs9, s6
        }
      } } = this.props;


    if (!Screen) {
      return null;
    }

    return (
      <div className={cn({
        [row]: true
      })}>
        <div className={cn({
          [col]: true,
          [m3]: true,
          [l6]: true,
          [xl9]: true,
          [xs9]: true,
          [s6]: true,
        })}>
          {links}
        </div>
        <div className={cn({
          [col]: true,
          [m9]: true,
          [l6]: true,
          [xl3]: true,
          [xs3]: true,
          [s6]: true,
        })}>
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

export default themeAware({ style })(App);
