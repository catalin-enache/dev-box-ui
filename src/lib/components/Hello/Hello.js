
import React from 'react';
import PropTypes from 'prop-types';
import List from '../List/List';
import injectSheet from 'react-jss';

const styles = (theme) => ({
  hello: {
    color: theme.primaryTextColor || 'orange'
  }
});

class Hello extends React.Component {
    render() {
        if (process.env.NODE_ENV !== 'production') {
            console.log('rendering Hello component');
        }
        return (
                <div className={this.props.classes.hello}>
                    Hello {this.props.name || 'Nobody'}
                    <List items={['one', 'two']}/>
                </div>
        );
    }
}

Hello.propTypes = {
    name: PropTypes.string.isRequired,
    classes: PropTypes.object
};

export default injectSheet(styles)(Hello);

