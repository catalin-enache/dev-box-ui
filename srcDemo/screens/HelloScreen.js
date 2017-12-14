import React from 'react';
import {
  Hello
} from 'dev-box-ui';

class HelloScreen extends React.Component {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering HelloScreen component');
    }
    return (
      <div className="demo-screen">
        <Hello />
      </div>
    );
  }
}

export default HelloScreen;
