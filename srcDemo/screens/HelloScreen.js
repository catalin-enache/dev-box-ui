import React from 'react';
import {
  Hello,
  themeAware
} from 'dev-box-ui';

const style = ({ vars }) => {
  return {
    screen: {
      color: vars.colors.primaryTextColor || 'orange'
    }
  };
};

class HelloScreen extends React.Component {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering HelloScreen component');
    }
    return (
      <div>
        <Hello/>
      </div>
    );
  }
}

export default themeAware({ style })(HelloScreen);
