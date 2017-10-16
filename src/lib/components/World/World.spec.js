import React from 'react';
import ReactDOM from 'react-dom';
import { describe, it } from 'mocha';
import {
  theming,
  theme,
  themeVars
} from './../../index';
import World from './World';

const currentTheme = theme(themeVars);

const { ThemeProvider } = theming;

describe('World', () => {
  it('renders world', (done) => {
    ReactDOM.render(
      <ThemeProvider theme={currentTheme.ltr}>
        <div>
          <World/>
        </div>
      </ThemeProvider>, document.querySelector('#testing')
    );
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(document.querySelector('#testing'));
      done();
    }, 1000);
  });
});
