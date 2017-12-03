'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _FormInput = require('../FormInput/FormInput');

var _FormInput2 = _interopRequireDefault(_FormInput);

var _formatters = require('../../utils/formatters');

var _formatters2 = _interopRequireDefault(_formatters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

class FormInputNumber extends _react2.default.PureComponent {
  constructor(props) {
    super(props);
    const { value, defaultDecPoint, defaultThousandsSeparator } = props;
    this.state = {
      value: value.toString()
    };

    this.defaultDecPoint = defaultDecPoint;
    this.defaultThousandsSeparator = defaultThousandsSeparator;
    this.numberFormatter = _formatters2.default.numberFormatter({
      decPoint: defaultDecPoint,
      thousandsSeparator: defaultThousandsSeparator
    });
    this.forceFloat = _formatters2.default.forceFloat({
      decPoint: defaultDecPoint
    });

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const receivedValue = nextProps.value.toString();
    const internalValue = this.state.value;
    const internalValueNumber = internalValue.replace(this.defaultDecPoint, '.');
    let valueToStore = Number(internalValueNumber) === Number(receivedValue) ? internalValue : receivedValue;

    if (['-', '+'].includes(internalValue) && receivedValue === '0') {
      valueToStore = internalValue;
    }

    this.setState({
      value: valueToStore
    });
  }

  handleChange(value) {
    const valueToUse = this.forceFloat(value);

    this.setState({
      value: valueToUse
    }, () => {
      this.forceUpdate(); // reason: 123.4 => 1234 / 12.3.4 => 1234(no re-render)

      const usedValue = this.state.value;
      let valueToReport = usedValue.replace(this.defaultDecPoint, '.');

      if (['-', '+'].includes(valueToReport)) {
        valueToReport = '0';
      }

      const valueAsNumber = Number(valueToReport);

      this.props.onChange(valueAsNumber);
    });
  }

  get value() {
    return this.numberFormatter(this.state.value);
  }

  render() {
    const _props = this.props,
          { defaultDecPoint, defaultThousandsSeparator } = _props,
          rest = _objectWithoutProperties(_props, ['defaultDecPoint', 'defaultThousandsSeparator']);
    return _react2.default.createElement(_FormInput2.default, _extends({}, rest, {
      'data-component-id': 'FormInputNumber',
      type: 'text',
      value: this.value,
      onChange: this.handleChange
    }));
  }
}

FormInputNumber.defaultProps = {
  value: 0,
  onChange: () => {},
  defaultDecPoint: '.',
  defaultThousandsSeparator: ''
};

FormInputNumber.propTypes = {
  value: _propTypes2.default.number,
  onChange: _propTypes2.default.func,
  defaultDecPoint: _propTypes2.default.string,
  defaultThousandsSeparator: _propTypes2.default.string
};

exports.default = FormInputNumber;