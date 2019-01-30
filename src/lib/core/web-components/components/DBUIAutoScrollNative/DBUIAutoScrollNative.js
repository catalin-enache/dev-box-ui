
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUIResizeSensor from '../DBUIResizeSensor/DBUIResizeSensor';

const getResizeSensorOuter = (self) => {
  if (self._resizeSensorOuter) {
    return self._resizeSensorOuter;
  }
  self._resizeSensorOuter =
    self.shadowRoot.querySelector('#resize-sensor-outer');
  return self._resizeSensorOuter;
};

const getResizeSensorInner = (self) => {
  if (self._resizeSensorInner) {
    return self._resizeSensorInner;
  }
  self._resizeSensorInner =
    self.shadowRoot.querySelector('#resize-sensor-inner');
  return self._resizeSensorInner;
};

const registrationName = 'dbui-auto-scroll-native';

export default function getDBUIAutoScrollNative(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DBUIResizeSensor = getDBUIResizeSensor(win);

    class DBUIAutoScrollNative extends DBUIWebComponentBase {

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
          
          #resize-sensor-outer {
            width: 100%;
            height: 100%;
            display: block;
            /* overflow: scroll; */
            position: relative;
            /* partially fix chrome repaint bug on overflow auto */
            transform: translateZ(0);
          }
          
          #resize-sensor-inner {
            display: inline-block;
            position: relative;
          }
          </style>
          <dbui-resize-sensor id="resize-sensor-outer">
              <dbui-resize-sensor id="resize-sensor-inner">
                  <slot></slot>
              </dbui-resize-sensor>
          </dbui-resize-sensor>
        `;
      }

      static get dependencies() {
        return [...super.dependencies, DBUIResizeSensor];
      }

      static get propertiesToUpgrade() {
        return [...super.propertiesToUpgrade, 'overflow'];
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'overflow'];
      }

      constructor() {
        super();
        this._resizeSensorOuter = null;
        this._resizeSensorInner = null;
        this._onResizeOuter = this._onResizeOuter.bind(this);
        this._onResizeInner = this._onResizeInner.bind(this);
      }

      get overflow() {
        const overflow = this.getAttribute('overflow');
        return ['auto', 'scroll'].includes(overflow) ? overflow : 'scroll';
      }

      set overflow(value) {
        const overflow = ['auto', 'scroll'].includes(value) ? value : '';
        this.setAttribute('overflow', overflow);
      }

      _setOverflow() {
        getResizeSensorOuter(this).style.overflow = this.overflow;
      }

      _onResizeOuter(evt) {
        console.log('_onResizeOuter', evt.detail);
      }

      _onResizeInner(evt) {
        console.log('_onResizeInner', evt.detail);
      }

      onLocaleDirChanged(newDir, oldDir) {
        // acts like an init
        super.onLocaleDirChanged(newDir, oldDir);
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        getResizeSensorOuter(this).addEventListener('resize', this._onResizeOuter);
        getResizeSensorInner(this).addEventListener('resize', this._onResizeInner);
        this._setOverflow();
      }

      onDisconnectedCallback() {
        super.onDisconnectedCallback();
        getResizeSensorOuter(this).removeEventListener('resize', this._onResizeOuter);
        getResizeSensorInner(this).removeEventListener('resize', this._onResizeInner);
      }

      onAttributeChangedCallback(name, oldValue, newValue) {
        super.onAttributeChangedCallback(name, oldValue, newValue);
        if (!this.isMounted) return;
        switch (name) {
          case 'overflow': {
            this._setOverflow();
            break;
          }
          default:
            // pass
        }
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DBUIAutoScrollNative
      )
    );
  });
}

getDBUIAutoScrollNative.registrationName = registrationName;

