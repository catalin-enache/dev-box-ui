import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { describe, it } from 'mocha';
import { expect } from 'chai';

import FormInput from './FormInput';

/* eslint react/no-find-dom-node: 0 */

describe('FormInput', () => {
  it('renders FormInput and triggers interaction events', (done) => {
    const valueToSet = 'changed value';
    let [valueOnChange, valueOnFocus, valueOnBlur] = [null, null, null];

    function test(node) {
      if (!node) return;

      const htmlNodeFound1 = ReactDOM.findDOMNode(node);
      const htmlNodeFound2 = ReactTestUtils.findRenderedDOMComponentWithClass(node, 'dbu-form-input');
      const reactElementFound1 = ReactTestUtils.findRenderedComponentWithType(node, FormInput);

      expect(node).to.equal(reactElementFound1);
      expect(htmlNodeFound1).to.equal(htmlNodeFound2);
      expect(htmlNodeFound1.getAttribute('class')).to.equal(
        'dbu-form-input dbu-theme dbu-patch'
      );

      htmlNodeFound1.value = valueToSet;
      ReactTestUtils.Simulate.change(htmlNodeFound1);

      setTimeout(() => {
        expect(valueOnChange).to.equal(valueToSet);
        ReactTestUtils.Simulate.focus(htmlNodeFound1);
        expect(valueOnFocus).to.equal(valueToSet);
        ReactTestUtils.Simulate.blur(htmlNodeFound1);
        expect(valueOnBlur).to.equal(valueToSet);

        setTimeout(() => {
          done();
        }, 0);
      }, 0);
    }

    function onChange(val) {
      valueOnChange = val;
    }

    function onFocus(val) {
      valueOnFocus = val;
    }

    function onBlur(val) {
      valueOnBlur = val;
    }

    ReactDOM.render(
      <FormInput ref={test}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      , document.querySelector('#testing')
    );
  });

  it('has warning and error classes', (done) => {
    function test(node) {
      if (!node) return;

      const htmlNodeFound1 = ReactDOM.findDOMNode(node);

      expect(htmlNodeFound1.getAttribute('class')).to.equal(
        'dbu-form-input dbu-warning dbu-error dbu-theme dbu-patch'
      );

      setTimeout(() => {
        done();
      }, 0);
    }

    ReactDOM.render(
      <FormInput ref={test} hasWarning={true} hasError={true}/>
      , document.querySelector('#testing')
    );
  });

  it('updates on componentWillReceiveProps', (done) => {
    class App extends React.PureComponent {
      constructor(props) {
        super(props);
        this.state = {
          inputValue: 'initialValue'
        };
        this.inputNode = null;
      }

      componentDidMount() {
        const htmlNode = ReactTestUtils.findRenderedDOMComponentWithClass(this.inputNode, 'dbu-form-input');
        expect(htmlNode.value).to.equal('initialValue');

        this.setState({
          inputValue: 'changedValue'
        }, () => {
          expect(htmlNode.value).to.equal('changedValue');

          setTimeout(() => {
            done();
          }, 0);
        });
      }

      render() {
        return <FormInput ref={(node) => this.inputNode = node} value={this.state.inputValue} />;
      }
    }

    ReactDOM.render(
      <App />
      , document.querySelector('#testing')
    );
  });
});
