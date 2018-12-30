
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUISlider from '../DBUISlider/DBUISlider';
import { trunc, STEP_PRECISION } from '../../../utils/math';

const SLIDER_THICKNESS = 8;
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
            background-color: bisque;
            z-index: -1;
            overflow: hidden;
            pointer-events: none;
          }
          
          dbui-slider {
            position: absolute;
            --dbui-slider-outer-padding: 0px;
          }
          
          #horizontal-slider {
            bottom: 0px;
            width: calc(100% - ${SLIDER_THICKNESS}px);
            height: ${SLIDER_THICKNESS}px;
          }
          
          #vertical-slider {
            top: 0px;
            width: ${SLIDER_THICKNESS}px;
            height: calc(100% - ${SLIDER_THICKNESS}px);
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
                  <object id="resize-sensor" type="text/html" data="about:blank"></object>
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
      }

      onLocaleDirChanged(newDir, oldDir) {
        // acts like an init
        super.onLocaleDirChanged(newDir, oldDir);
        this._applyDirAndOffsets();
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        getMiddle(this).addEventListener('scroll', this._onScroll);
        getResizeSensor(this).contentDocument.defaultView.addEventListener('resize', this._onResize);
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
        getResizeSensor(this).contentDocument.defaultView.removeEventListener('resize', this._onResize);
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
            this._adjustHScroll();
            break;
          }
          case 'v-scroll': {
            this._adjustVScroll();
            break;
          }
          default:
            // pass
        }
      }

      // -------------------- public getters/setters ------------------------

      get vScroll() {
        return +this.getAttribute('v-scroll') || 0;
      }

      set vScroll(value) {
        const newValue = trunc(SCROLL_PRECISION)(+value);
        this.setAttribute('v-scroll', newValue);
      }

      get hScroll() {
        return +this.getAttribute('h-scroll') || 0;
      }

      set hScroll(value) {
        const newValue = trunc(SCROLL_PRECISION)(+value);
        this.setAttribute('h-scroll', newValue);
      }


      // -------------------- private getters ------------------------

      get _vSliderThickness() {
        const middle = getMiddle(this);
        const vSliderThickness = middle.offsetWidth - middle.clientWidth;
        return vSliderThickness;
      }

      get _hSliderThickness() {
        const middle = getMiddle(this);
        const hSliderThickness = middle.offsetHeight - middle.clientHeight;
        return hSliderThickness;
      }

      get _hSliderRatio() {
        const hSliderRatio = trunc(SCROLL_PRECISION)(this._clientWidth / this._scrollWidth);
        return hSliderRatio;
      }

      get _vSliderRatio() {
        const vSliderRatio = trunc(SCROLL_PRECISION)(this._clientHeight / this._scrollHeight);
        return vSliderRatio;
      }

      get _scrollWidth() {
        const middle = getMiddle(this);
        const scrollWidth = middle.scrollWidth;
        return scrollWidth;
      }

      get _scrollHeight() {
        const middle = getMiddle(this);
        const scrollHeight = middle.scrollHeight;
        return scrollHeight;
      }

      get _clientWidth() {
        const middle = getMiddle(this);
        const clientWidth = middle.clientWidth;
        return clientWidth;
      }

      get _clientHeight() {
        const middle = getMiddle(this);
        const clientHeight = middle.clientHeight;
        return clientHeight;
      }

      get _scrollableWidth() {
        const scrollableWidth = this._scrollWidth - this._clientWidth;
        return scrollableWidth;
      }

      get _scrollableHeight() {
        const scrollableHeight = this._scrollHeight - this._clientHeight;
        return scrollableHeight;
      }

      get _hScrollToScrollLeft() {
        const scrollableWidth = this._scrollableWidth;
        const hScroll = this.hScroll;
        const hScrollToScrollLeft = scrollableWidth * hScroll;
        const localeHScrollToScrollLeft = isDbuiRTL(this) ?
          this._scrollableWidth - hScrollToScrollLeft :
          hScrollToScrollLeft;
        return localeHScrollToScrollLeft;
      }

      get _vScrollToScrollTop() {
        const scrollableHeight = this._scrollableHeight;
        const vScroll = this.vScroll;
        const vScrollToScrollTop = scrollableHeight * vScroll;
        return vScrollToScrollTop;
      }

      get hScrollRatio() {
        const middle = getMiddle(this);
        const scrollLeft = middle.scrollLeft;
        const scrollableWidth = this._scrollableWidth;
        const hScrollRatio = trunc(SCROLL_PRECISION)(scrollLeft / scrollableWidth);
        const localeScrollRatio = hScrollRatio;
        return localeScrollRatio;
      }

      get vScrollRatio() {
        const middle = getMiddle(this);
        const scrollTop = middle.scrollTop;
        const scrollableHeight = this._scrollableHeight;
        const vScrollRatio = trunc(SCROLL_PRECISION)(scrollTop / scrollableHeight);
        return vScrollRatio;
      }

      get _isScrollTriggeredBySliders() {
        const hSlider = getHSlider(this);
        const vSlider = getVSlider(this);
        return this._isHSliding || this._isVSliding || hSlider.isSliding || vSlider.isSliding;
      }

      // -------------------- private methods ------------------------

      _adjustHScroll() {
        const middle = getMiddle(this);
        middle.scrollLeft = this._hScrollToScrollLeft;
      }

      _adjustVScroll() {
        const middle = getMiddle(this);
        middle.scrollTop = this._vScrollToScrollTop;
      }

      _adjustHSliderPosition() {
        const hSlider = getHSlider(this);
        const hScrollRatio = this.hScrollRatio;
        hSlider.percent = hScrollRatio;
      }

      _adjustVSliderPosition() {
        const vSlider = getVSlider(this);
        const vScrollRatio = this.vScrollRatio;
        vSlider.percent = vScrollRatio;
      }

      _applyDirAndOffsets() {
        const outer = getOuter(this);
        const middle = getMiddle(this);
        const inner = getInner(this);
        const content = getContent(this);
        const resizeSensor = getResizeSensor(this);
        const hSlider = getHSlider(this);
        const vSlider = getVSlider(this);
        const vScrollbarThickness = this._vSliderThickness;
        const hScrollbarThickness = this._hSliderThickness;

        [outer, middle, inner, content, resizeSensor].forEach((node) =>
          node.dir = isDbuiRTL(this) ? 'rtl' : 'ltr'
        );
        console.log({
          offsetWidth: middle.offsetWidth, clientWidth: middle.clientWidth,
          hScrollbarThickness,
          offsetHeight: middle.offsetHeight, clientHeight: middle.clientHeight,
          vScrollbarThickness,
          scrollLeft: middle.scrollLeft
        });
        middle.style.padding = isDbuiRTL(this) ?
          `0px 0px ${hScrollbarThickness}px ${vScrollbarThickness}px` :
          `0px ${vScrollbarThickness}px ${hScrollbarThickness}px 0px`;
        inner.style.width = `calc(100% + ${vScrollbarThickness}px)`;
        inner.style.height = `calc(100% + ${hScrollbarThickness}px)`;

        hSlider.ratio = this._hSliderRatio;
        vSlider.ratio = this._vSliderRatio;
      }

      // -------------------- callbacks ------------------------

      _onResize() {
        const hSlider = getHSlider(this);
        const vSlider = getVSlider(this);
        hSlider.ratio = this._hSliderRatio;
        vSlider.ratio = this._vSliderRatio;
        this._adjustHSliderPosition();
        this._adjustVSliderPosition();
      }

      _onScroll(evt) {
        if (this._isScrollTriggeredBySliders) {
          return;
        }
        const scrollLeft = evt.target.scrollLeft;
        const scrollTop = evt.target.scrollTop;
        console.log('_onScroll', { scrollLeft, scrollTop });
        this._adjustHSliderPosition();
        this._adjustVSliderPosition();
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

