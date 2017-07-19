
import React from 'react';
import PropTypes from 'prop-types';
import List from 'lib/List/List';

export default class Hello extends React.Component {
    render() {
        return (
            <div>
                Hello {this.props.name}
                <List items={['one', 'two']}/>
            </div>
        );
    }
}

Hello.propTypes = {
  name: PropTypes.string.isRequired
};