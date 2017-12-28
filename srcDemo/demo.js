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

// import getDBUIWebComponentDummy from '../build/src/lib/webcomponents/DBUIWebComponentDummy/DBUIWebComponentDummy';
// import getDBUIWebComponentDummyParent from '../build/src/lib/webcomponents/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent';
import dbuiWebComponentsSetUp from '../src/lib/webcomponents/DBUIWebComponentsSetup/DBUIWebComponentsSetup';
import getDBUIWebComponentDummy from '../src/lib/webcomponents/DBUIWebComponentDummy/DBUIWebComponentDummy';
import getDBUIWebComponentDummyParent from '../src/lib/webcomponents/DBUIWebComponentDummyParent/DBUIWebComponentDummyParent';

dbuiWebComponentsSetUp(window).appendStyle('dbui-web-component-dummy', `
  b {
    color: deepskyblue;
    font-style: oblique;
  }
`);

const DBUIWebComponentDummy = getDBUIWebComponentDummy(window);
const DBUIWebComponentDummyParent = getDBUIWebComponentDummyParent(window);


setTimeout(() => {
  DBUIWebComponentDummy.registerSelf();
  DBUIWebComponentDummyParent.registerSelf();
}, 2000);

const iframe = document.createElement('iframe');

window.onmessage = function (msg) { console.log('msg from iframe', msg); };
iframe.onload = function (evt) {
  const target = evt.target;

  target.contentWindow.document.write(`
    <html>
    <body>
      <dbui-web-component-dummy
        style="color: blue"
      >
        <span>hello world 3</span>
      </dbui-web-component-dummy>
      <dbui-web-component-dummy-parent></dbui-web-component-dummy-parent>
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

  dbuiWebComponentsSetUp(target.contentWindow).appendStyle('dbui-web-component-dummy', `
    b {
      font-style: oblique;
      opacity: 0.5;
    }
  `);
  const DBUIWebComponentDummy2 = getDBUIWebComponentDummy(target.contentWindow);
  const DBUIWebComponentDummyParent2 = getDBUIWebComponentDummyParent(target.contentWindow);
  setTimeout(() => {
    DBUIWebComponentDummy2.registerSelf();
    DBUIWebComponentDummyParent2.registerSelf();

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
