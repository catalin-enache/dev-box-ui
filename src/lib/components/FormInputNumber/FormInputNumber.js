import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
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
    const {
      theme, classes,
      inputExtraClasses = [],
      wrapperExtraClasses = [],
      name
    } = this.props;

    const wrapperClassNames = cn({
      ...wrapperExtraClasses.reduce((acc, name) => ({ ...acc, [name]: true }), {})
    });

    const inputClassNames = cn({
      [theme.common.formInput]: true,
      ...inputExtraClasses.reduce((acc, name) => ({ ...acc, [name]: true }), {})
    });

    return (
      <div className={ wrapperClassNames }>
        <input className={ inputClassNames }
          name={name}
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

FormInputNumber.propTypes = {
  value: PropTypes.string,
  theme: PropTypes.object,
  name: PropTypes.string.isRequired,
  classes: PropTypes.object,
  inputExtraClasses: PropTypes.arrayOf(PropTypes.string),
  wrapperExtraClasses: PropTypes.arrayOf(PropTypes.string),
};

export default themeAware({ style })(localeAware(FormInputNumber));

