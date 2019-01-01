
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUISlider from '../DBUISlider/DBUISlider';
import { trunc, STEP_PRECISION } from '../../../utils/math';

const SCROLL_PRECISION = STEP_PRECISION;

const isDbuiRTL = (self) => {
  return self.getAttribute('dbui-dir') === 'rtl';
};

const getOuter = (self) => {
  if (self._outer) {
    return self._outer;
  }
  self._outer = self.shadowRoot.querySelector('#outer');
  return self._outer;
};

const getMiddle = (self) => {
  if (self._middle) {
    return self._middle;
  }
  self._middle = self.shadowRoot.querySelector('#middle');
  return self._middle;
};

const getInner = (self) => {
  if (self._inner) {
    return self._inner;
  }
  self._inner = self.shadowRoot.querySelector('#inner');
  return self._inner;
};

const getContent = (self) => {
  if (self._content) {
    return self._content;
  }
  self._content = self.shadowRoot.querySelector('#content');
  return self._content;
};

const getResizeSensor = (self) => {
  if (self._resizeSensor) {
    return self._resizeSensor;
  }
  self._resizeSensor = self.shadowRoot.querySelector('#resize-sensor');
  return self._resizeSensor;
};

const getHSlider = (self) => {
  if (self._hSlider) {
    return self._hSlider;
  }
  self._hSlider = self.shadowRoot.querySelector('#horizontal-slider');
  return self._hSlider;
};

const getVSlider = (self) => {
  if (self._vSlider) {
    return self._vSlider;
  }
  self._vSlider = self.shadowRoot.querySelector('#vertical-slider');
  return self._vSlider;
};

const registrationName = 'dbui-scrollable';

const DBUIScrollableCssVars = `
  :root {
    --dbui-scrollable-horizontal-slider-thickness: 8px;
    --dbui-scrollable-vertical-slider-thickness: 8px;
    --dbui-scrollable-slider-outer-padding: 0px;
  }
`;

function defineComponentCSS(win) {
  const { document } = win;
  const commonCSSVarsStyleNode = document.querySelector('[dbui-common-css-vars]');
  commonCSSVarsStyleNode.innerHTML += DBUIScrollableCssVars;
}

/*
TODO:
 - 0 should be to the right when percent is 0 and rtl
 - onResize percent becomes 1 (scrollableContent.appendChild(dynamicContent)). Fix it !
 - No scrollbar should appear if no scroll needed (this should be calculated on resize or when needed).
 - Showing Custom Scrollbar should be optional ?
 - No Scrollbar if mobile, show-scrollbar should be auto or always/never
 - Use ResizeObserver where available ?
 - Make a horizontal default scrolling somehow via attributes (ex: for gallery thumbnails).
   https://css-tricks.com/pure-css-horizontal-scrolling/
 - Extract resize-sensor into its own component.
 - allow consumer to set the percent precision with default fallback
 - allow consumer to set the slider thickness ? with default fallback
 - dispatch h,v scroll events ?
 - make horizontal scrollable (ex: for slide-show thumbnails)
*/


export default function getDBUIScrollable(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    defineComponentCSS(win);

    const DBUISlider = getDBUISlider(win);

    class DBUIScrollable extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get templateInnerHTML() {
        return `
          <style>
          :host {
            /*all: initial;*/
            display: block;
          }
          
          :host([dbui-dir=ltr]) {
            /* pass */
          }
          
          :host([dbui-dir=rtl]) {
            /* pass */
          }
          
          #outer {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            /*box-sizing: border-box;*/
          }
          
          #middle {
            width: 100%;
            height: 100%;
            overflow: scroll;
            /* padding: 0px 15px 15px 0px; */ /* overridden onLocaleDirChanged */
          }
          
          #inner {
            /* width: calc(100% + 15px); */ /* overridden onLocaleDirChanged */
            /* height: calc(100% + 15px); */ /* overridden onLocaleDirChanged */
          }
          
          #content {
            position: relative;
            z-index: -1;
            display: inline-block;
          }
          
          #resize-sensor {
            display: block;
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            background-color: transparent;
            z-index: -1;
            overflow: hidden;
            pointer-events: none;
            border: none;
            padding: 0px;
            margin: 0px;
          }
          
          dbui-slider {
            position: absolute;
            --dbui-slider-outer-padding: var(--dbui-scrollable-slider-outer-padding);
          }
          
          #horizontal-slider {
            bottom: 0px;
            width: calc(100% - var(--dbui-scrollable-vertical-slider-thickness));
            height: var(--dbui-scrollable-horizontal-slider-thickness);
          }
          
          #vertical-slider {
            top: 0px;
            width: var(--dbui-scrollable-vertical-slider-thickness);
            height: calc(100% - var(--dbui-scrollable-horizontal-slider-thickness));
          }
          
          :host([dbui-dir=ltr]) #horizontal-slider {
            left: 0px;
          }
          
          :host([dbui-dir=ltr]) #vertical-slider {
            right: 0px;
          }
          
          :host([dbui-dir=rtl]) #horizontal-slider {
            right: 0px;
          }
          
          :host([dbui-dir=rtl]) #vertical-slider {
            left: 0px;
          }
          
          </style>
          <div id="outer">
            <dbui-slider id="horizontal-slider" debug-show-value></dbui-slider>
            <dbui-slider id="vertical-slider" dir="ltr" vertical debug-show-value></dbui-slider>
            <div id="middle">
              <div id="inner">
                <div id="content">
                  <iframe id="resize-sensor" src=""></iframe>
                  <slot></slot>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      static get dependencies() {
        return [...super.dependencies, DBUISlider];
      }

      static get propertiesToUpgrade() {
        return [...super.propertiesToUpgrade, 'hScroll', 'vScroll'];
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'h-scroll', 'v-scroll'];
      }

      constructor() {
        super();

        // cached nodes
        this._outer = null;
        this._middle = null;
        this._inner = null;
        this._content = null;
        this._resizeSensor = null;
        this._hSlider = null;
        this._vSlider = null;

        // callbacks
        this._onResize = this._onResize.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this._onHSlide = this._onHSlide.bind(this);
        this._onVSlide = this._onVSlide.bind(this);
        this._onHSliderMouseEnter = this._onHSliderMouseEnter.bind(this);
        this._onHSliderMouseLeave = this._onHSliderMouseLeave.bind(this);
        this._onVSliderMouseEnter = this._onVSliderMouseEnter.bind(this);
        this._onVSliderMouseLeave = this._onVSliderMouseLeave.bind(this);

        this._isHSliding = false;
        this._isVSliding = false;
        this._isScrolling = false;
      }

      onLocaleDirChanged(newDir, oldDir) {
        // acts like an init
        super.onLocaleDirChanged(newDir, oldDir);
        this._applyDirAndOffsets();
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        getMiddle(this).addEventListener('scroll', this._onScroll);
        getResizeSensor(this).contentWindow.addEventListener('resize', this._onResize);
        const hSlider = getHSlider(this);
        const vSlider = getVSlider(this);
        hSlider.addEventListener('slidemove', this._onHSlide);
        vSlider.addEventListener('slidemove', this._onVSlide);
        hSlider.addEventListener('mouseenter', this._onHSliderMouseEnter);
        hSlider.addEventListener('mouseleave', this._onHSliderMouseLeave);
        vSlider.addEventListener('mouseenter', this._onVSliderMouseEnter);
        vSlider.addEventListener('mouseleave', this._onVSliderMouseLeave);
      }

      onDisconnectedCallback() {
        super.onDisconnectedCallback();
        getMiddle(this).removeEventListener('scroll', this._onScroll);
        getResizeSensor(this).contentWindow.removeEventListener('resize', this._onResize);
        const hSlider = getHSlider(this);
        const vSlider = getVSlider(this);
        hSlider.removeEventListener('slide', this._onHSlide);
        vSlider.removeEventListener('slide', this._onVSlide);
        hSlider.removeEventListener('mouseenter', this._onHSliderMouseEnter);
        hSlider.removeEventListener('mouseleave', this._onHSliderMouseLeave);
        vSlider.removeEventListener('mouseenter', this._onVSliderMouseEnter);
        vSlider.removeEventListener('mouseleave', this._onVSliderMouseLeave);
      }

      onAttributeChangedCallback(name, oldValue, newValue) {
        super.onAttributeChangedCallback(name, oldValue, newValue);
        if (!this.isMounted) return;
        switch (name) {
          case 'h-scroll': {
            !this._isScrolling && this._adjustHScroll();
            break;
          }
          case 'v-scroll': {
            !this._isScrolling && this._adjustVScroll();
            break;
          }
          default:
            // pass
        }
      }

      // -------------------- public getters/setters ------------------------


      /**
       * Returns vertical scroll percent from 0 to 1.
       * @return {number}
       */
      get vScroll() {
        return +this.getAttribute('v-scroll') || 0;
      }

      /**
       * Sets vertical scroll percent from 0 to 1.
       * @param value {number}
       */
      set vScroll(value) {
        const newValue = trunc(SCROLL_PRECISION)(+value);
        this.setAttribute('v-scroll', newValue);
      }

      /**
       * Returns horizontal scroll percent from 0 to 1.
       * @return {number}
       */
      get hScroll() {
        return +this.getAttribute('h-scroll') || 0;
      }

      /**
       * Sets horizontal scroll percent from 0 to 1.
       * @param value {number}
       */
      set hScroll(value) {
        const newValue = trunc(SCROLL_PRECISION)(+value);
        this.setAttribute('h-scroll', newValue);
      }


      // -------------------- private getters ------------------------

      /**
       * Returns native vertical slider thickness in pixels.
       * @return {number}
       */
      get _vNativeSliderThickness() {
        const middle = getMiddle(this);
        const vSliderThickness = middle.offsetWidth - middle.clientWidth;
        return vSliderThickness;
      }

      /**
       * Returns native horizontal slider thickness in pixels.
       * @return {number}
       */
      get _hNativeSliderThickness() {
        const middle = getMiddle(this);
        const hSliderThickness = middle.offsetHeight - middle.clientHeight;
        return hSliderThickness;
      }

      /**
       * Returns custom horizontal/vertical slider thickness in pixels.
       * @return {object} { hCustomSliderThickness: number, vCustomSliderThickness: number }
       */
      get _hvCustomSliderThickness() {
        const computedStyle = win.getComputedStyle(this);
        const hCustomSliderThickness = win.parseInt(computedStyle
          .getPropertyValue('--dbui-scrollable-horizontal-slider-thickness'));
        const vCustomSliderThickness = win.parseInt(computedStyle
          .getPropertyValue('--dbui-scrollable-vertical-slider-thickness'));
        return { hCustomSliderThickness, vCustomSliderThickness };
      }

      /**
       * Returns calculated horizontal slider ratio from 0 to 1.
       * @return {number}
       */
      get _hSliderRatio() {
        const _scrollWidth = this._scrollWidth;
        const _clientWidth = this._clientWidth;
        if (_scrollWidth === 0) {
          return 0;
        }
        const hSliderRatio = trunc(SCROLL_PRECISION)(_clientWidth / _scrollWidth);
        return hSliderRatio;
      }

      /**
       * Returns calculated vertical slider ratio from 0 to 1.
       * @return {number}
       */
      get _vSliderRatio() {
        const _scrollHeight = this._scrollHeight;
        const _clientHeight = this._clientHeight;
        if (_scrollHeight === 0) {
          return 0;
        }
        const vSliderRatio = trunc(SCROLL_PRECISION)(_clientHeight / _scrollHeight);
        return vSliderRatio;
      }

      /**
       * Returns content width in pixels.
       * @return {number}
       */
      get _scrollWidth() {
        const middle = getMiddle(this);
        const scrollWidth = middle.scrollWidth;
        return scrollWidth;
      }

      /**
       * Returns content height in pixels.
       * @return {number}
       */
      get _scrollHeight() {
        const middle = getMiddle(this);
        const scrollHeight = middle.scrollHeight;
        return scrollHeight;
      }

      /**
       * Returns view width in pixels.
       * @return {number}
       */
      get _clientWidth() {
        const middle = getMiddle(this);
        const clientWidth = middle.clientWidth;
        return clientWidth;
      }

      /**
       * Returns view height in pixels.
       * @return {number}
       */
      get _clientHeight() {
        const middle = getMiddle(this);
        const clientHeight = middle.clientHeight;
        return clientHeight;
      }

      /**
       * Returns available scrolling width in pixels.
       * @return {number}
       */
      get _scrollableWidth() {
        const scrollableWidth = this._scrollWidth - this._clientWidth;
        return scrollableWidth;
      }

      /**
       * Returns available scrolling height in pixels.
       * @return {number}
       */
      get _scrollableHeight() {
        const scrollableHeight = this._scrollHeight - this._clientHeight;
        return scrollableHeight;
      }

      /**
       * Transforms horizontal percent in pixels to scroll.
       * @return {number}
       */
      get _hScrollToScrollLeft() {
        const _scrollableWidth = this._scrollableWidth;
        const hScroll = this.hScroll;
        const _hScrollToScrollLeft = Math.round(_scrollableWidth * hScroll);
        const localeHScrollToScrollLeft = isDbuiRTL(this) ?
          this._scrollableWidth - _hScrollToScrollLeft :
          _hScrollToScrollLeft;
        return localeHScrollToScrollLeft;
      }

      /**
       * Transforms vertical percent in pixels to scroll.
       * @return {number}
       */
      get _vScrollToScrollTop() {
        const _scrollableHeight = this._scrollableHeight;
        const vScroll = this.vScroll;
        const vScrollToScrollTop = Math.round(_scrollableHeight * vScroll);
        return vScrollToScrollTop;
      }

      /**
       * Returns calculated horizontal scroll in pixels.
       * @return {number}
       */
      get _hScroll() {
        const middle = getMiddle(this);
        const _scrollableWidth = this._scrollableWidth;
        const _hScroll = isDbuiRTL(this) ? _scrollableWidth - middle.scrollLeft : middle.scrollLeft;
        return _hScroll;
      }

      /**
       * Returns calculated vertical scroll in pixels.
       * @return {number}
       */
      get _vScroll() {
        const middle = getMiddle(this);
        const _vScroll = middle.scrollTop;
        return _vScroll;
      }

      /**
       * Returns calculated horizontal scroll ratio from 0 to 1.
       * @return {number}
       */
      get _hScrollRatio() {
        const _scrollableWidth = this._scrollableWidth;
        if (_scrollableWidth === 0) {
          return 0;
        }
        const _hScroll = this._hScroll;
        const _hScrollRatio = trunc(SCROLL_PRECISION)(_hScroll / _scrollableWidth);
        return _hScrollRatio;
      }

      /**
       * Returns calculated vertical scroll ratio from 0 to 1.
       * @return {number}
       */
      get _vScrollRatio() {
        const _scrollableHeight = this._scrollableHeight;
        if (_scrollableHeight === 0) {
          return 0;
        }
        const _vScroll = this._vScroll;
        const _vScrollRatio = trunc(SCROLL_PRECISION)(_vScroll / _scrollableHeight);
        return _vScrollRatio;
      }

      /**
       * @return {boolean}
       */
      get _isScrollTriggeredBySliders() {
        const hSlider = getHSlider(this);
        const vSlider = getVSlider(this);
        return this._isHSliding || this._isVSliding || hSlider.isSliding || vSlider.isSliding;
      }

      get _hasNativeSliders() {
        return !!this._vNativeSliderThickness;
      }

      // -------------------- private methods ------------------------

      /**
       * Sets horizontal scroll.
       */
      _adjustHScroll() {
        const middle = getMiddle(this);
        middle.scrollLeft = this._hScrollToScrollLeft;
      }

      /**
       * Sets vertical scroll.
       */
      _adjustVScroll() {
        const middle = getMiddle(this);
        middle.scrollTop = this._vScrollToScrollTop;
      }

      /**
       * Sets horizontal slider position.
       */
      _adjustHSliderPosition() {
        const hSlider = getHSlider(this);
        const _hScrollRatio = this._hScrollRatio;
        hSlider.percent = _hScrollRatio;
      }

      /**
       * Sets vertical slider position.
       */
      _adjustVSliderPosition() {
        const vSlider = getVSlider(this);
        const _vScrollRatio = this._vScrollRatio;
        vSlider.percent = _vScrollRatio;
      }

      _applyDirAndOffsets() {
        const outer = getOuter(this);
        const middle = getMiddle(this);
        const inner = getInner(this);
        const content = getContent(this);
        const resizeSensor = getResizeSensor(this);
        const hSlider = getHSlider(this);
        const vSlider = getVSlider(this);
        const vNativeScrollbarThickness = this._vNativeSliderThickness;
        const hNativeScrollbarThickness = this._hNativeSliderThickness;

        console.log('_applyDirAndOffsets 1', middle.clientHeight, middle.scrollHeight);

        [outer, middle, inner, content, resizeSensor].forEach((node) =>
          node.dir = 'ltr'
        );

        const { hCustomSliderThickness, vCustomSliderThickness } =
          this._hvCustomSliderThickness;

        // hide native scrollbars
        middle.style.padding =
           `0px ${vNativeScrollbarThickness}px ${hNativeScrollbarThickness}px 0px`;
        inner.style.width = `calc(100% + ${vNativeScrollbarThickness}px)`;
        inner.style.height = `calc(100% + ${hNativeScrollbarThickness}px)`;

        // make room for custom scrollbars
        content.style.padding = isDbuiRTL(this) ?
          `0px 0px ${hCustomSliderThickness}px ${vCustomSliderThickness}px` :
          `0px ${vCustomSliderThickness}px ${hCustomSliderThickness}px 0px`;

        this._adjustHScroll();
        this._adjustVScroll();

        hSlider.ratio = this._hSliderRatio;
        vSlider.ratio = this._vSliderRatio;

        console.log('_applyDirAndOffsets 2', middle.clientHeight, middle.scrollHeight);
      }

      // -------------------- listeners ------------------------

      _onResize() {
        const middle = getMiddle(this);
        console.log('_onResize', middle.clientHeight, middle.scrollHeight);
        const hSlider = getHSlider(this);
        const vSlider = getVSlider(this);
        hSlider.ratio = this._hSliderRatio;
        vSlider.ratio = this._vSliderRatio;
        // The sliders will auto-update position themselves
        // but we need to re-adapt their position in relation with new size.
        this._adjustHSliderPosition();
        this._adjustVSliderPosition();

        // Need to update hvScrolls to be reflected in component attributes.
        // Be aware of loops here (no loops so far).
        this._isScrolling = true;
        this.hScroll = this._hScrollRatio;
        this.vScroll = this._vScrollRatio;
        this._isScrolling = false;
      }

      _onScroll() {
        if (this._isScrollTriggeredBySliders) {
          return;
        }
        this._isScrolling = true;
        this.hScroll = this._hScrollRatio;
        this.vScroll = this._vScrollRatio;

        const _hScroll = this._hScroll;
        const _vScroll = this._vScroll;
        console.log('_onScroll', { _hScroll, _vScroll });

        this._adjustHSliderPosition();
        this._adjustVSliderPosition();

        this._isScrolling = false;
      }

      _onHSlide(evt) {
        const { percent: hPercent } = evt.detail;
        console.log('_onHSlide', hPercent);
        this.hScroll = hPercent;
      }

      _onVSlide(evt) {
        const { percent: vPercent } = evt.detail;
        console.log('_onVSlide', vPercent);
        this.vScroll = vPercent;
      }

      _onHSliderMouseEnter() {
        this._isHSliding = true;
      }

      _onHSliderMouseLeave() {
        this._isHSliding = false;
      }

      _onVSliderMouseEnter() {
        this._isVSliding = true;
      }

      _onVSliderMouseLeave() {
        this._isVSliding = false;
      }

    }

    return Registerable(
      defineCommonStaticMethods(
        DBUIScrollable
      )
    );
  });
}

getDBUIScrollable.registrationName = registrationName;

