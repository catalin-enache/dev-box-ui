import React from 'react';
import {
  List,
  themeAware
} from 'dev-box-ui';

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
