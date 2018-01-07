import React from 'react';
import {
  List
} from 'dev-box-ui-react-components';

class ListScreen extends React.Component {
  render() {
    return (
      <div className="demo-screen"> { /* standard template requirement */ }
        <List items={['three', 'four']}/>
        <List items={['three', 'four']}/>
      </div>
    );
  }
}

export default ListScreen;
