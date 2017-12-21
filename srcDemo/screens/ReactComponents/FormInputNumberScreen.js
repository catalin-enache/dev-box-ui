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
      <div className="demo-screen"> { /* standard template requirement */ }
        <pre><code className="html">
          {`
            <p>form input number</p>
            <span>react</span>
          `}
        </code></pre>
        <pre><code className="javascript">
          {`
            class Machine extends SuperClass {
              constructor() {
                super();
              }

              onInit() {
                this.do(() => {
                  console.log(print);
                });
              }
            }
          `}
        </code></pre>
        <pre><code className="css">
          {`
            html[dir=ltr] {
              color: red;
            }
          `}
        </code></pre>
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
