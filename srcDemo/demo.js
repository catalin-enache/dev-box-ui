import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  onScreenConsole,
  registerLocaleChange,
  localeAware,
  theming,
  defaultTheme
} from 'dev-box-ui';
import App from './app';

// onScreenConsole({ buttonStyle: { }, consoleStyle: { }, options: { rtl: false } });
// for (let i = 0; i < 100; i += 1) {
//   console.log('foo', 'bar', 5, null, undefined, new Map([[2, 7]]), new Set([4, 5]), [8,9,10],  function(){console.log('bla')}, { a: { b: { c: [1, function(){console.log('inline')}] } } });
// }
// console.warn('warning');
// console.error('error');

const { ThemeProvider } = theming;


// const customTheme = {
//   ...defaultTheme,
//   ltr: {
//     ...defaultTheme.ltr,
//     vars: {
//       ...defaultTheme.ltr.vars,
//       colors: {
//         primaryTextColor: 'brown',
//         secondaryTextColor: 'green',
//       }
//     }
//   },
//   rtl: {
//     ...defaultTheme.rtl,
//     vars: {
//       ...defaultTheme.ltr.vars,
//       colors: {
//         primaryTextColor: 'brown',
//         secondaryTextColor: 'green',
//       }
//     }
//   }
// };

let Demo = class Demo extends React.Component {
  render() {
    const { locale: { dir } } = this.props;
    return (
      <ThemeProvider theme={defaultTheme[dir]}>
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
