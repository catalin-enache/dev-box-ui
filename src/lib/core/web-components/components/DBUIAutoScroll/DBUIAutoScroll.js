
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUIAutoScrollNative from '../DBUIAutoScrollNative/DBUIAutoScrollNative';

const DBUIAutoScrollCssVars = `
  :root {
    --dbui-auto-scroll-custom-slider-thickness: 8px;
  }
`;

const isDbuiRTL = (self) => {
  return self.getAttribute('dbui-dir') === 'rtl';
};

const getElement = (self, id) => {
  if (self[`_${id}`]) {
    return self[`_${id}`];
  }
  self[`_${id}`] =
    self.shadowRoot.querySelector(`#${id}`);
  return self[`_${id}`];
};

const registrationName = 'dbui-auto-scroll';

/*
TODO:
 - should be used as native or custom and the DBUIAutoScrollNative should be private
   reason: DBUIAutoScrollNative needs "dir" to be set which prevent dir propagation
*/

export default function getDBUIAutoScroll(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable,
      defineComponentCssVars
    } = getDBUIWebComponentCore(win);

    defineComponentCssVars(win, DBUIAutoScrollCssVars);

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
            <dbui-auto-scroll-native id="auto-scroll-native">
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
        return [...super.propertiesToUpgrade, 'native'];
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'native'];
      }

      constructor() {
        super();
        this._autoScrollNative = null;
        this._content = null;
        this._onDBUIAutoScrollNativeResize =
          this._onDBUIAutoScrollNativeResize.bind(this);
      }

      get native() {
        return this.getAttribute('native') !== null;
      }

      set native(value) {
        const newValue = !!value;
        newValue && this.setAttribute('native', '');
        !newValue && this.removeAttribute('native');
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

      _nativeSetupOnOff() {
        this.native ?
          this._nativeSetupOnCustomSetupOff() :
          this._customSetupOnNativeSetupOff();
      }

      _nativeSetupOnCustomSetupOff() {
        const autoScrollNative = getElement(this, 'auto-scroll-native');
        const content = getElement(this, 'content');
        const isRtl = isDbuiRTL(this);
        const paddingDir = isRtl ? 'Left' : 'Right';
        autoScrollNative.style.width = '100%';
        autoScrollNative.style.height = '100%';
        autoScrollNative.style.marginLeft = '0px';
        content.style[`padding${paddingDir}`] = '0px';
        content.style.paddingBottom = '0px';
      }

      _customSetupOnNativeSetupOff() {
        const autoScrollNative = getElement(this, 'auto-scroll-native');
        const content = getElement(this, 'content');
        const isRtl = isDbuiRTL(this);
        const paddingDir = isRtl ? 'Left' : 'Right';
        const { hNativeSliderThickness, vNativeSliderThickness } = autoScrollNative;
        const customSliderThickness = this._customSliderThickness;
        autoScrollNative.style.width = `calc(100% + ${vNativeSliderThickness}px)`;
        autoScrollNative.style.height = `calc(100% + ${hNativeSliderThickness+2}px)`;
        // need to address border and padding ?
        autoScrollNative.style.marginLeft = `${(isRtl ? -vNativeSliderThickness-2 : 0)}px`;
        content.style[`padding${paddingDir}`] = `${customSliderThickness}px`;
        content.style.paddingBottom = `${customSliderThickness}px`;
      }

      _onDBUIAutoScrollNativeResize(evt) {
        const { width, height, contentWidth, contentHeight } = evt.detail;
        console.log('_onDBUIAutoScrollNativeResize', {
          width, height, contentWidth, contentHeight
        });
      }

      onLocaleDirChanged(newDir, oldDir) {
        super.onLocaleDirChanged(newDir, oldDir);
        const autoScrollNative = getElement(this, 'auto-scroll-native');
        const { vNativeSliderThickness } = autoScrollNative;
        autoScrollNative.dir = newDir;
        if (!this.native) {
          autoScrollNative.style.marginLeft = `${(newDir === 'rtl' ? -vNativeSliderThickness : 0)}px`;
        }
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        this._nativeSetupOnOff();
        getElement(this, 'auto-scroll-native')
          .addEventListener('resize', this._onDBUIAutoScrollNativeResize);
      }

      onDisconnectedCallback() {
        super.onDisconnectedCallback();
      }

      onAttributeChangedCallback(name, oldValue, newValue) {
        super.onAttributeChangedCallback(name, oldValue, newValue);
        if (!this.isMounted) return;
        switch (name) {
          case 'native':
            this._nativeSetupOnOff();
            break;
          default:
            // pass
        }
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

