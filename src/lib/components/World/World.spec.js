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
    const div = document.createElement('div');
    document.body.appendChild(div);
    ReactDOM.render(
      <ThemeProvider theme={defaultTheme}>
        <div>
          <World/>
        </div>
      </ThemeProvider>, div
    );
    setTimeout(() => {
      done();
    }, 1000);
  });
});
