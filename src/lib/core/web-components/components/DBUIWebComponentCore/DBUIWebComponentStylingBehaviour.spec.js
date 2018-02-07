import { expect, assert } from 'chai';
import sinon from 'sinon';
import getDBUIWebComponentCore from './DBUIWebComponentCore';
import DBUICommonCssVars from './DBUICommonCssVars';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUILocaleService from '../../../services/DBUILocaleService';
import appendStyles from '../../../internals/appendStyles';
import inIframe from '../../../../../../testUtils/inIframe';


const dummyOneRegistrationName = 'dummy-one';
const dummyOneStyle = `
:host {
  color: rgba(0, 0, 254, 1);
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
          <style>${dummyOneStyle}</style>
          <div>
            <p>dummy one component</p>
          </div>
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

const dummyOneParentRegistrationName = 'dummy-one-parent';
const dummyOneParentStyle = `
:host div {
  background-color: #eee;
}
`;
function getDummyOneParent(win) {
  return ensureSingleRegistration(win, dummyOneParentRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DummyOne = getDummyOne(win);

    class DummyOneParent extends DBUIWebComponentBase {

      static get registrationName() {
        return dummyOneParentRegistrationName;
      }

      static get dependencies() {
        return [DummyOne];
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyOneParentStyle}</style>
          <div>
            <p>dummy one parent component</p>
            <dummy-one></dummy-one>
          </div>
        `;
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DummyOneParent
      )
    );
  });
}

describe('DBUIWebComponent Styling Behaviour', () => {
  it('applies template style', (done) => {
    inIframe({
      bodyHTML: `
      <dummy-one></dummy-one>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DummyOne = getDummyOne(contentWindow);
        const dummyOneInst = contentWindow.document.querySelector('dummy-one');

        contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
          const computedStyle = contentWindow.getComputedStyle(dummyOneInst);

          expect(computedStyle.color).to.equal('rgb(0, 0, 254)');

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        DummyOne.registerSelf();
      }
    });
  });
});
