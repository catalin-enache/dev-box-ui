import React from 'react';
import PropTypes from 'prop-types';
import List from '../List/List';
import World from '../World/World';
import themeAware from '../../HOC/themeAware';
import FaSpinner from 'react-icons/lib/fa/spinner';

const style = (theme) => {
  return {
    hello: {
      color: theme.primaryTextColor || 'orange'
    }
  };
};

class Hello extends React.Component {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      console.log('rendering Hello component');
    }
    return (
      <div className={this.props.classes.hello}>
        Hello {this.props.name || 'Nobody'}
        <FaSpinner className={this.props.classes.faSpin}/>
        <List items={['one', 'two']}/>
        <List items={['one', 'two']}/>
        <World/>
        <World/>
      </div>
    );
  }
}

Hello.propTypes = {
  name: PropTypes.string.isRequired,
  classes: PropTypes.object
};

export default themeAware({style})(Hello);

