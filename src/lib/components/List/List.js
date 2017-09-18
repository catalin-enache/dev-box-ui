import React from 'react';
import PropTypes from 'prop-types';
import color from 'color';
import themeAware from '../../HOC/themeAware';

const style = ({ vars }) => {
  return {
    list: {
      // color: color(vars.colors.secondaryTextColor || 'orange').lighten(0.5).hex()
      color: vars.dir === 'ltr' ? 'green' : 'red'
    }
  };
};

class List extends React.Component {
  render() {
    return (
      <ul className={this.props.classes.list}>
        {this.props.items.map(item => <li key={item}>{item}</li>)}
      </ul>
    );
  }
}

List.defaultProps = {
  items: []
};

List.propTypes = {
  items: PropTypes.array,
  classes: PropTypes.object
};

export default themeAware({ style })(List);
