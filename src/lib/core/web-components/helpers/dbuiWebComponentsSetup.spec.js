import { expect } from 'chai';
import dbuiWebComponentsSetUp from './dbuiWebComponentsSetup';

describe('dbuiWebComponentsSetUp', () => {
  it(`
  updates win with DBUIWebComponents registrationName and componentStyle
  and returns components
  `, () => {
    const win = {};
    const components = [
      { registrationName: 'A', componentStyle: 'aa' }
    ];
    const res = dbuiWebComponentsSetUp(win)(components);
    expect(res).to.equal(components);
    expect(win).to.deep.equal({ DBUIWebComponents: { A: { componentStyle: 'aa' } } });
  });
});
