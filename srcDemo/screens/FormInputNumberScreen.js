import React from 'react';
import {
  FormInputNumber
} from 'dev-box-ui';


class FormInputNumberScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: -7.08
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(inputValue) {
    const valueToSendBack = Number(inputValue.toPrecision(16));
    this.setState({
      inputValue: valueToSendBack
    });
  }

  render() {
    return (
      <div>
        <FormInputNumber
          value={this.state.inputValue}
          onChange={this.handleChange}
          defaultDecPoint=","
          defaultThousandsSeparator="."
        />
        <FormInputNumber
          value={this.state.inputValue}
          onChange={this.handleChange}
        />
        <p>{this.state.inputValue}{'\u00A0'}</p>
      </div>
    );
  }
}

export default FormInputNumberScreen;
