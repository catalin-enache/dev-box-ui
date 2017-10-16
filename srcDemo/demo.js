import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  // onScreenConsole,
  localeAware,
  theming,
  theme,
  themeVars
} from 'dev-box-ui';
import App from './app';

const currentTheme = theme(themeVars);

// onScreenConsole();

const { ThemeProvider } = theming;

let Demo = class Demo extends React.Component {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Demo component');
    }
    const { locale: { dir } } = this.props;
    return (
      <ThemeProvider theme={currentTheme[dir]}>
        <App />
      </ThemeProvider>
    );
  }
};

Demo.propTypes = {
  locale: PropTypes.object
};

Demo = localeAware(Demo);

ReactDOM.render((
  <Demo/>
), document.getElementById('demo'));
