import ReactDOM from 'react-dom';
import { beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import localeService from './services/LocaleService';

/* eslint no-console: 0 */
/* eslint func-names: 0 */

let localeServiceCallbacksLength = 0;
const consoleLog = console.log;

beforeEach(function () {
  expect(localeService.locale).to.deep.equal({ dir: 'ltr', lang: 'en' });
  localeServiceCallbacksLength = localeService._callbacks.length;
  const div = document.createElement('div');
  div.id = 'testing';
  document.body.insertBefore(div, document.querySelector('#mocha'));
});

afterEach(function () {
  expect(localeService.locale).to.deep.equal({ dir: 'ltr', lang: 'en' });
  expect(localeService._callbacks.length).to.equal(localeServiceCallbacksLength);
  expect(console.log).to.equal(consoleLog);
  const testDiv = document.querySelector('#testing');
  if (document.body.contains(testDiv)) {
    ReactDOM.unmountComponentAtNode(testDiv);
    document.body.removeChild(testDiv);
  }
});
