import React from 'react';
import {
  FormInput
} from 'dev-box-ui-react-components';


class FormInputScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: 6
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(inputValue) {
    this.setState({
      inputValue
    });
  }

  render() {
    return (
      <div className="demo-screen"> { /* standard template requirement */ }
        <FormInput
          value={this.state.inputValue}
          onChange={this.handleChange}
          hasWarning={false}
          hasError={false}
          disabled={false}
        />
        <p>{this.state.inputValue}{'\u00A0'}</p>
      </div>
    );
  }
}

export default FormInputScreen;
