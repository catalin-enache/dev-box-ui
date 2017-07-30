
import React from 'react';
import PropTypes from 'prop-types';
import List from '../List/List';
import injectSheet from 'react-jss';
import withThemeWrapper from '../../HOC/withThemeWrapper';
import FaSpinner from 'react-icons/lib/fa/spinner';

const styles = (theme) => ({
  hello: {
    color: theme.primaryTextColor || 'orange'
  },

  '@keyframes fa-spin': {
    '0%': {
        transform: 'rotate(0deg)'
    },

    '100%': {
        transform: 'rotate(359deg)'
    }
  },

  faSpin: {
    animation: 'fa-spin 2s infinite linear',
    animationName: 'fa-spin',
    animationDuration: '2s',
    animationTimingFunction: 'linear',
    animationDelay: 'initial',
    animationIterationCount: 'infinite',
    animationDirection: 'initial',
    animationFillMode: 'initial',
    animationPlayState: 'initial'
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
                    <FaSpinner className={this.props.classes.faSpin} size={24} color='indianred' />
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

