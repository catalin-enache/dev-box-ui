import React from 'react';
import {
  distributionURL
} from '../../internals/constants';

class UsingDevBoxUI extends React.Component {
  render() {
    return (
      <div className="demo-screen"> { /* standard template requirement */ }
        <h2 className="title">Loading Dev Box UI Web Components</h2>
        <h3 className="section">From Distribution</h3>
        <pre><code className="html">
          {`
<!doctype html>
<html dir="ltr" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <script src="${distributionURL}"></script>
  <script>
    const {
      quickSetupAndLoad
    } = require('dev-box-ui-webcomponents');
    const {
      'dbui-web-component-dummy-parent': dbuiWebComponentDummyParentClass,
    } = quickSetupAndLoad(window)([
      {
        registrationName: 'dbui-web-component-dummy',
        componentStyle: \`
         b {
           color: var(--dummy-b-color, inherit);
           border-radius: var(--dummy-b-border-radius, 0px);
           background-color: var(--dummy-b-bg-color, transparent);
         }
        \`
      },
      {
        registrationName: 'dbui-web-component-dummy-parent'
      }
    ]);
  </script>
</head>
<body>
<dbui-web-component-dummy-parent>hello 1</dbui-web-component-dummy-parent>
</body>
</html>

          `}
        </code></pre>
      </div>
    );
  }
}

export default UsingDevBoxUI;
