import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ReactTestUtils from 'react-dom/test-utils';
import { describe, it } from 'mocha';
import { expect } from 'chai';

import FormInputNumber from './FormInputNumber';

/* eslint react/no-find-dom-node: 0 */

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    const { initialValue } = props;
    this.state = {
      inputValue: initialValue
    };
    this.inputNode = null;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(val) {
    const { newValue } = this.props;
    expect(val).to.equal(newValue);
    expect(typeof val).to.equal('number');
    setTimeout(() => {
      this.props.done();
    }, 0);
  }

  componentDidMount() {
    const { expectedInitialValue, newValue, expectedNewValue } = this.props;
    const htmlNode =
      ReactTestUtils.findRenderedDOMComponentWithClass(this.inputNode, 'dbu-form-input');
    expect(htmlNode.value).to.equal(expectedInitialValue);

    this.setState({
      inputValue: newValue
    }, () => {
      expect(htmlNode.value).to.equal(expectedNewValue);
      ReactTestUtils.Simulate.change(htmlNode);
    });
  }

  render() {
    const { defaultDecPoint, defaultThousandsSeparator } = this.props;
    return (<FormInputNumber
      ref={(node) => this.inputNode = node}
      value={this.state.inputValue}
      onChange={this.handleChange}
      defaultDecPoint={defaultDecPoint}
      defaultThousandsSeparator={defaultThousandsSeparator}
    />);
  }
}

App.propTypes = {
  done: PropTypes.func,
  initialValue: PropTypes.number,
  expectedInitialValue: PropTypes.string,
  newValue: PropTypes.number,
  expectedNewValue: PropTypes.string,
  defaultDecPoint: PropTypes.string,
  defaultThousandsSeparator: PropTypes.string
};

class App2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.inputNode = null;
    this.simulatedChange = null;
    this.handleChange = this.handleChange.bind(this);
  }

  get htmlNode() {
    return ReactTestUtils.findRenderedDOMComponentWithClass(this.inputNode, 'dbu-form-input');
  }

  simulateChange(val) {
    const htmlNode = this.htmlNode;
    this.simulatedChange = val;
    htmlNode.value = val;
    ReactTestUtils.Simulate.change(htmlNode);
  }

  componentDidMount() {
    const { simulateChange1 } = this.props;
    this.simulateChange(simulateChange1);
  }

  handleChange(val) {
    const {
      simulateChange1,
      simulateChange2,
      expectedValue1String,
      expectedValue2String,
      expectedValue1Number,
      expectedValue2Number
    } = this.props;
    const nodeValue = this.htmlNode.value;

    if (!!simulateChange2 && this.simulatedChange === simulateChange1) {
      this.simulateChange(simulateChange2);
      expect(nodeValue).to.equal(expectedValue1String);
      expect(val).to.equal(expectedValue1Number);
    } else if (this.simulatedChange === simulateChange2) {
      expect(nodeValue).to.equal(expectedValue2String);
      expect(val).to.equal(expectedValue2Number);
      setTimeout(() => {
        this.props.done();
      }, 0);
    }
  }

  render() {
    return (<FormInputNumber
      ref={(node) => this.inputNode = node}
      onChange={this.handleChange}
    />);
  }
}

App2.propTypes = {
  done: PropTypes.func,
  simulateChange1: PropTypes.string,
  simulateChange2: PropTypes.string,
  expectedValue1String: PropTypes.string,
  expectedValue2String: PropTypes.string,
  expectedValue1Number: PropTypes.number,
  expectedValue2Number: PropTypes.number,
};

class App3 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: 1
    };
    this.inputNode = null;
    this.simulatedChange = null;
    this.handleChange = this.handleChange.bind(this);
  }

  get htmlNode() {
    return ReactTestUtils.findRenderedDOMComponentWithClass(this.inputNode, 'dbu-form-input');
  }

  simulateChange(val) {
    const htmlNode = this.htmlNode;
    this.simulatedChange = val;
    htmlNode.value = val;
    ReactTestUtils.Simulate.change(htmlNode);
  }

  componentDidMount() {
    const { simulateChange } = this.props;
    this.simulateChange(simulateChange);
  }

  handleChange(val) {
    this.setState({
      inputValue: val
    }, () => {
      const nodeValue = this.htmlNode.value;
      const { expectedValueString, expectedValueNumber } = this.props;
      expect(nodeValue).to.equal(expectedValueString);
      expect(val).to.equal(expectedValueNumber);
      setTimeout(() => {
        this.props.done();
      }, 0);
    });
  }

  render() {
    return (<FormInputNumber
      ref={(node) => this.inputNode = node}
      value={this.state.inputValue}
      onChange={this.handleChange}
    />);
  }
}

App3.propTypes = {
  done: PropTypes.func,
  simulateChange: PropTypes.string,
  expectedValueString: PropTypes.string,
  expectedValueNumber: PropTypes.number,
};

describe('FormInput', () => {
  it('has default formatter', (done) => {
    ReactDOM.render(
      <App
        done={done}
        initialValue={-1234.567}
        expectedInitialValue={'-1234.567'}
        newValue={1000.001}
        expectedNewValue={'1000.001'}
      />
      , document.querySelector('#testing')
    );
  });

  it('accepts custom separated thousands formatter', (done) => {
    ReactDOM.render(
      <App
        done={done}
        initialValue={1234}
        expectedInitialValue={'1,234'}
        newValue={1000.001}
        expectedNewValue={'1,000.001'}
        defaultThousandsSeparator=","
      />
      , document.querySelector('#testing')
    );
  });

  it('accepts custom decPoint formatter', (done) => {
    ReactDOM.render(
      <App
        done={done}
        initialValue={1000}
        expectedInitialValue={'1 000'}
        newValue={-1000.001}
        expectedNewValue={'-1 000,001'}
        defaultThousandsSeparator=" "
        defaultDecPoint=","
      />
      , document.querySelector('#testing')
    );
  });

  it('handles "" to "-" as "-" and returns 0', (done) => {
    ReactDOM.render(
      <App2
        done={done}
        simulateChange1="" simulateChange2="-"
        expectedValue1String="" expectedValue2String="-"
        expectedValue1Number={0} expectedValue2Number={0}
      />
      , document.querySelector('#testing')
    );
  });

  it('handles "" to "." as "" and returns 0', (done) => {
    ReactDOM.render(
      <App2
        done={done}
        simulateChange1="" simulateChange2="."
        expectedValue1String="" expectedValue2String=""
        expectedValue1Number={0} expectedValue2Number={0}
      />
      , document.querySelector('#testing')
    );
  });

  it('handles "-" to "-." as "-" and returns 0', (done) => {
    ReactDOM.render(
      <App2
        done={done}
        simulateChange1="-" simulateChange2="-."
        expectedValue1String="-" expectedValue2String="-"
        expectedValue1Number={0} expectedValue2Number={0}
      />
      , document.querySelector('#testing')
    );
  });

  it('handles "-" to "-[shortcut]" as "-" and returns 0', (done) => {
    ReactDOM.render(
      <App2
        done={done}
        simulateChange1="-" simulateChange2="-m"
        expectedValue1String="-" expectedValue2String="-"
        expectedValue1Number={0} expectedValue2Number={0}
      />
      , document.querySelector('#testing')
    );
  });

  it('handles "-" to "-[non-numeric]" as "-" and returns 0', (done) => {
    ReactDOM.render(
      <App2
        done={done}
        simulateChange1="-" simulateChange2="-a"
        expectedValue1String="-" expectedValue2String="-"
        expectedValue1Number={0} expectedValue2Number={0}
      />
      , document.querySelector('#testing')
    );
  });

  it('handles "-" to "-0" as "-0" and returns 0', (done) => {
    ReactDOM.render(
      <App2
        done={done}
        simulateChange1="-" simulateChange2="-0"
        expectedValue1String="-" expectedValue2String="-0"
        expectedValue1Number={0} expectedValue2Number={0}
      />
      , document.querySelector('#testing')
    );
  });

  it('handles "-1" to "-1[non-numeric]" as "-1" and returns 0', (done) => {
    ReactDOM.render(
      <App2
        done={done}
        simulateChange1="-1" simulateChange2="-1a"
        expectedValue1String="-1" expectedValue2String="-1"
        expectedValue1Number={-1} expectedValue2Number={-1}
      />
      , document.querySelector('#testing')
    );
  });

  it('handles "-1" to "-1[shortcut]" as multiplier and returns multiplied', (done) => {
    ReactDOM.render(
      <App2
        done={done}
        simulateChange1="-1.2" simulateChange2="-1.2m"
        expectedValue1String="-1.2" expectedValue2String="-1200000"
        expectedValue1Number={-1.2} expectedValue2Number={-1200000}
      />
      , document.querySelector('#testing')
    );
  });

  it('handles "-1." to "-1.[shortcut]" as multiplier and returns multiplied', (done) => {
    ReactDOM.render(
      <App2
        done={done}
        simulateChange1="-1." simulateChange2="-1.m"
        expectedValue1String="-1." expectedValue2String="-1000000"
        expectedValue1Number={-1} expectedValue2Number={-1000000}
      />
      , document.querySelector('#testing')
    );
  });

  it('handles "1." to "1.[shortcut]" as multiplier and returns multiplied', (done) => {
    ReactDOM.render(
      <App2
        done={done}
        simulateChange1="1." simulateChange2="1.m"
        expectedValue1String="1." expectedValue2String="1000000"
        expectedValue1Number={1} expectedValue2Number={1000000}
      />
      , document.querySelector('#testing')
    );
  });

  it('handles "-1.11" to "-1.1.1" as "-111." and returns "-111"', (done) => {
    ReactDOM.render(
      <App2
        done={done}
        simulateChange1="-1.11" simulateChange2="-1.1.1"
        expectedValue1String="-1.11" expectedValue2String="-111."
        expectedValue1Number={-1.11} expectedValue2Number={-111}
      />
      , document.querySelector('#testing')
    );
  });

  it('handles "-" as "-" and returns 0', (done) => {
    ReactDOM.render(
      <App3
        done={done}
        simulateChange="-"
        expectedValueString="-"
        expectedValueNumber={0}
      />
      , document.querySelector('#testing')
    );
  });
});
