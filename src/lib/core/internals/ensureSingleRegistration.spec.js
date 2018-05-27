import { expect } from 'chai';
import inIframe from '../../../../testUtils/inIframe';
import ensureSingleRegistration from './ensureSingleRegistration';


describe('ensureSingleRegistration', () => {
  it('creates win.DBUIWebComponents if not defined and ensures singleton registration', (done) => {
    inIframe({
      headStyle: `
      `,
      bodyHTML: `
      `,
      onLoad: ({ contentWindow, iframe }) => {
        expect(contentWindow.DBUIWebComponents).to.equal(undefined);

        const registration1 = class C1 {};
        ensureSingleRegistration(contentWindow, 'c-1', () => {
          return registration1;
        });

        expect(contentWindow.DBUIWebComponents.registrations['c-1']).to.equal(registration1);

        const registration2 = class C1 {};

        ensureSingleRegistration(contentWindow, 'c-1', () => {
          return registration2;
        });

        // cached
        expect(contentWindow.DBUIWebComponents.registrations['c-1']).to.equal(registration1);

        delete contentWindow.DBUIWebComponents.registrations;

        ensureSingleRegistration(contentWindow, 'c-1', () => {
          return registration2;
        });

        expect(contentWindow.DBUIWebComponents.registrations['c-1']).to.equal(registration2);

        ensureSingleRegistration(contentWindow, 'c-1', () => {
          return registration1;
        });

        // cached
        expect(contentWindow.DBUIWebComponents.registrations['c-1']).to.equal(registration2);

        iframe.remove();
        done();
      }
    });
  });
});
