import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import themeAware from './themeAware';
import {
  theming
} from './../index';

const { ThemeProvider } = theming;

const theme1 = {
  vars: {
    color: 'red'
  }
};

const theme2 = {
  vars: {
    color: 'blue'
  }
};

const style = ({ vars }) => {
  return {
    testStyle: {
      color: vars.color
    }
  };
};

let TestComp = class TestComp extends React.PureComponent {
  componentWillReceiveProps(nextProps) {
    this.props.compReceivedProps(nextProps);
  }
  componentDidMount() {
    this.props.compInitialProps(this.props);
  }
  render() {
    return <div className={this.props.classes.testStyle}>themeAware TestComp {this.props.theme.vars.color} </div>;
  }
};

TestComp.propTypes = {
  compReceivedProps: PropTypes.func.isRequired,
  compInitialProps: PropTypes.func.isRequired,
  classes: PropTypes.object,
  theme: PropTypes.object,
};

TestComp = themeAware({ style })(TestComp);

const App = class App extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      theme: theme1
    };
  }

  changeTheme(theme, cb) {
    this.setState({ theme }, cb);
  }

  render() {
    return (
      <ThemeProvider theme={this.state.theme}>
        <div>
          <TestComp
            compInitialProps={this.props.compInitialProps}
            compReceivedProps={this.props.compReceivedProps}
          />
        </div>
      </ThemeProvider>
    );
  }
};

App.propTypes = {
  compReceivedProps: PropTypes.func.isRequired,
  compInitialProps: PropTypes.func.isRequired
};

describe('themeAware', () => {
  it(`component receives theme and classes when mounted
      and when theme changes in componentWillReceiveProps`, (done) => {
      const compInitialProps = (props) => {
        expect(props.theme).to.equal(theme1);
        expect(props.theme.vars.color).to.equal('red');
        expect(props.classes.testStyle.startsWith('testStyle')).to.equal(true);
      };

      let compReceivedPropsCalled = false;

      const compReceivedProps = (props) => {
        compReceivedPropsCalled = true;
        expect(props.theme).to.equal(theme2);
        expect(props.theme.vars.color).to.equal('blue');
        expect(props.classes.testStyle.startsWith('testStyle')).to.equal(true);
      };

      const appReady = (app) => {
        if (!app) return;
        expect(app.constructor.name).to.equal('App');

        app.changeTheme(theme2, () => {
          setTimeout(() => {
            expect(compReceivedPropsCalled).to.equal(true);
            ReactDOM.unmountComponentAtNode(testing);
            done();
          }, 0);
        });
      };

      const testing = document.querySelector('#testing');

      ReactDOM.render(
        <App ref={appReady}
          compInitialProps={compInitialProps}
          compReceivedProps={compReceivedProps}
        />, testing
      );
    });
});
