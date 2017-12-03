import React from 'react';
import {
  List
} from 'dev-box-ui';

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

export default ListScreen;
