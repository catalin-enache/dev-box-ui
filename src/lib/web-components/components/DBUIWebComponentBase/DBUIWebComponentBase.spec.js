import { expect } from 'chai';
import sinon from 'sinon';
import getDBUIWebComponentBase from './DBUIWebComponentBase';
import DBUICommonCssVars from './DBUICommonCssVars';
import ensureSingleRegistration from '../../internals/ensureSingleRegistration';
import inIframe from '../../../../../testUtils/inIframe';

const dummyOneRegistrationName = 'dummy-one';
const dummyOneStyle = ':host { color: blue; }';
function getDummyOne(win) {
  return ensureSingleRegistration(win, dummyOneRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentBase(win);

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
getDummyOne.registrationName = dummyOneRegistrationName;

const dummyOneParentRegistrationName = 'dummy-one-parent';
const dummyOneParentStyle = ':host div { background-color: #eee; }';
function getDummyOneParent(win) {
  return ensureSingleRegistration(win, dummyOneParentRegistrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentBase(win);

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
getDummyOneParent.registrationName = dummyOneParentRegistrationName;


describe('DBUIWebComponentBase', () => {
  describe('when loaded from its getter (getDBUIWebComponentBase)', () => {
    it('injects dbui-common-css-vars into window document head', (done) => {
      inIframe({
        onLoad: ({ contentWindow, iframe }) => {
          // style[dbui-common-css-vars] not injected yet
          expect(contentWindow.document.querySelector('style[dbui-common-css-vars]')).to.equal(null);
          getDBUIWebComponentBase(contentWindow);
          // style[dbui-common-css-vars] has been injected
          expect(contentWindow.document.querySelector('style[dbui-common-css-vars]').innerText).to.equal(DBUICommonCssVars);
          iframe.remove();
          done();
        }
      });
    });
  });

  describe('registerSelf and registrationName', () => {
    it('registers the component', (done) => {
      inIframe({
        bodyHTML: `
        <dummy-one></dummy-one>
        `,
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOne = getDummyOne(contentWindow);
          const dummyOneInstance = contentWindow.document.querySelector('dummy-one');

          const notDefinedElementsBefore = [...contentWindow.document.querySelectorAll(':not(:defined)')]
            .map((element) => (element.localName));
          // localName exists in list returned by :not(:defined) CSS selector
          expect(notDefinedElementsBefore).to.eql([DummyOne.registrationName]);
          // prototype has not been upgraded yet
          expect(dummyOneInstance.constructor).to.equal(contentWindow.HTMLElement);
          expect(dummyOneInstance.constructor.name).to.equal('HTMLElement');

          contentWindow.customElements.whenDefined(DummyOne.registrationName).then(() => {
            const notDefinedElementsAfter = [...contentWindow.document.querySelectorAll(':not(:defined)')]
              .map((element) => (element.localName));
            // localName does not exist anymore in list returned by :not(:defined) CSS selector
            expect(notDefinedElementsAfter).to.eql([]);
            // prototype has been upgraded
            expect(dummyOneInstance.constructor).to.equal(DummyOne);
            expect(dummyOneInstance.constructor.name).to.equal('DummyOne');

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

  describe('dependencies', () => {
    describe('when registerSelf', () => {
      it('registers the dependencies first', (done) => {
        inIframe({
          bodyHTML: `
          <dummy-one-parent></dummy-one-parent>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DummyOne = getDummyOne(contentWindow);
            const dummyOneRegisterSelf = DummyOne.registerSelf;
            const spyDummyOneRegisterSelf = sinon.stub(DummyOne, 'registerSelf')
              .callsFake(dummyOneRegisterSelf);

            contentWindow.customElements.whenDefined('dummy-one-parent').then(() => {
              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            const DummyOneParent = getDummyOneParent(contentWindow);
            DummyOneParent.registerSelf();
            // registerSelf took care of registering the dependencies
            expect(spyDummyOneRegisterSelf.callCount).to.equal(1);
          }
        });
      });
    });
  });

  describe('templateInnerHTML', () => {
    it('defines the component HTML structure', (done) => {
      inIframe({
        bodyHTML: `
        <dummy-one-parent></dummy-one-parent>
        `,
        onLoad: ({ contentWindow, iframe }) => {

          const dummyOneParentInstance = contentWindow.document.querySelector('dummy-one-parent');

          contentWindow.customElements.whenDefined('dummy-one-parent').then(() => {

            // shadow dom structure was build as expected
            expect(dummyOneParentInstance
              .childrenTree.querySelector('div p')
              .innerText
            ).to.equal('dummy one parent component');
            expect(dummyOneParentInstance
              .childrenTree.querySelector('dummy-one')
              .childrenTree.querySelector('div p')
              .innerText
            ).to.equal('dummy one component');

            setTimeout(() => {
              iframe.remove();
              done();
            }, 0);
          });

          const DummyOneParent = getDummyOneParent(contentWindow);
          DummyOneParent.registerSelf();
        }
      });
    });
  });

  describe('useShadow and childrenTree', () => {
    describe('when useShadow', () => {
      it('childrenTree return shadow DOM', (done) => {
        inIframe({
          bodyHTML: `
          <dummy-one-parent></dummy-one-parent>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const dummyOneParentInstance = contentWindow.document.querySelector('dummy-one-parent');

            contentWindow.customElements.whenDefined('dummy-one-parent').then(() => {

              // shadow dom structure was build as expected
              expect(
                dummyOneParentInstance.shadowRoot
              ).to.not.equal(null);
              expect(dummyOneParentInstance
                .childrenTree
              ).to.equal(dummyOneParentInstance.shadowRoot);

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            const DummyOneParent = getDummyOneParent(contentWindow);
            DummyOneParent.registerSelf();
          }
        });
      });
    });

    describe('when NOT useShadow', () => {
      it('childrenTree return self instance', (done) => {
        inIframe({
          bodyHTML: `
          <dummy-one-parent></dummy-one-parent>
          `,
          onLoad: ({ contentWindow, iframe }) => {
            const DummyOneParent = getDummyOneParent(contentWindow);
            const useShadowStub = sinon.stub(DummyOneParent, 'useShadow').get(() => {
              return false;
            });
            const dummyOneParentInstance = contentWindow.document.querySelector('dummy-one-parent');

            contentWindow.customElements.whenDefined('dummy-one-parent').then(() => {

              // shadow dom structure was build as expected
              expect(
                dummyOneParentInstance.shadowRoot
              ).to.equal(null);
              expect(dummyOneParentInstance
                .childrenTree
              ).to.equal(dummyOneParentInstance);

              useShadowStub.restore();

              setTimeout(() => {
                iframe.remove();
                done();
              }, 0);
            });

            DummyOneParent.registerSelf();
          }
        });
      });
    });
  });

  describe('template', () => {
    it('returns template instance built from templateInnerHTML', (done) => {
      inIframe({
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOneParent = getDummyOneParent(contentWindow);
          expect(DummyOneParent.template.innerHTML)
            .to.equal(DummyOneParent.templateInnerHTML);
          iframe.remove();
          done();
        }
      });
    });
  });

  describe('componentStyle', () => {
    it('returns style part of template', (done) => {
      inIframe({
        onLoad: ({ contentWindow, iframe }) => {
          const DummyOneParent = getDummyOneParent(contentWindow);
          expect(DummyOneParent.componentStyle)
            .to.equal(dummyOneParentStyle);
          expect(DummyOneParent.componentStyle)
            .to.equal(DummyOneParent.template.content.querySelector('style').innerText);
          iframe.remove();
          done();
        }
      });
    });
  });

});
