
import React from 'react';
import PropTypes from 'prop-types';
import List from '../List/List';
import injectSheet from 'react-jss';
import withThemeWrapper from '../../HOC/withThemeWrapper';
import FaBeer from 'react-icons/lib/fa/beer';

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
                    <FaBeer size={24} color='indianred' />
                    <List items={['one', 'two']}/>
                </div>
        );
    }
}

Hello.propTypes = {
    name: PropTypes.string.isRequired,
    classes: PropTypes.object
};

export default withThemeWrapper({})(injectSheet(styles)(Hello));

