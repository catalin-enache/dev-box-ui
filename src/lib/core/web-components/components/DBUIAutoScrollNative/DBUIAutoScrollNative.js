
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
            /* overflow: scroll; */ /* set at runtime */
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
        this._onScroll = this._onScroll.bind(this);
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

      _setScroll() {
        if (this.id !== 'dbui-auto-scroll-native') {
          return;
        }
        // Do a feature detection here to detect negative scroll on rtl
        const isRtl = isDbuiRTL(this);
        const resizeOuter = getResizeSensorOuter(this);
        const resizeContent = getResizeSensorContent(this);
        const scrollableWidth = resizeOuter.scrollWidth - resizeOuter.clientWidth;
        const newScrollLeft = isRtl ? scrollableWidth - 50 : 50;
        console.log('AutoScroll#_setScroll', {
          hasNegativeRTLScroll: this.hasNegativeRTLScroll,
          scrollableWidth
        });

        resizeOuter.scrollLeft = newScrollLeft;
      }

      _onResizeOuter() {
        dispatchResizeEvent(this);
      }

      _onResizeContent() {
        dispatchResizeEvent(this);
      }

      _onScroll(evt) {
        const resizeContent = evt.target;
        console.log('AutoScroll#_onScroll', resizeContent.scrollLeft);
      }

      get _resizeEventDetails() {
        const resizeOuter = getResizeSensorOuter(this);
        const resizeContent = getResizeSensorContent(this);
        const { width, fullWidth, height, fullHeight } =
          resizeOuter.dimensionsAndCoordinates;
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

      onLocaleDirChanged(newDir, oldDir) {
        super.onLocaleDirChanged(newDir, oldDir);
        getResizeSensorOuter(this).dir = newDir;
        if (!this.isMounted) return;
        this._setScroll();
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        getResizeSensorOuter(this).addEventListener('scroll', this._onScroll);
        getResizeSensorOuter(this).addEventListener('resize', this._onResizeOuter);
        getResizeSensorContent(this).addEventListener('resize', this._onResizeContent);
        this._setOverflow();
        this._setScroll();
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

