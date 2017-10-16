import React from 'react';
import PropTypes from 'prop-types';
import themeAware from '../../HOC/themeAware';
import localeAware from '../../HOC/localeAware';

const style = ({ vars }) => {
  return {
    hello: {
      color: vars.colors.primaryColor || 'orange'
    }
  };
};

class FormInputNumber extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || 0
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.setState({
      value: evt.target.value
    });
  }

  render() {
    const { theme, classes, name } = this.props;
    console.log('FormInputNumber', { theme });
    return (
      <div>
        <input className={ theme.common.formInput } name={name} type="text" value={this.state.value} onChange={this.handleChange} />
      </div>
    );
  }
}

FormInputNumber.propTypes = {
  value: PropTypes.string,
  theme: PropTypes.object,
  name: PropTypes.string.isRequired,
  classes: PropTypes.object
};

export default themeAware({ style })(localeAware(FormInputNumber));

