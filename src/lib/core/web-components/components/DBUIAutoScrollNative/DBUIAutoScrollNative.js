
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUIResizeSensor from '../DBUIResizeSensor/DBUIResizeSensor';
import { trunc } from '../../../utils/math';

export const DEFAULT_PERCENT_PRECISION = 4;

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
    // TODO: prefix the event with dbui-event
    detail: self._resizeEventDetails
  }));
};

const dispatchScrollEvent = (self) => {
  const win = self.ownerDocument.defaultView;
  self.dispatchEvent(new win.CustomEvent('scroll', {
    // TODO: prefix the event with dbui-event
    detail: {}
  }));
};

/*
TODO:
Finish userControlled behavior and do related unittests.
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

        ['_onMouseDown', '_onDocumentMouseUp',
          '_onMouseEnter', '_onMouseLeave',
          '_onTouchStart', '_onDocumentTouchEnd'].forEach((listener) => {
          this[listener] = this[listener].bind(this);
        });

        this._hasNativeScrollControl = false;
        this._mouseIn = false;
        this._mouseDown = false;
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
        const overflow = this.getAttribute('overflow');
        return ['auto', 'scroll', 'hidden'].includes(overflow) ? overflow : 'scroll';
      }

      /**
       * Sets overflow value auto || scroll || hidden
       * @param value {string}
       */
      set overflow(value) {
        // setting invalid overflow value will return scroll on read
        const overflow = ['auto', 'scroll', 'hidden'].includes(value) ? value : '';
        this.setAttribute('overflow', overflow);
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
        this.setAttribute('h-scroll', (+value || 0).toString());
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
        this.setAttribute('v-scroll', (+value || 0).toString());
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
        const _hScroll = resizeOuter.scrollLeft;
        const hScroll = isDbuiRTL(this) && this.hasNegativeRTLScroll ? -_hScroll :
          isDbuiRTL(this) ? this.scrollableWidth - _hScroll :
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
        return getResizeSensorOuter(this).scrollTop;
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
        if (isDbuiRTL(this)) {
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
        dispatchResizeEvent(this);
      }

      _onResizeContent() {
        dispatchResizeEvent(this);
      }

      _onScroll() {
        // When hvScroll was set programmatically resulting in a scroll event
        // there is no need to set hvScroll again from internal calculation
        if (!this._hasNativeScrollControl) return;
        this.hScroll = this._convertHScrollPxToPercentage(this.scrollLeft);
        this.vScroll = this._convertVScrollPxToPercentage(this.scrollTop);
        dispatchScrollEvent(this);
      }

      // =========== controlling the dispatch of scroll event only when _hasNativeScrollControl >> =======

      _onMouseDown(evt) {
        this._mouseDown = evt.buttons === 1; // so that right click acts like a mouse up
        win.getSelection && win.getSelection().removeAllRanges();
        // If not clearing current selection, then, on second mousedown on AutoScrollNative
        // followed by dragging outside, browser will try to move the current selection and NOT fire mouseup.
        // We're also listening for dragend as a secondary measure.
      }

      _onDocumentMouseUp() {
        this._mouseDown = false;
        // Addressing the case where mousedown on content,
        // then moves from content area unto custom scroll and start scrolling.
        this._hasNativeScrollControl = this._mouseIn;
      }

      _onMouseEnter(evt) {
        this._mouseIn = true;
        this._hasNativeScrollControl = evt.buttons !== 1;
        // Addressing the case where mouseup is fired outside document.
        if (evt.buttons !== 1) {
          this._mouseDown = false;
        }
      }

      _onMouseLeave() {
        this._mouseIn = false;
        // Addressing the case where mouse moves from content area
        // unto custom scroll and start scrolling.
        this._hasNativeScrollControl = this._mouseDown;
      }

      _onTouchStart() {
        this._hasNativeScrollControl = true;
        win.getSelection && win.getSelection().removeAllRanges();
      }

      _onDocumentTouchEnd() {
        this._hasNativeScrollControl = false;
      }

      // =========== << controlling the dispatch of scroll event only when _hasNativeScrollControl =======

      onLocaleDirChanged(newDir, oldDir) {
        super.onLocaleDirChanged(newDir, oldDir);
        getResizeSensorOuter(this).dir = newDir;
        if (!this.isMounted) return;
        this._applyHVScrollPercentage();
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        getResizeSensorOuter(this).addEventListener('scroll', this._onScroll);
        getResizeSensorOuter(this).addEventListener('resize', this._onResizeOuter);
        getResizeSensorContent(this).addEventListener('resize', this._onResizeContent);
        this._applyOverflow();
        setTimeout(() => {
          // In order to apply initial scroll it is needed to ignore eventual
          // mouse being on top of the this when this was just connected.
          const hasNativeScrollControl = this._hasNativeScrollControl;
          this._hasNativeScrollControl = false;
          this._applyHVScrollPercentage(); // will dispatch a scroll event.
          setTimeout(() => {
            // Set back _hasNativeScrollControl to its original value.
            this._hasNativeScrollControl = hasNativeScrollControl;
          }, 0);
        }, 0);
        this.addEventListener('mousedown', this._onMouseDown);
        this.addEventListener('mouseenter', this._onMouseEnter);
        this.addEventListener('mouseleave', this._onMouseLeave);
        this.addEventListener('touchstart', this._onTouchStart);
        this.ownerDocument.addEventListener('mouseup', this._onDocumentMouseUp);
        this.ownerDocument.addEventListener('dragend', this._onDocumentMouseUp);
        this.ownerDocument.addEventListener('touchend', this._onDocumentTouchEnd);
        this.ownerDocument.addEventListener('touchcancel', this._onDocumentTouchEnd);
      }

      onDisconnectedCallback() {
        super.onDisconnectedCallback();
        getResizeSensorOuter(this).removeEventListener('resize', this._onResizeOuter);
        getResizeSensorContent(this).removeEventListener('resize', this._onResizeContent);
        this.removeEventListener('mousedown', this._onMouseDown);
        this.removeEventListener('mouseenter', this._onMouseEnter);
        this.removeEventListener('mouseleave', this._onMouseLeave);
        this.removeEventListener('touchstart', this._onTouchStart);
        this.ownerDocument.removeEventListener('mouseup', this._onDocumentMouseUp);
        this.ownerDocument.removeEventListener('dragend', this._onDocumentMouseUp);
        this.ownerDocument.removeEventListener('touchend', this._onDocumentTouchEnd);
        this.ownerDocument.removeEventListener('touchcancel', this._onDocumentTouchEnd);
      }

      onAttributeChangedCallback(name, oldValue, newValue) {
        super.onAttributeChangedCallback(name, oldValue, newValue);
        if (!this.isMounted) return;
        switch (name) {
          case 'overflow': {
            this._applyOverflow();
            break;
          }
          case 'h-scroll': {
            // Is hvScroll was NOT set programmatically but was triggered by user (native scroll)
            // then top/leftScroll are already set (content is already scrolled)
            // so there is no need to calculate hvScroll again to set it programmatically.
            if (this._hasNativeScrollControl) return;
            this._applyHScrollPercentage();
            break;
          }
          case 'v-scroll': {
            if (this._hasNativeScrollControl) return;
            this._applyVScrollPercentage();
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

