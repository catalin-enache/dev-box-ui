
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUIResizeSensor from '../DBUIResizeSensor/DBUIResizeSensor';

const isDbuiRTL = (self) => {
  return self.getAttribute('dbui-dir') === 'rtl';
};

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

/*
DBUIAutoScrollNative needs "dir" to be set which prevent dir propagation.
For this reason this component should remain private.
Instead DBUIAutoScroll should be public and act as native if needed.
*/

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
            /*
            Setting overflow at runtime makes Mozilla
            to not fire resize event for #resize-sensor-content
            so, it must be set in CSS or in HTML style.
            */
            overflow: auto;
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
        return [...super.propertiesToUpgrade];
      }

      static get observedAttributes() {
        return [...super.observedAttributes];
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
        const vSliderThickness = this.offsetWidth - this.clientWidth;
        return vSliderThickness;
      }

      /**
       * Returns native horizontal slider thickness in pixels.
       * @return {number}
       */
      get hNativeSliderThickness() {
        const hSliderThickness = this.offsetHeight - this.clientHeight;
        return hSliderThickness;
      }

      _onResizeOuter() {
        dispatchResizeEvent(this);
      }

      _onResizeContent() {
        dispatchResizeEvent(this);
      }

      get _resizeEventDetails() {
        const { width, fullWidth, height, fullHeight } = this.dimensionsAndCoordinates;
        const resizeContent = getResizeSensorContent(this);
        const {
          width: contentWidth,
          height: contentHeight,
          fullWidth: contentFullWidth,
          fullHeight: contentFullHeight
        } = resizeContent.dimensionsAndCoordinates;
        const resizeEventDetails = {
          width, fullWidth, height, fullHeight,
          contentWidth, contentHeight, contentFullWidth, contentFullHeight
        };
        return resizeEventDetails;
      }

      _applyDir() {
        const dir = isDbuiRTL(this) ? 'rtl' : 'ltr';
        this.dir = dir;
      }

      onLocaleDirChanged(newDir, oldDir) {
        // acts like an init
        super.onLocaleDirChanged(newDir, oldDir);
        this._applyDir();
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        getResizeSensorOuter(this).addEventListener('resize', this._onResizeOuter);
        getResizeSensorContent(this).addEventListener('resize', this._onResizeContent);
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

