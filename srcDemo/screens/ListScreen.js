import React from 'react';
import {
  List
} from 'dev-box-ui';
import themeAware from '../../src/lib/HOC/themeAware';

const style = ({ vars }) => {
  return {
    screen: {
      color: vars.colors.primaryTextColor || 'orange'
    }
  };
};

class ListScreen extends React.Component {
  render() {
    return (
      <div>
        <List items={['three', 'four']}/>
        <List items={['three', 'four']}/>
      </div>
    );
  }
}

export default themeAware({ style })(ListScreen);
