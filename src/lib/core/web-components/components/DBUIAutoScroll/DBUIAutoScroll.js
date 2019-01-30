
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUIAutoScrollNative from '../DBUIAutoScrollNative/DBUIAutoScrollNative';

const registrationName = 'dbui-auto-scroll';

export default function getDBUIAutoScroll(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DBUIAutoScrollNative = getDBUIAutoScrollNative(win);

    class DBUIAutoScroll extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            /*all: initial;*/
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
          }
          
          :host([dbui-dir=ltr]) {
            /* pass */
          }
          
          :host([dbui-dir=rtl]) {
            /* pass */
          }
          
          #outer {
            width: 100%;
            height: 100%;
            overflow: visible;
          }
          
          #auto-scroll-native {
            width: calc(100% + 15px);
            height: calc(100% + 15px);
          }
          
          #content {
            padding-right: 15px;
            padding-bottom: 15px;
          }

          </style>
          <div id="outer">
            <dbui-auto-scroll-native id="auto-scroll-native" overflow="scroll">
              <div id="content">
                <slot></slot>
              </div>
            </dbui-auto-scroll-native>
          </div>
          
        `;
      }

      static get dependencies() {
        return [...super.dependencies, DBUIAutoScrollNative];
      }

      static get propertiesToUpgrade() {
        return [...super.propertiesToUpgrade];
      }

      static get observedAttributes() {
        return [...super.observedAttributes];
      }

      constructor() {
        super();
      }

      onLocaleDirChanged(newDir, oldDir) {
        // acts like an init
        super.onLocaleDirChanged(newDir, oldDir);
      }

      onConnectedCallback() {
        super.onConnectedCallback();
      }

      onDisconnectedCallback() {
        super.onDisconnectedCallback();
      }

      onAttributeChangedCallback(name, oldValue, newValue) {
        super.onAttributeChangedCallback(name, oldValue, newValue);
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DBUIAutoScroll
      )
    );
  });
}

getDBUIAutoScroll.registrationName = registrationName;

