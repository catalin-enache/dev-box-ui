
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

const getResizeSensorContent = (self) => {
  if (self._resizeSensorContent) {
    return self._resizeSensorContent;
  }
  self._resizeSensorContent =
    self.shadowRoot.querySelector('#resize-sensor-content');
  return self._resizeSensorContent;
};

const dispatchResizeEvent = (self) => {
  const win = self.ownerDocument.defaultView;
  self.dispatchEvent(new win.CustomEvent('resize', {
    detail: self._resizeEventDetails
  }));
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
          
          #resize-sensor-content {
            display: inline-block;
            position: relative;
          }
          </style>
          <dbui-resize-sensor id="resize-sensor-outer">
              <dbui-resize-sensor id="resize-sensor-content">
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
        this._onResizeOuter = this._onResizeOuter.bind(this);
        this._onResizeContent = this._onResizeContent.bind(this);
      }

      /**
       * Returns native vertical slider thickness in pixels.
       * @return {number}
       */
      get vNativeSliderThickness() {
        const outerSensor = getResizeSensorOuter(this);
        const vSliderThickness = outerSensor.offsetWidth - outerSensor.clientWidth;
        return vSliderThickness;
      }

      /**
       * Returns native horizontal slider thickness in pixels.
       * @return {number}
       */
      get hNativeSliderThickness() {
        const outerSensor = getResizeSensorOuter(this);
        const hSliderThickness = outerSensor.offsetHeight - outerSensor.clientHeight;
        return hSliderThickness;
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

      _onResizeOuter() {
        dispatchResizeEvent(this);
      }

      _onResizeContent() {
        dispatchResizeEvent(this);
      }

      get _resizeEventDetails() {
        const resizeOuter = getResizeSensorOuter(this);
        const resizeContent = getResizeSensorContent(this);
        const { width, height } = resizeOuter.dimensions;
        const { width: contentWidth, height: contentHeight } = resizeContent.dimensions;
        const resizeEventDetails = {
          width, height, contentWidth, contentHeight
        };
        return resizeEventDetails;
      }

      onLocaleDirChanged(newDir, oldDir) {
        // acts like an init
        super.onLocaleDirChanged(newDir, oldDir);
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        getResizeSensorOuter(this).addEventListener('resize', this._onResizeOuter);
        getResizeSensorContent(this).addEventListener('resize', this._onResizeContent);
        this._setOverflow();
      }

      onDisconnectedCallback() {
        super.onDisconnectedCallback();
        getResizeSensorOuter(this).removeEventListener('resize', this._onResizeOuter);
        getResizeSensorContent(this).removeEventListener('resize', this._onResizeContent);
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

