import React from 'react';
import ReactDOM from 'react-dom';
import {
  onScreenConsole,
  Hello,
  List,
  theming,
  defaultTheme
} from 'dev-box-ui';

onScreenConsole({ buttonStyle: { }, consoleStyle: { }, options: { rtl: false } });
for (let i = 0; i < 100; i += 1) {
  console.log('foo', 'bar', 5, null, undefined, new Map([[2, 7]]), new Set([4, 5]), [8,9,10],  function(){console.log('bla')}, { a: { b: { c: [1, function(){console.log('inline')}] } } });
}
console.warn('warning');
console.error('error');


const { ThemeProvider } = theming;

const customTheme = {
  vars: {
    colors: {
      primaryTextColor: 'brown',
      secondaryTextColor: 'green',
    }
  },
  animations: defaultTheme.animations
};

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      theme: defaultTheme
    };
  }

  componentDidMount() {
    // setInterval(() => {
    //   this.setState({
    //     theme: this.state.theme === defaultTheme ?
    //       customTheme :
    //       defaultTheme
    //   });
    // }, 1000);
  }

  render() {
    return (
      <ThemeProvider theme={this.state.theme}>
        <div>
          <Hello/>
          <Hello/>
          <Hello/>
          <List items={['three', 'four']}/>
          <List items={['three', 'four']}/>
        </div>
      </ThemeProvider>
    );
  }
}

ReactDOM.render((
  <App/>
), document.getElementById('app'));
