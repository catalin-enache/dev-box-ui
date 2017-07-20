
import React from 'react';
import PropTypes from 'prop-types';
import List from '../List/List';

export default class Hello extends React.Component {
    render() {
        if (process.env.NODE_ENV !== 'production') {
            console.log('rendering Hello component');
        }
        return (
            <div>
                Hello {this.props.name || 'Nobody'}
                <List items={['one', 'two']}/>
            </div>
        );
    }
}

Hello.propTypes = {
  name: PropTypes.string.isRequired
};