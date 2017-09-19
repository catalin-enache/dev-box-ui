import React from 'react';
import PropTypes from 'prop-types';
import FaSpinner from 'react-icons/lib/fa/spinner';
import List from '../List/List';
import World from '../World/World';
import themeAware from '../../HOC/themeAware';


const style = ({ vars }) => {
  return {
    hello: {
      color: vars.colors.primaryTextColor || 'orange'
    }
  };
};

class Hello extends React.Component {
  render() {
    const { theme } = this.props;
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Hello component', theme);
    }
    return (
      <div className={ this.props.classes.hello }>
        Hello { this.props.name || 'Nobody' }
        <FaSpinner className={ theme.animations.dbuAnimationSpin }/>
        <List items={ ['one', 'two'] }/>
        <List items={ ['one', 'two'] }/>
        <World/>
        <World/>
      </div>
    );
  }
}

Hello.propTypes = {
  theme: PropTypes.object,
  name: PropTypes.string.isRequired,
  classes: PropTypes.object
};

export default themeAware({ style })(Hello);

