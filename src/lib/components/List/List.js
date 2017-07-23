
import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import color from 'color';
import withThemeWrapper from '../../HOC/withThemeWrapper';

const styles = (theme) => ({
  list: {
    color: color(theme.secondaryTextColor || 'orange').lighten(0.5).hex()
  }
});


class List extends React.Component {
    render() {
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

export default withThemeWrapper({})(injectSheet(styles)(List));