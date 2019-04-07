import { expect } from 'chai';
import inIframe from '../../../../testUtils/inIframe';
import appendStyles, { _appendStyle } from './appendStyles';
import getDBUIWebComponentCore from '../web-components/components/DBUIWebComponentCore/DBUIWebComponentCore';
import getDBUIWebComponentRoot from '../web-components/components/DBUIWebComponentRoot/DBUIWebComponentRoot';
import ensureSingleRegistration from './ensureSingleRegistration';

const dummyOneRegistrationName = 'dbui-dummy-one';
const dummyOneDefaultStyle = `
  :host {
    all: initial; 
    display: inline-block;
    box-sizing: border-box;
    border: none;
  }
  
  :host([dir=rtl]) {
  
  }
  
  :host([dir=ltr]) {
  
  }
`;
function getDummyOne(win) {
  return ensureSingleRegistration(win, dummyOneRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    class DummyOne extends DBUIWebComponentBase {

      static get registrationName() {
        return dummyOneRegistrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyOneDefaultStyle}</style>
          <div>dummy one</div>
        `;
      }
    }

    return Registerable(
      defineCommonStaticMethods(
        DummyOne
      )
    );
  });
}
getDummyOne.registrationName = dummyOneRegistrationName;

describe('_appendStyle', () => {
  describe('when win.DBUIWebComponents is defined', () => {
    it('uses it for storing styles to append', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        <dbui-web-component-root id="dbui-web-component-root">
          <dbui-dummy-one id="one"></dbui-dummy-one>
        </dbui-web-component-root>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const dummyOne = contentWindow.document.querySelector('#one');
          const DBUIRoot = getDBUIWebComponentRoot(contentWindow);
          const DummyOne = getDummyOne(contentWindow);
          const styleToAppend = `
            :host {
              color: rgb(0, 255, 0);
            }
          `;

          expect(contentWindow.DBUIWebComponents[dummyOneRegistrationName]).to.equal(undefined);
          expect(DummyOne.componentStyle).to.equal(dummyOneDefaultStyle);

          _appendStyle(contentWindow)(dummyOneRegistrationName, styleToAppend);

          expect(contentWindow.DBUIWebComponents[dummyOneRegistrationName].componentStyle).to.equal(styleToAppend);

          contentWindow.customElements.whenDefined(DBUIRoot.registrationName).then(() => {

            /* eslint prefer-template: 0 */
            expect(DummyOne.componentStyle).to.equal(
              dummyOneDefaultStyle +
              '\n\n/* ==== overrides ==== */\n\n' +
              styleToAppend
            );

            expect(contentWindow.getComputedStyle(dummyOne).color).to.equal('rgb(0, 255, 0)');

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
          DBUIRoot.registerSelf();
        }
      });
    });
  });

  describe('when win.DBUIWebComponents is NOT defined', () => {
    it('is created', (done) => {
      inIframe({
        headStyle: `
        `,
        bodyHTML: `
        `,
        onLoad: ({ contentWindow, iframe }) => {
          expect(contentWindow.DBUIWebComponents).to.equal(undefined);
          _appendStyle(contentWindow)('some-component', '.foo {}');
          expect(contentWindow.DBUIWebComponents).to.deep.equal(
            { 'some-component': { componentStyle: '.foo {}' } }
          );
          iframe.remove();
          done();
        }
      });
    });
  });
});

describe('appendStyles', () => {
  it('can register styles to append for multiple components', (done) => {
    inIframe({
      headStyle: `
      `,
      bodyHTML: `
      `,
      onLoad: ({ contentWindow, iframe }) => {
        expect(contentWindow.DBUIWebComponents).to.equal(undefined);
        appendStyles(contentWindow)([
          { registrationName: 'c-1', componentStyle: 's-1' },
          { registrationName: 'c-2', componentStyle: 's-2' },
        ]);
        expect(contentWindow.DBUIWebComponents).to.deep.equal(
          { 'c-1': { componentStyle: 's-1' }, 'c-2': { componentStyle: 's-2' } }
        );
        iframe.remove();
        done();
      }
    });
  });
});
