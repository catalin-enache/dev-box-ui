import React from 'react';
import ReactDOM from 'react-dom';
import { describe, it } from 'mocha';
import {
  theming,
  defaultTheme
} from './../../index';
import World from './World';

const { ThemeProvider } = theming;

describe('World', () => {
  it('renders world', (done) => {
    ReactDOM.render(
      <ThemeProvider theme={defaultTheme.ltr}>
        <div>
          <World/>
        </div>
      </ThemeProvider>, document.querySelector('#testing')
    );
    setTimeout(() => {
      done();
    }, 1000);
  });
});
