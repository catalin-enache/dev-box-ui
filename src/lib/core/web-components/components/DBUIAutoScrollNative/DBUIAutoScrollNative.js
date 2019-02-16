
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

const dispatchScrollEvent = (self) => {
  const win = self.ownerDocument.defaultView;
  self.dispatchEvent(new win.CustomEvent('scroll', {
    detail: {}
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
        return [...super.propertiesToUpgrade, 'overflow', 'hScroll', 'vScroll'];
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'overflow', 'h-scroll', 'v-scroll'];
      }

      constructor() {
        super();
        this._onResizeOuter = this._onResizeOuter.bind(this);
        this._onResizeContent = this._onResizeContent.bind(this);
        this._onScroll = this._onScroll.bind(this);
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
       * Returns content width in pixels.
       * @return {number}
       */
      get _scrollWidth() {
        return getResizeSensorOuter(this).scrollWidth;
      }

      /**
       * Returns content height in pixels.
       * @return {number}
       */
      get _scrollHeight() {
        return getResizeSensorOuter(this).scrollHeight;
      }

      /**
       * Returns view width in pixels.
       * @return {number}
       */
      get _clientWidth() {
        return getResizeSensorOuter(this).clientWidth;
      }

      /**
       * Returns view height in pixels.
       * @return {number}
       */
      get _clientHeight() {
        return getResizeSensorOuter(this).clientHeight;
      }

      /**
       * Returns available scrolling width in pixels.
       * @return {number}
       */
      get _scrollableWidth() {
        return this._scrollWidth - this._clientWidth;
      }

      /**
       * Returns available scrolling height in pixels.
       * @return {number}
       */
      get _scrollableHeight() {
        return this._scrollHeight - this._clientHeight;
      }

      /**
       * Returns the amount of horizontal scroll in pixels
       * @return {number}
       */
      get _scrollLeft() {
        const resizeOuter = getResizeSensorOuter(this);
        const _hScroll = resizeOuter.scrollLeft;
        const hScroll = isDbuiRTL(this) && this.hasNegativeRTLScroll ? -_hScroll :
          isDbuiRTL(this) ? this._scrollableWidth - _hScroll :
            _hScroll;
        return hScroll;
      }

      /**
       * Sets The amount of horizontal scroll in pixels
       * @param value {number}
       */
      set _scrollLeft(value) {
        getResizeSensorOuter(this).scrollLeft = this._normalizeHLocaleScroll(value);
      }

      /**
       * Returns the amount of vertical scroll in pixels
       * @return {number}
       */
      get _scrollTop() {
        return getResizeSensorOuter(this).scrollTop;
      }

      /**
       * Sets The amount of vertical scroll in pixels
       * @param value {number}
       */
      set _scrollTop(value) {
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
          return this.hasNegativeRTLScroll ? -value : this._scrollableWidth - value;
        }
        return value;
      }

      _convertHScrollPercentageToPx(hScrollPercentage) {
        return this._scrollableWidth * hScrollPercentage;
      }

      _convertVScrollPercentageToPx(vScrollPercentage) {
        return this._scrollableHeight * vScrollPercentage;
      }

      _convertHScrollPxToPercentage(value) {
        if (this._scrollableWidth === 0) return 0;
        return +(value / this._scrollableWidth).toFixed(2);
      }

      _convertVScrollPxToPercentage(value) {
        if (this._scrollableHeight === 0) return 0;
        return +(value / this._scrollableHeight).toFixed(2);
      }

      _applyHScrollPercentage() {
        this._scrollLeft = this._convertHScrollPercentageToPx(this.hScroll);
      }

      _applyVScrollPercentage() {
        this._scrollTop = this._convertVScrollPercentageToPx(this.vScroll);
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
        this.hScroll = this._convertHScrollPxToPercentage(this._scrollLeft);
        this.vScroll = this._convertVScrollPxToPercentage(this._scrollTop);
        dispatchScrollEvent(this);
      }

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
          this._applyHVScrollPercentage();
        }, 0);
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
            this._applyOverflow();
            break;
          }
          case 'h-scroll': {
            this._applyHScrollPercentage();
            break;
          }
          case 'v-scroll': {
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

