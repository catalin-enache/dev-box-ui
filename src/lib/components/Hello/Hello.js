
import React from 'react';
import PropTypes from 'prop-types';
import List from '../List/List';
import themeAware from '../../HOC/themeAware';
import FaSpinner from 'react-icons/lib/fa/spinner';
import { getCommonStyles } from "../../../styles/commonStyles";

const styles = (theme) => ({
  ...getCommonStyles(),
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
                    <FaSpinner className={this.props.classes.faSpin} />
                    <List items={['one', 'two']}/>
                </div>
        );
    }
}

Hello.propTypes = {
    name: PropTypes.string.isRequired,
    classes: PropTypes.object
};

export default themeAware({ styles })(Hello);

