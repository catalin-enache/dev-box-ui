import React from 'react';
import PropTypes from 'prop-types';
import List from '../List/List';
import themeAware from '../../HOC/themeAware';

const style = ({ vars }) => {
  return {
    world: {
      color: vars.colors.primaryColor || 'orange'
    }
  };
};

class World extends React.PureComponent {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Hello component');
    }
    return (
      <div className={this.props.classes.hello}>
        World ------------
        <List items={['five', 'six']}/>
        <List items={['five', 'six']}/>
        ------------------
      </div>
    );
  }
}

World.propTypes = {
  classes: PropTypes.object
};

export default themeAware({ style })(World);

