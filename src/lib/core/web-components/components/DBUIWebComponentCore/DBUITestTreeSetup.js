import getDBUIWebComponentCore from './DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';


const treeStyle = `
  ul, li, p {
    margin-top: 0px;
    padding-top: 0px;
    margin-bottom: 0px;
    padding-bottom: 0px;
  }
`;

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
  return ensureSingleRegistration(win, 'dummyBRegistrationName', () => {
    const {
      DBUIWebComponentBase,
    } = getDBUIWebComponentCore(win);

    class Base extends DBUIWebComponentBase {

      static get contextSubscribe() {
        return [...super.contextSubscribe, 'color1', 'color2', 'color4'];
      }

      static get contextProvide() {
        return [...super.contextProvide, 'color4'];
      }

      connectedCallback() {
        super.connectedCallback();
        // closestDbuiParent exists but might not be connected itself
        // the children CAN register nevertheless
        this.__testClosestDbuiParent = this.closestDbuiParent;
        // closestDbuiChildren might not be complete
        this.__testClosestDbuiChildren = [...this.closestDbuiChildren];
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'context-color4'];
      }

      attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'context-color4') {
          this.setContext({
            color4: newValue
          });
        }
      }

      onContextChanged(newContext) {

        const {
          color1: newColor1,
          color2: newColor2,
          color3: newColor3,
          color4: newColor4,
        } = newContext;

        const contextColor1 = this.shadowRoot.querySelector('#context-color1');
        contextColor1 && (contextColor1.innerText = (newColor1 || 'red'));
        contextColor1 && (contextColor1.style.color = (newColor1 || 'red'));
        const contextColor2 = this.shadowRoot.querySelector('#context-color2');
        contextColor2 && (contextColor2.innerText = (newColor2 || 'red'));
        contextColor2 && (contextColor2.style.color = (newColor2 || 'red'));
        const contextColor3 = this.shadowRoot.querySelector('#context-color3');
        contextColor3 && (contextColor3.innerText = (newColor3 || 'lightgray'));
        contextColor3 && (contextColor3.style.color = (newColor3 || 'lightgray'));
        const contextColor4 = this.shadowRoot.querySelector('#context-color4');
        contextColor4 && (contextColor4.innerText = (newColor4 || 'red'));
        contextColor4 && (contextColor4.style.color = (newColor4 || 'red'));

        newColor1 && this.setContext({
          color1: newColor1,
          // color2: newColor2,
        });

        newColor4 && this.setAttribute('context-color4', newColor4);

      }

      _readyCallback() {
        super._readyCallback();
        this.shadowRoot.querySelector('#id-holder').innerText = getId(this);
        // if (this.id === 'light-dummy-d-one-root') {
        //   setTimeout(() => {
        //     this.setContext({
        //       color1: 'blue',
        //       color2: 'indianred',
        //       // color4: 'darkgreen',
        //     });
        //     setTimeout(() => {
        //       this.setAttribute('context-color4', 'indigo');
        //     }, 4000);
        //   }, 2000);
        // }
        // if (this.id === 'light-dummy-d-three-in-default-slot') {
        //   setTimeout(() => {
        //     this.setAttribute('context-color4', 'darkgreen');
        //   }, 4000);
        // }
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
  return ensureSingleRegistration(win, dummyARegistrationName, () => {
    const {
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);
    const Base = getBase(win);

    class DummyA extends Base {

      static get registrationName() {
        return dummyARegistrationName;
      }

      static get contextSubscribe() {
        return [...super.contextSubscribe, 'color3'];
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyAStyle}</style>
          <div>
            <p>Dummy A (<span id="id-holder"></span>) [<span style="color: red;" id="context-color1">?????</span>] [<span style="color: red;" id="context-color2">?????</span>] [<span style="color: red;" id="context-color3">?????</span>] [<span style="color: red;" id="context-color4">?????</span>]</p>
          </div>
        `;
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DummyA
      )
    );
  });
}
getDummyA.registrationName = dummyARegistrationName;


const dummyBRegistrationName = 'dummy-b';
const dummyBStyle = `
${treeStyle}
`;
function getDummyB(win) {
  return ensureSingleRegistration(win, dummyBRegistrationName, () => {
    const {
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);
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
            <p>Dummy B (<span id="id-holder"></span>) [<span style="color: red;" id="context-color1">?????</span>] [<span style="color: red;" id="context-color2">?????</span>] [<span style="color: red;" id="context-color3">?????</span>] [<span style="color: red;" id="context-color4">?????</span>]</p>
            <ul>
              <li>
                <dummy-a id="shadow-dummy-a"></dummy-a>
              </li>
            </ul>
          </div>
        `;
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DummyB
      )
    );
  });
}
getDummyB.registrationName = dummyBRegistrationName;


const dummyCRegistrationName = 'dummy-c';
const dummyCStyle = `
${treeStyle}
`;
function getDummyC(win) {
  return ensureSingleRegistration(win, dummyCRegistrationName, () => {
    const {
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);
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
            <p>Dummy C (<span id="id-holder"></span>) [<span style="color: red;" id="context-color1">?????</span>] [<span style="color: red;" id="context-color2">?????</span>] [<span style="color: red;" id="context-color3">?????</span>] [<span style="color: red;" id="context-color4">?????</span>]</p>
            <ul>
              <li>
                <dummy-b id="shadow-dummy-b"></dummy-b>
              </li>
            </ul>
          </div>
        `;
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DummyC
      )
    );
  });
}
getDummyC.registrationName = dummyCRegistrationName;


const dummyDRegistrationName = 'dummy-d';
const dummyDStyle = `
${treeStyle}
`;
function getDummyD(win) {
  return ensureSingleRegistration(win, dummyDRegistrationName, () => {
    const {
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);
    const Base = getBase(win);

    const DummyB = getDummyB(win);

    class DummyD extends Base {

      static get registrationName() {
        return dummyDRegistrationName;
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'context-color1', 'context-color2', 'context-color3'];
      }

      static get dependencies() {
        return [...super.dependencies, DummyB];
      }

      static get contextProvide() {
        return [...super.contextProvide, 'color1', 'color2', 'color3'];
      }

      attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        // const hasValue = newValue !== null;
        if (name === 'context-color1') {
          this.setContext({
            color1: newValue
          });
        } else if (name === 'context-color2') {
          this.setContext({
            color2: newValue
          });
        } else if (name === 'context-color3') {
          this.setContext({
            color3: newValue
          });
        }
      }

      static get templateInnerHTML() {
        return `
          <style>${dummyDStyle}</style>
          <div>
            <p>Dummy D (<span id="id-holder"></span>) [<span style="color: red;" id="context-color1">?????</span>] [<span style="color: red;" id="context-color2">?????</span>] [<span style="color: red;" id="context-color3">?????</span>] [<span style="color: red;" id="context-color4">?????</span>]</p>
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

    return Registerable(
      defineCommonStaticMethods(
        DummyD
      )
    );
  });
}
getDummyD.registrationName = dummyDRegistrationName;


const dummyERegistrationName = 'dummy-e';
const dummyEStyle = `
${treeStyle}
`;
function getDummyE(win) {
  return ensureSingleRegistration(win, dummyERegistrationName, () => {
    const {
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);
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
            <p>Dummy E (<span id="id-holder"></span>) [<span style="color: red;" id="context-color1">?????</span>] [<span style="color: red;" id="context-color2">?????</span>] [<span style="color: red;" id="context-color3">?????</span>] [<span style="color: red;" id="context-color4">?????</span>]</p>
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

    return Registerable(
      defineCommonStaticMethods(
        DummyE
      )
    );
  });
}
getDummyE.registrationName = dummyERegistrationName;

export {
  getDummyA,
  getDummyB,
  getDummyC,
  getDummyD,
  getDummyE,
  treeOne,
  treeOneGetDbuiNodes,
  treeStyle
};
