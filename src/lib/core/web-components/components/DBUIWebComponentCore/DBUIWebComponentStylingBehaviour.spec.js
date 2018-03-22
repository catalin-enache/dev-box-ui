import { expect, assert } from 'chai';
import sinon from 'sinon';
import getDBUIWebComponentCore from './DBUIWebComponentCore';
import DBUICommonCssVars from './DBUICommonCssVars';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUILocaleService from '../../../services/DBUILocaleService';
import appendStyles from '../../../internals/appendStyles';
import inIframe from '../../../../../../testUtils/inIframe';


const dummyOneRegistrationName = 'dummy-one';
const dummyOneStyle = '';
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
const dummyOneParentStyle = '';
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
        DummyOne.componentStyle += `
        :host {
          color: rgba(0, 0, 254, 1);
        }
        `;
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

  it('inherits inheritable css props from its parent', (done) => {
    inIframe({
      bodyHTML: `
      <div style="color: rgba(250, 0, 0, 0.2);">
        <dummy-one></dummy-one>
      </div>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DummyOne = getDummyOne(contentWindow);
        DummyOne.componentStyle += `
        `;
        const dummyOneInst = contentWindow.document.querySelector('dummy-one');

        contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
          const computedStyle = contentWindow.getComputedStyle(dummyOneInst);

          // inherited color from parent
          expect(computedStyle.color).to.equal('rgba(250, 0, 0, 0.2)');

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        DummyOne.registerSelf();
      }
    });
  });

  it('does NOT inherit inheritable css props from its parent if :host { all: initial; }', (done) => {
    inIframe({
      bodyHTML: `
      <div style="color: rgba(250, 0, 0, 0.5);">
        <dummy-one></dummy-one>
      </div>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DummyOne = getDummyOne(contentWindow);
        DummyOne.componentStyle += `
        :host { all: initial; }
        `;
        const dummyOneInst = contentWindow.document.querySelector('dummy-one');

        contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
          const computedStyle = contentWindow.getComputedStyle(dummyOneInst);

          // color was NOT inherited from parent due to :host { all: initial; } rule
          expect(computedStyle.color).to.equal('rgb(0, 0, 0)');

          setTimeout(() => {
            iframe.remove();
            done();
          }, 0);
        });

        DummyOne.registerSelf();
      }
    });
  });

  it(`inherits inheritable css props from its parent
  even if :host { all: initial; } was specified
  given that the property was explicitly set to inherit
  `, (done) => {
      inIframe({
        bodyHTML: `
        <div style="color: rgba(250, 0, 0, 0.2);">
          <dummy-one></dummy-one>
        </div>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOne = getDummyOne(contentWindow);
          DummyOne.componentStyle += `
          :host { all: initial; color: inherit; }
          `;
          const dummyOneInst = contentWindow.document.querySelector('dummy-one');

          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
            const computedStyle = contentWindow.getComputedStyle(dummyOneInst);

            // color was inherited due to being explicitly set to inherit despite all: initial rule
            expect(computedStyle.color).to.equal('rgba(250, 0, 0, 0.2)');

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          DummyOne.registerSelf();
        }
      });
    });
  // TODO: fix when locale aware will be shared in context
  xit('is locale aware', (done) => {
    inIframe({
      bodyHTML: `
        <dummy-one dir="ltr"></dummy-one>
        <dummy-one dir="rtl"></dummy-one>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DummyOne = getDummyOne(contentWindow);
        DummyOne.componentStyle += `
        :host([dir=ltr]) { color: rgba(255, 0, 0, 0.5); }
        :host([dir=rtl]) { color: rgba(0, 0, 255, 0.5); }
        `;
        const [dummyOneInst1, dummyOneInst2] = contentWindow.document.querySelectorAll('dummy-one');

        contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
          const computedStyle1 = contentWindow.getComputedStyle(dummyOneInst1);
          const computedStyle2 = contentWindow.getComputedStyle(dummyOneInst2);
          console.log(dummyOneInst1, dummyOneInst2);
          expect(computedStyle1.color).to.equal('rgba(255, 0, 0, 0.5)');
          expect(computedStyle2.color).to.equal('rgba(0, 0, 255, 0.5)');

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
