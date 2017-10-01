import { beforeEach, afterEach } from 'mocha';

beforeEach(function () {
  const div = document.createElement('div');
  div.id = 'testing';
  document.body.insertBefore(div, document.querySelector('#mocha'));
});

afterEach(function () {
  const testDiv = document.querySelector('#testing');
  if (document.body.contains(testDiv)) {
    document.body.removeChild(testDiv);
  }
});
