
import React from 'react';
import PropTypes from 'prop-types';

export default class List extends React.Component {
    render() {
        return (
            <ul>
                {this.props.items.map((item) => <li key={item}>{ item }</li>)}
            </ul>
        );
    }
}

List.defaultProps = {
  items: []
};

List.propTypes = {
  items: PropTypes.array
};