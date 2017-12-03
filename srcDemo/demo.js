import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  // onScreenConsole,
  localeAware
} from 'dev-box-ui';
import App from './app';

// import getDBUWebComponent from '../build/src/lib/webcomponents/DBUWebComponent/DBUWebComponent';
// import getDBUWebComponentParent from '../build/src/lib/webcomponents/DBUWebComponentParent/DBUWebComponentParent';
import getDBUWebComponent from '../src/lib/webcomponents/DBUWebComponent/DBUWebComponent';
import getDBUWebComponentParent from '../src/lib/webcomponents/DBUWebComponentParent/DBUWebComponentParent';

const DBUWebComponent = getDBUWebComponent(window);
const DBUWebComponentParent = getDBUWebComponentParent(window);

DBUWebComponent.componentStyle += `
  b {
    color: orange;
    font-style: oblique;
  }
`;

setTimeout(() => {
  DBUWebComponent.registerSelf();
  DBUWebComponentParent.registerSelf();
}, 2000);

const iframe = document.createElement('iframe');

window.onmessage = function (msg) { console.log('msg from iframe', msg); };
iframe.onload = function (evt) {
  const target = evt.target;

  target.contentWindow.document.write(`
    <html>
    <body>
      <dbu-web-component
        style="color: blue"
      >
        <span>hello world 3</span>
      </dbu-web-component>
      <dbu-web-component-parent></dbu-web-component-parent>
    </body>
    <script>
      window.onmessage = function (msg) {
        console.log('msg from window', msg);
        window.top.postMessage('world', '*');
      };
    </script>
    </html>
  `);
  target.contentWindow.postMessage('hello', '*')

  const DBUWebComponent2 = getDBUWebComponent(target.contentWindow);
  const DBUWebComponentParent2 = getDBUWebComponentParent(target.contentWindow);
  setTimeout(() => {
    DBUWebComponent2.registerSelf();
    DBUWebComponentParent2.registerSelf();

    setTimeout(() => {
      // target.remove();
    }, 2000);
  }, 2000);
};

document.body.appendChild(iframe);


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
