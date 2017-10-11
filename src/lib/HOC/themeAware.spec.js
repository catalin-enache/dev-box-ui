import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import localeAware from './localeAware';
import themeAware from './themeAware';
import i18nService from '../services/I18nService';
import localeService from '../services/LocaleService';
import {
  theming,
  defaultTheme
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
    // console.log('TestComp#render this.props', this.props);
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
  it('does something', (done) => {
    const compInitialProps = (props) => {
      // console.log('compInitialProps', 'props.classes', props.classes, 'props.theme', props.theme);
      expect(props.theme).to.equal(theme1);
      expect(props.theme.vars.color).to.equal('red');
      expect(props.classes.testStyle.startsWith('testStyle')).to.equal(true);
    };

    let compReceivedPropsCalled = false;

    const compReceivedProps = (props) => {
      // console.log('compReceivedProps', 'props.classes', props.classes, 'props.theme', props.theme);
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
