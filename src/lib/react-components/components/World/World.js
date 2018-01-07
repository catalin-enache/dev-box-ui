import React from 'react';
// import PropTypes from 'prop-types';
import List from '../List/List';

class World extends React.PureComponent {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Hello component');
    }
    return (
      <div>
        World ------------
        <List items={['five', 'six']}/>
        <List items={['five', 'six']}/>
        ------------------
      </div>
    );
  }
}

World.propTypes = {
};

export default World;

