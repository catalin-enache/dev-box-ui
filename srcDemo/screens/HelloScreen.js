import React from 'react';
import {
  Hello
} from 'dev-box-ui';
import themeAware from '../../src/lib/HOC/themeAware';

const style = ({ vars }) => {
  return {
    screen: {
      color: vars.colors.primaryTextColor || 'orange'
    }
  };
};

class HelloScreen extends React.Component {
  render() {
    return (
      <div>
        <Hello/>
        <Hello/>
        <Hello/>
      </div>
    );
  }
}

export default themeAware({ style })(HelloScreen);
