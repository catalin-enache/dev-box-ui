import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

class FormInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value.toString()
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: (nextProps.value || '').toString()
    });
  }

  handleChange(evt) {
    const { value } = evt.target;
    this.setState({
      value
    }, () => {
      this.props.onChange(value);
    });
  }

  handleFocus() {
    this.props.onFocus(this.state.value);
  }

  handleBlur() {
    this.props.onBlur(this.state.value);
  }

  render() {
    const { hasWarning, hasError, ...rest } = this.props;
    const inputClassNames = cn({
      'dbu-form-input': true,
      'dbu-warning': hasWarning,
      'dbu-error': hasError,
      'dbu-theme': true,
      'dbu-patch': true
    });
    return (
      <input
        data-component-id="FormInput"
        className={inputClassNames}
        {...rest}
        value={this.state.value}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      />
    );
  }
}

FormInput.defaultProps = {
  type: 'text',
  value: '',
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
};

FormInput.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  hasWarning: PropTypes.bool,
  hasError: PropTypes.bool,
};

export default FormInput;

