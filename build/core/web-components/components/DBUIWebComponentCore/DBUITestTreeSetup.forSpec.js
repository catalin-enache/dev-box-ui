'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.treeStyle = exports.treeOneGetDbuiNodes = exports.treeOne = exports.getDummyE = exports.getDummyD = exports.getDummyC = exports.getDummyB = exports.getDummyA = exports.getBase = undefined;

var _DBUIWebComponentCore = require('./DBUIWebComponentCore');

var _DBUIWebComponentCore2 = _interopRequireDefault(_DBUIWebComponentCore);

var _ensureSingleRegistration = require('../../../internals/ensureSingleRegistration');

var _ensureSingleRegistration2 = _interopRequireDefault(_ensureSingleRegistration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint max-len: 0 */

/*
inIframe({
  headStyle: treeStyle,
  bodyHTML: `
  <div id="container">
    ${treeOne}
  </div>
  `,
  onLoad: ({ contentWindow, iframe }) => {
    const DummyA = getDummyA(contentWindow);
    const DummyB = getDummyB(contentWindow);
    const DummyC = getDummyC(contentWindow);
    const DummyD = getDummyD(contentWindow);
    const DummyE = getDummyE(contentWindow);

    Promise.all([
      DummyA.registrationName,
      DummyB.registrationName,
      DummyC.registrationName,
      DummyD.registrationName,
      DummyE.registrationName,
    ].map((localName) => contentWindow.customElements.whenDefined(localName)
    )).then(() => {
      const dbuiNodes = treeOneGetDbuiNodes(contentWindow);
      const {
        lightDummyDOneRoot,
        lightDummyDOneRoot_ShadowDummyB,
        lightDummyDTwoInDefaultSlot,
        lightDummyDThreeInDefaultSlot,
        lightDummyDThreeInDefaultSlot_ShadowDummyB,
        lightDummyEInNamedSlot,
        lightDummyEInDefaultSlot
      } = dbuiNodes;

      setTimeout(() => {
        iframe.remove();
        done();
      }, 0);
    });

    DummyE.registerSelf();
  }
});
*/

const commonReportHtml = `
{<span id="id-holder"></span>}
[<span style="color: red;" id="context-color1">?</span>]
[<span style="color: red;" id="context-color2">?</span>]
[<span style="color: red;" id="context-color3">?</span>]
[<span style="color: red;" id="context-color4">?</span>]
(<span style="color: red;" id="context-counter1">?</span>)
(<span style="color: red;" id="context-counter2">?</span>)
`;

const treeStyle = `
  ul, li, p {
    margin-top: 0px;
    padding-top: 0px;
    margin-bottom: 0px;
    padding-bottom: 0px;
  }
`;

// 23 total components to connect (3 * d: 3 + 2 * e: 7)
const treeOne = `
<dummy-d id="light-dummy-d-one-root" context-color1="green" context-color2="maroon" context-color4="bisque" >
  <ul slot="named-slot" id="ul1">
    <li id="ul1-li1">
      <dummy-e id="light-dummy-e-in-named-slot"></dummy-e>
    </li>
  </ul>
  <ul id="ul2">
    <li id="ul2-li1">
      <dummy-d id="light-dummy-d-two-in-default-slot">
        <ul id="ul2-li1-ul1">
          <li id="ul2-li1-ul1-li1">
            <dummy-d id="light-dummy-d-three-in-default-slot" context-color1="orange" context-color2="deepskyblue" context-color3="olive">
              <ul id="ul2-li1-ul1-li1-ul1">
                <li id="ul2-li1-ul1-li1-ul1-li1">
                  <dummy-e id="light-dummy-e-in-default-slot"></dummy-e>
                </li>
              </ul>
            </dummy-d>
          </li>
        </ul>
      </dummy-d>
    </li>
  </ul>
</dummy-d>
`;

/* eslint camelcase: 0 */

function treeOneGetDbuiNodes(contentWindow) {
  // selections
  const lightDummyDOneRoot = contentWindow.document.querySelector('#light-dummy-d-one-root');
  const lightDummyDOneRoot_ShadowDummyB = lightDummyDOneRoot.shadowRoot.querySelector('#shadow-dummy-b');
  const lightDummyDOneRoot_ShadowDummyB_ShadowDummyA = lightDummyDOneRoot_ShadowDummyB.shadowRoot.querySelector('#shadow-dummy-a');

  const lightDummyEInNamedSlot = contentWindow.document.querySelector('#light-dummy-e-in-named-slot');
  const lightDummyEInNamedSlot_ShadowDummyD = lightDummyEInNamedSlot.shadowRoot.querySelector('#shadow-dummy-d');
  const lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB = lightDummyEInNamedSlot_ShadowDummyD.shadowRoot.querySelector('#shadow-dummy-b');
  const lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA = lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB.shadowRoot.querySelector('#shadow-dummy-a');
  const lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot = lightDummyEInNamedSlot.shadowRoot.querySelector('#shadow-dummy-c-in-default-slot');
  const lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB = lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot.shadowRoot.querySelector('#shadow-dummy-b');
  const lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA = lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.shadowRoot.querySelector('#shadow-dummy-a');

  const lightDummyDTwoInDefaultSlot = contentWindow.document.querySelector('#light-dummy-d-two-in-default-slot');
  const lightDummyDTwoInDefaultSlot_ShadowDummyB = lightDummyDTwoInDefaultSlot.shadowRoot.querySelector('#shadow-dummy-b');
  const lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA = lightDummyDTwoInDefaultSlot_ShadowDummyB.shadowRoot.querySelector('#shadow-dummy-a');

  const lightDummyDThreeInDefaultSlot = contentWindow.document.querySelector('#light-dummy-d-three-in-default-slot');
  const lightDummyDThreeInDefaultSlot_ShadowDummyB = lightDummyDThreeInDefaultSlot.shadowRoot.querySelector('#shadow-dummy-b');
  const lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA = lightDummyDThreeInDefaultSlot_ShadowDummyB.shadowRoot.querySelector('#shadow-dummy-a');

  const lightDummyEInDefaultSlot = contentWindow.document.querySelector('#light-dummy-e-in-default-slot');
  const lightDummyEInDefaultSlot_ShadowDummyD = lightDummyEInDefaultSlot.shadowRoot.querySelector('#shadow-dummy-d');
  const lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB = lightDummyEInDefaultSlot_ShadowDummyD.shadowRoot.querySelector('#shadow-dummy-b');
  const lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA = lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB.shadowRoot.querySelector('#shadow-dummy-a');
  const lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot = lightDummyEInDefaultSlot.shadowRoot.querySelector('#shadow-dummy-c-in-default-slot');
  const lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB = lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot.shadowRoot.querySelector('#shadow-dummy-b');
  const lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA = lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB.shadowRoot.querySelector('#shadow-dummy-a');

  return {
    lightDummyDOneRoot,
    lightDummyDOneRoot_ShadowDummyB,
    lightDummyDOneRoot_ShadowDummyB_ShadowDummyA,

    lightDummyEInNamedSlot,
    lightDummyEInNamedSlot_ShadowDummyD,
    lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB,
    lightDummyEInNamedSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA,
    lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot,
    lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB,
    lightDummyEInNamedSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA,

    lightDummyDTwoInDefaultSlot,
    lightDummyDTwoInDefaultSlot_ShadowDummyB,
    lightDummyDTwoInDefaultSlot_ShadowDummyB_ShadowDummyA,

    lightDummyDThreeInDefaultSlot,
    lightDummyDThreeInDefaultSlot_ShadowDummyB,
    lightDummyDThreeInDefaultSlot_ShadowDummyB_ShadowDummyA,

    lightDummyEInDefaultSlot,
    lightDummyEInDefaultSlot_ShadowDummyD,
    lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB,
    lightDummyEInDefaultSlot_ShadowDummyD_ShadowDummyB_ShadowDummyA,
    lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot,
    lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB,
    lightDummyEInDefaultSlot_ShadowDummyCInDefaultSlot_ShadowDummyB_ShadowDummyA
  };
}

function getId(self) {
  return `${self.id || 'no-id'}__${(self.closestDbuiParent || {}).id || 'no-parent-id'}`;
}

function getBase(win) {
  return (0, _ensureSingleRegistration2.default)(win, 'dummyBaseRegistrationName', () => {
    const {
      DBUIWebComponentBase
    } = (0, _DBUIWebComponentCore2.default)(win);

    class Base extends DBUIWebComponentBase {

      connectedCallback() {
        super.connectedCallback();
        this.shadowRoot.querySelector('#id-holder').innerText = getId(this);
      }

      onContextChanged(newContext, prevContext) {
        super.onContextChanged(newContext, prevContext);
        this.__newContext = newContext;
        this.__prevContext = prevContext;

        const {
          color1: newColor1,
          color2: newColor2,
          color3: newColor3,
          color4: newColor4,
          counter1: newCounter1,
          counter2: newCounter2
        } = newContext;

        const contextColor1 = this.shadowRoot.querySelector('#context-color1');
        contextColor1 && (contextColor1.innerText = newColor1 || 'red');
        contextColor1 && (contextColor1.style.color = newColor1 || 'red');
        const contextColor2 = this.shadowRoot.querySelector('#context-color2');
        contextColor2 && (contextColor2.innerText = newColor2 || 'red');
        contextColor2 && (contextColor2.style.color = newColor2 || 'red');
        const contextColor3 = this.shadowRoot.querySelector('#context-color3');
        contextColor3 && (contextColor3.innerText = newColor3 || 'lightgray');
        contextColor3 && (contextColor3.style.color = newColor3 || 'lightgray');
        const contextColor4 = this.shadowRoot.querySelector('#context-color4');
        contextColor4 && (contextColor4.innerText = newColor4 || 'red');
        contextColor4 && (contextColor4.style.color = newColor4 || 'red');

        const contextCounter1 = this.shadowRoot.querySelector('#context-counter1');
        contextCounter1 && newCounter1 && (contextCounter1.innerText = `${newCounter1}`);
        contextCounter1 && newCounter1 && (contextCounter1.style.color = 'black');
        const contextCounter2 = this.shadowRoot.querySelector('#context-counter2');
        contextCounter2 && newCounter2 && (contextCounter2.innerText = `${newCounter2}`);
        contextCounter2 && newCounter2 && (contextCounter2.style.color = 'black');
      }
    }

    return Base;
  });
}

const dummyARegistrationName = 'dummy-a';
const dummyAStyle = `
${treeStyle}
`;
function getDummyA(win) {
  return (0, _ensureSingleRegistration2.default)(win, dummyARegistrationName, () => {
    const {
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);
    const Base = getBase(win);

    class DummyA extends Base {

      static get registrationName() {
        return dummyARegistrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyAStyle}</style>
          <div>
            <p>Dummy A ${commonReportHtml}</p>
          </div>
        `;
      }
    }

    return Registerable(defineCommonStaticMethods(DummyA));
  });
}
getDummyA.registrationName = dummyARegistrationName;

const dummyBRegistrationName = 'dummy-b';
const dummyBStyle = `
${treeStyle}
`;
function getDummyB(win) {
  return (0, _ensureSingleRegistration2.default)(win, dummyBRegistrationName, () => {
    const {
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);
    const Base = getBase(win);

    const DummyA = getDummyA(win);

    class DummyB extends Base {

      static get registrationName() {
        return dummyBRegistrationName;
      }

      static get dependencies() {
        return [...super.dependencies, DummyA];
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyBStyle}</style>
          <div>
            <p>Dummy B ${commonReportHtml}</p>
            <ul>
              <li>
                <dummy-a id="shadow-dummy-a"></dummy-a>
              </li>
            </ul>
          </div>
        `;
      }
    }

    return Registerable(defineCommonStaticMethods(DummyB));
  });
}
getDummyB.registrationName = dummyBRegistrationName;

const dummyCRegistrationName = 'dummy-c';
const dummyCStyle = `
${treeStyle}
`;
function getDummyC(win) {
  return (0, _ensureSingleRegistration2.default)(win, dummyCRegistrationName, () => {
    const {
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    const Base = getBase(win);

    const DummyB = getDummyB(win);

    class DummyC extends Base {

      static get registrationName() {
        return dummyCRegistrationName;
      }

      static get dependencies() {
        return [...super.dependencies, DummyB];
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyCStyle}</style>
          <div>
            <p>Dummy C ${commonReportHtml}</p>
            <ul>
              <li>
                <dummy-b id="shadow-dummy-b"></dummy-b>
              </li>
            </ul>
          </div>
        `;
      }
    }

    return Registerable(defineCommonStaticMethods(DummyC));
  });
}
getDummyC.registrationName = dummyCRegistrationName;

const dummyDRegistrationName = 'dummy-d';
const dummyDStyle = `
${treeStyle}
`;
function getDummyD(win) {
  return (0, _ensureSingleRegistration2.default)(win, dummyDRegistrationName, () => {
    const {
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);

    const Base = getBase(win);

    const DummyB = getDummyB(win);

    class DummyD extends Base {

      static get registrationName() {
        return dummyDRegistrationName;
      }

      static get dependencies() {
        return [...super.dependencies, DummyB];
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyDStyle}</style>
          <div>
            <p>Dummy D ${commonReportHtml}</p>
            <ul>
              <li>
                <dummy-b id="shadow-dummy-b"></dummy-b>
              </li>
            </ul>
            <slot name="named-slot"></slot>
            <slot></slot>
          </div>
        `;
      }

    }

    return Registerable(defineCommonStaticMethods(DummyD));
  });
}
getDummyD.registrationName = dummyDRegistrationName;

const dummyERegistrationName = 'dummy-e';
const dummyEStyle = `
${treeStyle}
`;
function getDummyE(win) {
  return (0, _ensureSingleRegistration2.default)(win, dummyERegistrationName, () => {
    const {
      defineCommonStaticMethods,
      Registerable
    } = (0, _DBUIWebComponentCore2.default)(win);
    const Base = getBase(win);

    const DummyD = getDummyD(win);
    const DummyC = getDummyC(win);

    class DummyE extends Base {

      static get registrationName() {
        return dummyERegistrationName;
      }

      static get dependencies() {
        return [...super.dependencies, DummyD, DummyC];
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyEStyle}</style>
          <div>
            <p>Dummy E ${commonReportHtml}</p>
            <ul>
              <li>
                <dummy-d id="shadow-dummy-d">
                  <ul>
                    <li>
                      <dummy-c id="shadow-dummy-c-in-default-slot"></dummy-c>
                    </li>
                  </ul>
                </dummy-d>
              </li>
            </ul>
          </div>
        `;
      }
    }

    return Registerable(defineCommonStaticMethods(DummyE));
  });
}
getDummyE.registrationName = dummyERegistrationName;

exports.getBase = getBase;
exports.getDummyA = getDummyA;
exports.getDummyB = getDummyB;
exports.getDummyC = getDummyC;
exports.getDummyD = getDummyD;
exports.getDummyE = getDummyE;
exports.treeOne = treeOne;
exports.treeOneGetDbuiNodes = treeOneGetDbuiNodes;
exports.treeStyle = treeStyle;