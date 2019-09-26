
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUIResizeSensor from '../DBUIResizeSensor/DBUIResizeSensor';
import { trunc } from '../../../utils/math';
import {
  enumeration
} from '../../../utils/attributeNormalization';

export const DEFAULT_PERCENT_PRECISION = 4;
export const ALLOWED_OVERFLOW_VALUES = ['auto', 'scroll', 'hidden'];
export const DEFAULT_OVERFLOW_VALUE = 'scroll';

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

const dispatchReadyEvent = (self) => {
  self.dispatchDbuiEvent('dbui-event-ready', { detail: {} });
};

const _innerComponentsReady = {
  'resize-sensor-outer': false,
  'resize-sensor-content': false,
};

/*
TODO:
Do related unittests for different ways to trigger scroll.
*/

/*
Behavior Extras:
 - precision of scroll percent is configurable and defaults to 4
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
            /* all: initial; */
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
        return [...super.propertiesToUpgrade, 'overflow', 'hScroll', 'vScroll', 'percentPrecision'];
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'overflow', 'h-scroll', 'v-scroll', 'percent-precision'];
      }

      constructor() {
        super();
        this._onResizeOuter = this._onResizeOuter.bind(this);
        this._onResizeContent = this._onResizeContent.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this._onInnerComponentsReady = this._onInnerComponentsReady.bind(this);

        this._lastVScroll = 0;
        this._lastHScroll = 0;
        this._initialScrollApplied = false;
        this._innerComponentsReady = { ..._innerComponentsReady };
      }

      /**
       * Returns precision to be used when calculating percent
       * @return {number} integer
       */
      get percentPrecision() {
        return this.getAttribute('percent-precision') || DEFAULT_PERCENT_PRECISION;
      }

      /**
       * Sets precision to be used when calculating percent
       * @param value {number} integer
       */
      set percentPrecision(value) {
        const newValue = (Math.round(+value) || 0).toString();
        this.setAttribute('percent-precision', newValue);
      }

      /**
       * Returns overflow value auto || scroll || hidden
       * @return {string}
       */
      get overflow() {
        return enumeration(this.getAttribute('overflow'), ALLOWED_OVERFLOW_VALUES, DEFAULT_OVERFLOW_VALUE);
      }

      /**
       * Sets overflow value auto || scroll || hidden
       * @param value {string}
       */
      set overflow(value) {
        // setting invalid overflow value will return scroll on read
        this.setAttribute('overflow', enumeration(value, ALLOWED_OVERFLOW_VALUES, ''));
      }

      /**
       * Returns horizontal scroll as percentage between 0 and 1
       * @return {number}
       */
      get hScroll() {
        return +this.getAttribute('h-scroll') || 0;
      }

      /**
       * Sets horizontal scroll as percentage between 0 and 1
       * @param value {number}
       */
      set hScroll(value) {
        const _value = trunc(this.percentPrecision)(+value || 0);
        this.setAttribute('h-scroll', _value.toString());
      }

      /**
       * Returns vertical scroll as percentage between 0 and 1
       * @return {number}
       */
      get vScroll() {
        return +this.getAttribute('v-scroll') || 0;
      }

      /**
       * Sets vertical scroll as percentage between 0 and 1
       * @param value {number}
       */
      set vScroll(value) {
        const _value = trunc(this.percentPrecision)(+value || 0);
        this.setAttribute('v-scroll', _value.toString());
      }

      /**
       * Returns the ratio between horizontal with and horizontal content width
       * @return {number}
       */
      get hRatio() {
        return trunc(this.percentPrecision)(this.clientWidth / this.scrollWidth);
      }

      /**
       * Returns the ratio between horizontal height and horizontal content height
       * @return {number}
       */
      get vRatio() {
        return trunc(this.percentPrecision)(this.clientHeight / this.scrollHeight);
      }

      /**
       * Returns content width in pixels.
       * @return {number}
       */
      get scrollWidth() {
        return getResizeSensorOuter(this).scrollWidth;
      }

      /**
       * Returns content height in pixels.
       * @return {number}
       */
      get scrollHeight() {
        return getResizeSensorOuter(this).scrollHeight;
      }

      /**
       * Returns view width in pixels.
       * @return {number}
       */
      get clientWidth() {
        return getResizeSensorOuter(this).clientWidth;
      }

      /**
       * Returns view height in pixels.
       * @return {number}
       */
      get clientHeight() {
        return getResizeSensorOuter(this).clientHeight;
      }

      /**
       * Returns available scrolling width in pixels.
       * @return {number}
       */
      get scrollableWidth() {
        return this.scrollWidth - this.clientWidth;
      }

      /**
       * Returns available scrolling height in pixels.
       * @return {number}
       */
      get scrollableHeight() {
        return this.scrollHeight - this.clientHeight;
      }

      /**
       * Returns the amount of horizontal scroll in pixels
       * @return {number}
       */
      get scrollLeft() {
        const resizeOuter = getResizeSensorOuter(this);
        const _hScroll = Math.round(resizeOuter.scrollLeft);
        const hScroll = this.isDbuiRTL && this.hasNegativeRTLScroll ? -_hScroll :
          this.isDbuiRTL ? this.scrollableWidth - _hScroll :
            _hScroll;
        return hScroll;
      }

      /**
       * Sets The amount of horizontal scroll in pixels
       * @param value {number}
       */
      set scrollLeft(value) {
        getResizeSensorOuter(this).scrollLeft = this._normalizeHLocaleScroll(value);
      }

      /**
       * Returns the amount of vertical scroll in pixels
       * @return {number}
       */
      get scrollTop() {
        // on Chrome on Android scrollTop, scrollLeft is a decimal number => ex: 99.98...
        // even is explicitly set to integer => ex: 100
        return Math.round(getResizeSensorOuter(this).scrollTop);
      }

      /**
       * Sets The amount of vertical scroll in pixels
       * @param value {number}
       */
      set scrollTop(value) {
        getResizeSensorOuter(this).scrollTop = value;
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

      _applyOverflow() {
        getResizeSensorOuter(this).style.overflow = this.overflow;
      }

      _normalizeHLocaleScroll(value) {
        if (this.isDbuiRTL) {
          return this.hasNegativeRTLScroll ? -value : this.scrollableWidth - value;
        }
        return value;
      }

      _convertHScrollPercentageToPx(hScrollPercentage) {
        return Math.round(this.scrollableWidth * hScrollPercentage);
      }

      _convertVScrollPercentageToPx(vScrollPercentage) {
        return Math.round(this.scrollableHeight * vScrollPercentage);
      }

      _convertHScrollPxToPercentage(value) {
        if (this.scrollableWidth === 0) return 0;
        return trunc(this.percentPrecision)(value / this.scrollableWidth);
      }

      _convertVScrollPxToPercentage(value) {
        if (this.scrollableHeight === 0) return 0;
        return trunc(this.percentPrecision)(value / this.scrollableHeight);
      }

      _applyHScrollPercentage() {
        this.scrollLeft = this._convertHScrollPercentageToPx(this.hScroll);
      }

      _applyVScrollPercentage() {
        this.scrollTop = this._convertVScrollPercentageToPx(this.vScroll);
      }

      _applyHVScrollPercentage() {
        this._applyHScrollPercentage();
        this._applyVScrollPercentage();
      }

      _onResizeOuter() {
        this._onScroll();
        this.dispatchDbuiEvent('dbui-event-resize', {
          detail: this._resizeEventDetails
        });
      }

      _onResizeContent() {
        this._onScroll();
        this.dispatchDbuiEvent('dbui-event-resize', {
          detail: this._resizeEventDetails
        });
      }

      get _isProgrammaticScroll() {
        const hScroll = this.hScroll;
        const vScroll = this.vScroll;
        const lastHScroll = this._lastHScroll;
        const lastVScroll = this._lastVScroll;
        const _isProgrammaticScroll = vScroll !== lastVScroll || hScroll !== lastHScroll;
        return _isProgrammaticScroll;
      }

      _onScroll() {
        if (!this._initialScrollApplied) return;
        // When hvScroll was set programmatically resulting in a scroll event
        // there is no need to set hvScroll again from internal calculation
        const _isProgrammaticScroll = this._isProgrammaticScroll;
        if (_isProgrammaticScroll) {
          this._lastHScroll = this.hScroll;
          this._lastVScroll = this.vScroll;
          this.dispatchDbuiEvent('dbui-event-scroll-occurred');
          return;
        }
        this._lastHScroll = this._convertHScrollPxToPercentage(this.scrollLeft);
        this._lastVScroll = this._convertVScrollPxToPercentage(this.scrollTop);
        this.hScroll = this._lastHScroll;
        this.vScroll = this._lastVScroll;
        this.dispatchDbuiEvent('dbui-event-scroll-occurred');
        this.dispatchDbuiEvent('dbui-event-scroll', { detail: {} });
      }

      _onInnerComponentsReady(evt) {
        this._innerComponentsReady[evt.target.id] = true;
        if (Object.values(this._innerComponentsReady).every(v => v)) {
          // _applyHVScrollPercentage when dimensions are established
          if (!this.isMounted) return;
          this._initialScrollApplied = true;
          this._applyHVScrollPercentage(); // will dispatch a scroll event.
          dispatchReadyEvent(this);
        }
      }

      onLocaleDirChanged(newDir, oldDir) {
        super.onLocaleDirChanged(newDir, oldDir);
        getResizeSensorOuter(this).dir = newDir;
        if (!this._initialScrollApplied) return;
        this._applyHVScrollPercentage();
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        getResizeSensorOuter(this).addEventListener('scroll', this._onScroll);
        getResizeSensorOuter(this).addEventListener('dbui-event-resize', this._onResizeOuter);
        getResizeSensorContent(this).addEventListener('dbui-event-resize', this._onResizeContent);
        getResizeSensorOuter(this).addEventListener('dbui-event-ready', this._onInnerComponentsReady);
        getResizeSensorContent(this).addEventListener('dbui-event-ready', this._onInnerComponentsReady);
        this._applyOverflow();
        // For Safari, which, when overflow is changed at runtime,
        // it thinks it has content to scroll when there is not the case.
        // Forcing a scroll re-calculation;
        const div = win.document.createElement('div');
        this.appendChild(div);
        div.remove();
      }

      onDisconnectedCallback() {
        super.onDisconnectedCallback();
        getResizeSensorOuter(this).removeEventListener('scroll', this._onScroll);
        getResizeSensorOuter(this).removeEventListener('dbui-event-resize', this._onResizeOuter);
        getResizeSensorContent(this).removeEventListener('dbui-event-resize', this._onResizeContent);
        getResizeSensorOuter(this).removeEventListener('dbui-event-ready', this._onInnerComponentsReady);
        getResizeSensorContent(this).removeEventListener('dbui-event-ready', this._onInnerComponentsReady);
        this._innerComponentsReady = { ..._innerComponentsReady };
      }

      onAttributeChangedCallback(name, oldValue, newValue) {
        super.onAttributeChangedCallback(name, oldValue, newValue);
        switch (name) {
          case 'overflow': {
            this._applyOverflow();
            break;
          }
          case 'h-scroll': {
            if (this._initialScrollApplied && +newValue !== +this._lastHScroll) {
              this._applyHScrollPercentage();
            }
            break;
          }
          case 'v-scroll': {
            if (this._initialScrollApplied && +newValue !== +this._lastVScroll) {
              this._applyVScrollPercentage();
            }
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

