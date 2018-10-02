import ReactDOM from 'react-dom';
import { beforeEach, afterEach, before, after } from 'mocha';
import { expect } from 'chai';
import getDBUILocaleService from './core/services/DBUILocaleService';

const localeService = getDBUILocaleService(window);

/* eslint no-console: 0 */
/* eslint func-names: 0 */

let localeServiceCallbacksLength = 0;
const consoleLog = console.log;

before(() => {
  const testingContainer = document.createElement('div');
  testingContainer.id = 'testing-container';
  testingContainer.style.position = 'relative';
  testingContainer.style.backgroundColor = 'white';
  testingContainer.style.zIndex = '2';
  testingContainer.style.width = '100%';
  testingContainer.style.height = '500px';
  document.body.insertBefore(testingContainer, document.querySelector('#mocha'));

  const testStyle = document.createElement('style');
  testStyle.innerHTML = `
  #testing {
    /* background-color: gray; */
    /* https://davidwalsh.name/scroll-iframes-ios */
    /* -webkit-overflow-scrolling: touch; */
    /* overflow-y: scroll; */
  }
  `;
  document.querySelector('head').appendChild(testStyle);
});

after(() => {
  const testingContainer = document.querySelector('#testing-container');
  if (document.body.contains(testingContainer)) {
    document.body.removeChild(testingContainer);
  }
});

beforeEach(function () {
  expect(localeService.locale).to.deep.equal({ dir: 'ltr', lang: 'en' });
  localeServiceCallbacksLength = localeService._callbacks.length;
  const testDiv = document.createElement('div');
  testDiv.id = 'testing';
  testDiv.style.width = '100%';
  testDiv.style.height = '100%';
  document.querySelector('#testing-container').appendChild(testDiv);
});

afterEach(function () {
  expect(localeService.locale).to.deep.equal({ dir: 'ltr', lang: 'en' });
  expect(localeService._callbacks.length).to.equal(localeServiceCallbacksLength);
  expect(console.log).to.equal(consoleLog);
  const testingContainer = document.querySelector('#testing-container');
  const testDiv = document.querySelector('#testing');
  if (testingContainer.contains(testDiv)) {
    ReactDOM.unmountComponentAtNode(testDiv);
    testingContainer.removeChild(testDiv);
  }
});
