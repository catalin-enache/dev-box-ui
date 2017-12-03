'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

class FormInput extends _react2.default.PureComponent {
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
    const _props = this.props,
          { hasWarning, hasError } = _props,
          rest = _objectWithoutProperties(_props, ['hasWarning', 'hasError']);
    const inputClassNames = (0, _classnames2.default)({
      'dbu-form-input': true,
      'dbu-warning': hasWarning,
      'dbu-error': hasError,
      'dbu-theme': true,
      'dbu-patch': true
    });
    return _react2.default.createElement('input', _extends({
      'data-component-id': 'FormInput',
      className: inputClassNames
    }, rest, {
      value: this.state.value,
      onChange: this.handleChange,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur
    }));
  }
}

FormInput.defaultProps = {
  type: 'text',
  value: '',
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

FormInput.propTypes = {
  type: _propTypes2.default.string,
  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  onChange: _propTypes2.default.func,
  onFocus: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,
  hasWarning: _propTypes2.default.bool,
  hasError: _propTypes2.default.bool
};

exports.default = FormInput;