
import React from 'react';
import PropTypes from 'prop-types';
import color from 'color';
import themeAware from '../../HOC/themeAware';

const styles = (theme) => {
    console.log('theme received in List styles', theme);
    return {
      list: {
        color: color(theme.secondaryTextColor || 'orange').lighten(0.5).hex()
      }
    };
};


class List extends React.Component {
    render() {
        if (process.env.NODE_ENV !== 'production') {
            console.log('rendering List component');
        }
        return (
            <ul className={this.props.classes.list}>
                {this.props.items.map((item) => <li key={item}>{ item }</li>)}
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

export default themeAware({ styles })(List);