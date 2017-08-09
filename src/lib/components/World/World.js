
import React from 'react';
import PropTypes from 'prop-types';
import List from '../List/List';
import themeAware from '../../HOC/themeAware';
import FaSpinner from 'react-icons/lib/fa/spinner';

const style = (theme) => {
    return {
      world: {
        color: theme.primaryTextColor || 'orange'
      }
    };
};

class World extends React.Component {
    render() {
        if (process.env.NODE_ENV !== 'production') {
            console.log('rendering Hello component');
        }
        return (
                <div className={this.props.classes.hello}>
                    World ------------
                    <List items={['five', 'six']} />
                    <List items={['five', 'six']} />
                    ------------------
                </div>
        );
    }
}

World.propTypes = {
    classes: PropTypes.object
};

export default themeAware({ style })(World);

