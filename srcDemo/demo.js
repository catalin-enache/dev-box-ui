import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  // onScreenConsole,
  localeAware
} from 'dev-box-ui';
import App from './app';
// defines some helpers on window (reusing code needed in iFrames)
import './internals/iFrameUtils/onWindowDefinedHelpers';

// import getDBUWebComponentDummy from '../build/src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy';
// import getDBUWebComponentDummyParent from '../build/src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent';
import dbuWebComponentsSetUp from '../src/lib/webcomponents/DBUWebComponentsSetup/DBUWebComponentsSetup';
import getDBUWebComponentDummy from '../src/lib/webcomponents/DBUWebComponentDummy/DBUWebComponentDummy';
import getDBUWebComponentDummyParent from '../src/lib/webcomponents/DBUWebComponentDummyParent/DBUWebComponentDummyParent';

dbuWebComponentsSetUp(window).appendStyle('dbu-web-component-dummy', `
  b {
    color: deepskyblue;
    font-style: oblique;
  }
`);

const DBUWebComponentDummy = getDBUWebComponentDummy(window);
const DBUWebComponentDummyParent = getDBUWebComponentDummyParent(window);


setTimeout(() => {
  DBUWebComponentDummy.registerSelf();
  DBUWebComponentDummyParent.registerSelf();
}, 2000);

const iframe = document.createElement('iframe');

window.onmessage = function (msg) { console.log('msg from iframe', msg); };
iframe.onload = function (evt) {
  const target = evt.target;

  target.contentWindow.document.write(`
    <html>
    <body>
      <dbu-web-component-dummy
        style="color: blue"
      >
        <span>hello world 3</span>
      </dbu-web-component-dummy>
      <dbu-web-component-dummy-parent></dbu-web-component-dummy-parent>
    </body>
    <script>
      window.onmessage = function (msg) {
        console.log('msg from window', msg);
        window.top.postMessage('world', '*');
      };
    </script>
    </html>
  `);
  target.contentWindow.postMessage('hello', '*');

  dbuWebComponentsSetUp(target.contentWindow).appendStyle('dbu-web-component-dummy', `
    b {
      font-style: oblique;
      opacity: 0.5;
    }
  `);
  const DBUWebComponentDummy2 = getDBUWebComponentDummy(target.contentWindow);
  const DBUWebComponentDummyParent2 = getDBUWebComponentDummyParent(target.contentWindow);
  setTimeout(() => {
    DBUWebComponentDummy2.registerSelf();
    DBUWebComponentDummyParent2.registerSelf();

    setTimeout(() => {
      // target.remove();
    }, 2000);
  }, 2000);
};

// document.body.appendChild(iframe);


// onScreenConsole({ options: { showLastOnly: false } });

let Demo = class Demo extends React.Component {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Demo component');
    }
    const { locale: { dir } } = this.props;
    return (
      <App />
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
