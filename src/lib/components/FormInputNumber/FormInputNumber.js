import React from 'react';
import PropTypes from 'prop-types';
import FormInput from '../FormInput/FormInput';
import formatters from '../../utils/formatters';

class FormInputNumber extends React.PureComponent {
  constructor(props) {
    super(props);
    const { value, defaultDecPoint, defaultThousandsSeparator } = props;
    this.state = {
      value: value.toString()
    };

    this.defaultDecPoint = defaultDecPoint;
    this.defaultThousandsSeparator = defaultThousandsSeparator;
    this.numberFormatter = formatters.numberFormatter({
      decPoint: defaultDecPoint,
      thousandsSeparator: defaultThousandsSeparator
    });
    this.forceFloat = formatters.forceFloat({
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
    const { defaultDecPoint, defaultThousandsSeparator, ...rest } = this.props;
    return (
      <FormInput
        {...rest}
        data-component-id="FormInputNumber"
        type="text"
        value={this.value}
        onChange={this.handleChange}
      />
    );
  }
}

FormInputNumber.defaultProps = {
  value: 0,
  onChange: () => {},
  defaultDecPoint: '.',
  defaultThousandsSeparator: ''
};

FormInputNumber.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  defaultDecPoint: PropTypes.string,
  defaultThousandsSeparator: PropTypes.string
};

export default FormInputNumber;

