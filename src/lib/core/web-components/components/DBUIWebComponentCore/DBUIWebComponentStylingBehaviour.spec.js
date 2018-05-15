import { expect } from 'chai';
import getDBUIWebComponentCore from './DBUIWebComponentCore';
import DBUICommonCssVars from './DBUICommonCssVars';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import appendStyles from '../../../internals/appendStyles';
import inIframe from '../../../../../../testUtils/inIframe';


const dummyOneRegistrationName = 'dummy-one';
const dummyOneStyle = ':host { display: block; }';
function getDummyOne(win) {
  return ensureSingleRegistration(win, dummyOneRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DummyTwo = getDummyTwo(win);
    const DummyThree = getDummyThree(win);

    class DummyOne extends DBUIWebComponentBase {

      static get registrationName() {
        return dummyOneRegistrationName;
      }

      static get dependencies() {
        return [DummyTwo, DummyThree];
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyOneStyle}</style>
          <div>
            <div>[dummy one]</div>
            <dummy-two>
              <dummy-three>
                <slot></slot>
              </dummy-three>
            </dummy-two>
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

const dummyTwoRegistrationName = 'dummy-two';
const dummyTwoStyle = ':host { display: block; }';
function getDummyTwo(win) {
  return ensureSingleRegistration(win, dummyTwoRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    class DummyTwo extends DBUIWebComponentBase {

      static get registrationName() {
        return dummyTwoRegistrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyTwoStyle}</style>
          <div>
            <div>[dummy two]</div>
            <slot></slot>
          </div>
        `;
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DummyTwo
      )
    );
  });
}

const dummyThreeRegistrationName = 'dummy-three';
const dummyThreeStyle = ':host { display: block; }';
function getDummyThree(win) {
  return ensureSingleRegistration(win, dummyThreeRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DummyFour = getDummyFour(win);

    class DummyThree extends DBUIWebComponentBase {

      static get registrationName() {
        return dummyThreeRegistrationName;
      }

      static get dependencies() {
        return [DummyFour];
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyThreeStyle}</style>
          <div>
            <div>[dummy three]</div>
            <dummy-four></dummy-four>
            <slot></slot>
          </div>
        `;
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DummyThree
      )
    );
  });
}

const dummyFourRegistrationName = 'dummy-four';
const dummyFourStyle = ':host { display: block; }';
function getDummyFour(win) {
  return ensureSingleRegistration(win, dummyFourRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    class DummyFour extends DBUIWebComponentBase {

      static get registrationName() {
        return dummyFourRegistrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyFourStyle}</style>
          <div>
            <div>[dummy four]</div>
            <slot></slot>
          </div>
        `;
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DummyFour
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

  it('is locale aware', (done) => {
    inIframe({
      bodyHTML: `
        <div id="locale-provider" dir="abc"></div>
        <dummy-one id="one" sync-locale-with="#locale-provider">
          <dummy-one id="two"></dummy-one>
        </dummy-one>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DummyOne = getDummyOne(contentWindow);
        DummyOne.componentStyle += `
        :host([dbui-dir=ltr]) { color: rgba(0, 0, 255, 0.5); }
        :host([dbui-dir=abc]) { color: rgba(255, 0, 0, 0.5); }
        `;
        const localeProvider = contentWindow.document.querySelector('#locale-provider');
        const dummyOneInst1 = contentWindow.document.querySelector('#one');
        const dummyOneInst2 = contentWindow.document.querySelector('#two');

        contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

          const computedStyle1 = contentWindow.getComputedStyle(dummyOneInst1);
          const computedStyle2 = contentWindow.getComputedStyle(dummyOneInst2);
          expect(computedStyle1.color).to.equal('rgba(255, 0, 0, 0.5)');
          expect(computedStyle2.color).to.equal('rgba(255, 0, 0, 0.5)');

          localeProvider.dir = '';

          setTimeout(() => {

            // falling back to default dir "ltr" when target dir is falsy
            expect(computedStyle1.color).to.equal('rgba(0, 0, 255, 0.5)');
            expect(computedStyle2.color).to.equal('rgba(0, 0, 255, 0.5)');

            iframe.remove();
            done();
          }, 0);
        });

        DummyOne.registerSelf();
      }
    });
  });

  it('allows injecting custom css vars in shadow dom and control styling from outside', (done) => {
    inIframe({
      headStyle: `
      dummy-one {
        color: rgb(240, 240, 0);
        --dummy-two-color: rgb(255, 0, 0);
        --dummy-three-color: rgb(0, 255, 0);
        --dummy-four-color: rgb(0, 0, 255);
      }
      dummy-one.two {
        color: rgb(240, 240, 0);
        --dummy-two-color: rgb(255, 255, 0);
        --dummy-three-color: rgb(255, 0, 255);
        --dummy-four-color: rgb(0, 255, 255);
      }
      .one span, .two span { color: rgb(0, 0, 0); }
      `,
      bodyHTML: `
        <dummy-one class="one"><span>foo</span></dummy-one>
        <dummy-one class="two"><span>bar</span></dummy-one>
      `,
      onLoad: ({ contentWindow, iframe }) => {
        const DummyOne = getDummyOne(contentWindow);
        // const DummyTwo = getDummyTwo(contentWindow);
        // const DummyThree = getDummyThree(contentWindow);
        const DummyFour = getDummyFour(contentWindow);
        DummyOne.componentStyle += `
          dummy-two {
            color: var(--dummy-two-color, inherit);
          }
          dummy-three {
            color: var(--dummy-three-color, inherit);
          }
        `;
        DummyFour.componentStyle += `
          :host {
            color: var(--dummy-four-color, inherit);
          }
        `;

        contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {

          const dummyOneInst1 = contentWindow.document.querySelector('.one');
          const dummyOneInst1DummyTwo = dummyOneInst1.shadowRoot.querySelector('dummy-two');
          const dummyOneInst1DummyThree = dummyOneInst1.shadowRoot.querySelector('dummy-three');
          const dummyOneInst1DummyFour = dummyOneInst1DummyThree.shadowRoot.querySelector('dummy-four');

          const dummyOneInst2 = contentWindow.document.querySelector('.two');
          const dummyOneInst2DummyTwo = dummyOneInst2.shadowRoot.querySelector('dummy-two');
          const dummyOneInst2DummyThree = dummyOneInst2.shadowRoot.querySelector('dummy-three');
          const dummyOneInst2DummyFour = dummyOneInst2DummyThree.shadowRoot.querySelector('dummy-four');

          expect(contentWindow.getComputedStyle(dummyOneInst1).color).to.equal('rgb(240, 240, 0)');
          expect(contentWindow.getComputedStyle(dummyOneInst1DummyTwo).color).to.equal('rgb(255, 0, 0)');
          expect(contentWindow.getComputedStyle(dummyOneInst1DummyThree).color).to.equal('rgb(0, 255, 0)');
          expect(contentWindow.getComputedStyle(dummyOneInst1DummyFour).color).to.equal('rgb(0, 0, 255)');
          expect(contentWindow.getComputedStyle(dummyOneInst2).color).to.equal('rgb(240, 240, 0)');
          expect(contentWindow.getComputedStyle(dummyOneInst2DummyTwo).color).to.equal('rgb(255, 255, 0)');
          expect(contentWindow.getComputedStyle(dummyOneInst2DummyThree).color).to.equal('rgb(255, 0, 255)');
          expect(contentWindow.getComputedStyle(dummyOneInst2DummyFour).color).to.equal('rgb(0, 255, 255)');

          dummyOneInst1.style.setProperty('--dummy-four-color', 'rgb(0, 255, 0)');

          expect(contentWindow.getComputedStyle(dummyOneInst1DummyFour).color).to.equal('rgb(0, 255, 0)');

          dummyOneInst1.style.removeProperty('--dummy-four-color');

          expect(contentWindow.getComputedStyle(dummyOneInst1DummyFour).color).to.equal('rgb(0, 0, 255)');

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
