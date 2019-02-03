
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUIAutoScrollNative from '../DBUIAutoScrollNative/DBUIAutoScrollNative';

const DBUIAutoScrollCssVars = `
  :root {
    --dbui-auto-scroll-custom-slider-thickness: 8px;
  }
`;

function defineComponentCSS(win) {
  const { document } = win;
  const commonCSSVarsStyleNode = document.querySelector('[dbui-common-css-vars]');
  commonCSSVarsStyleNode.innerHTML += DBUIAutoScrollCssVars;
}

const isDbuiRTL = (self) => {
  return self.getAttribute('dbui-dir') === 'rtl';
};

const getAutoScrollNative = (self) => {
  if (self._autoScrollNative) {
    return self._autoScrollNative;
  }
  self._autoScrollNative =
    self.shadowRoot.querySelector('#auto-scroll-native');
  return self._autoScrollNative;
};

const getContent = (self) => {
  if (self._content) {
    return self._content;
  }
  self._content =
    self.shadowRoot.querySelector('#content');
  return self._content;
};

const registrationName = 'dbui-auto-scroll';

export default function getDBUIAutoScroll(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    defineComponentCSS(win);

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
            /* width: calc(100% + 15px); */
            /* height: calc(100% + 15px); */
          }
          
          #content {
            /* padding-right: 15px; */
            /* padding-bottom: 15px; */
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
        this._autoScrollNative = null;
        this._content = null;
      }

      /**
       * Returns custom slider thickness in pixels.
       * @return {number}
       */
      get _customSliderThickness() {
        const computedStyle = win.getComputedStyle(this);
        const customSliderThickness = win.parseInt(
          computedStyle.getPropertyValue(
            '--dbui-auto-scroll-custom-slider-thickness'
          )
        );
        return customSliderThickness;
      }

      onLocaleDirChanged(newDir, oldDir) {
        // acts like an init
        super.onLocaleDirChanged(newDir, oldDir);
        const content = getContent(this);
        const customSliderThickness = this._customSliderThickness;
        content.style.paddingRight = `${customSliderThickness}px`;
        content.style.paddingBottom = `${customSliderThickness}px`;
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        const autoScrollNative = getAutoScrollNative(this);
        const { _hNativeSliderThickness, _vNativeSliderThickness } = autoScrollNative;
        autoScrollNative.style.width = `calc(100% + ${_vNativeSliderThickness}px)`;
        autoScrollNative.style.height = `calc(100% + ${_hNativeSliderThickness}px)`;
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

