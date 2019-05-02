
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUIAutoScrollNative from '../DBUIAutoScrollNative/DBUIAutoScrollNative';
import getDBUISlider from '../DBUISlider/DBUISlider';

const DEFAULT_PERCENT_PRECISION = 4;

const DBUIAutoScrollCssVars = `
  :root {
    --dbui-auto-scroll-custom-slider-thickness: 20px;
    --dbui-auto-scroll-slider-outer-padding: 0px;
  }
`;

const getElement = (self, id) => {
  if (self[`_${id}`]) {
    return self[`_${id}`];
  }
  self[`_${id}`] =
    self.shadowRoot.querySelector(`#${id}`);
  return self[`_${id}`];
};

const dispatchScrollEvent = (self) => {
  self.dispatchDbuiEvent('dbui-event-scroll', { detail: {} });
};

const dispatchResizeEvent = (self) => {
  self.dispatchDbuiEvent('dbui-event-resize', { detail: {} });
};

const registrationName = 'dbui-auto-scroll';

/*
TODO:
 - should be used as native or custom
 - add an option to add the custom scroll to the external side of content
 - make custom scrolls adapt (show hide - auto) depending on what is to be scrolled.
 - No Scrollbar if mobile, show-scrollbar should be auto or always/never
 - Make a horizontal default scrolling somehow via attributes (ex: for gallery thumbnails).
   https://css-tricks.com/pure-css-horizontal-scrolling/
 - onLocaleDirChanged might not fire at all if no dir specified ?
 - Should dispatch on resize (proxy from DBUIAutoScrollNative)
 - Check correct behavior on dir and native change
*/

/*
Behavior Extras:
 - Can display native or custom scrolls.
 - Custom sliders thickness is configurable via CSS --dbui-auto-scroll-custom-slider-thickness.
 - The scroll (horizontal or vertical) can be set programmatically in percent (0..1).
 - Scroll precision is configurable (percentPrecision) and defaults to 4.
 - Dispatches dbui-event-scroll when resizing DBUIAutoScroll or inner content,
   when user scrolling native with mouse scroll or mobile scroll,
   when user changes horizontal or vertical slider position.
*/

export default function getDBUIAutoScroll(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    } = getDBUIWebComponentCore(win);

    const DBUIAutoScrollNative = getDBUIAutoScrollNative(win);
    const DBUISlider = getDBUISlider(win);

    class DBUIAutoScroll extends DBUIWebComponentBase {

      static get registrationName() {
        return registrationName;
      }

      static get cssVars() {
        return DBUIAutoScrollCssVars;
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
            /* padding can be set directly on content */
            padding-top: 0px !important;
            padding-right: 0px !important;
            padding-bottom: 0px !important;
            padding-left: 0px !important;
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
            overflow: hidden;
            /* border: 1px solid blue; */ /* debug */
          }
          
          #auto-scroll-native {
            /* width: calc(100% + 15px); */
            /* height: calc(100% + 15px); */
          }
          
          #content {
            /* padding-right: 15px; */
            /* padding-bottom: 15px; */
            /* border: 1px solid red; */ /* debug */
          }
          
          dbui-slider {
            position: absolute;
            z-index: 1;
            --dbui-slider-outer-padding: var(--dbui-auto-scroll-slider-outer-padding);
          }
          
          #horizontal-slider {
            visibility: hidden;
            bottom: 0px;
            /* calculated at runtime */
            /* width: calc(100% - var(--dbui-auto-scroll-custom-slider-thickness)); */
            height: var(--dbui-auto-scroll-custom-slider-thickness);
          }
          
          #vertical-slider {
            visibility: hidden;
            top: 0px;
            width: var(--dbui-auto-scroll-custom-slider-thickness);
            /* calculated at runtime */
            /* height: calc(100% - var(--dbui-auto-scroll-custom-slider-thickness)); */
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
          <dbui-slider id="horizontal-slider"></dbui-slider>
          <dbui-slider id="vertical-slider" dir="ltr" vertical></dbui-slider>
          <div id="outer">
            <dbui-auto-scroll-native id="auto-scroll-native" overflow="scroll">
              <div id="content">
                <slot></slot>
              </div>
            </dbui-auto-scroll-native>
          </div>
          
        `;
      }

      static get dependencies() {
        return [...super.dependencies, DBUIAutoScrollNative, DBUISlider];
      }

      static get propertiesToUpgrade() {
        return [...super.propertiesToUpgrade,
          'native', 'debugShowValue', 'percentPrecision', 'hScroll', 'vScroll'
        ];
      }

      static get observedAttributes() {
        return [...super.observedAttributes,
          'native', 'debug-show-value', 'percent-precision', 'h-scroll', 'v-scroll'
        ];
      }

      constructor() {
        super();
        this._onDBUIAutoScrollNativeResize =
          this._onDBUIAutoScrollNativeResize.bind(this);
        this._onHorizontalSliderMove =
          this._onHorizontalSliderMove.bind(this);
        this._onVerticalSliderMove =
          this._onVerticalSliderMove.bind(this);
        this._onDBUIAutoScrollNativeScroll =
          this._onDBUIAutoScrollNativeScroll.bind(this);
      }

      get debugShowValue() {
        return this.getAttribute('debug-show-value') !== null;
      }

      set debugShowValue(value) {
        const newValue = !!value;
        newValue && this.setAttribute('debug-show-value', '');
        !newValue && this.removeAttribute('debug-show-value');
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
       * Returns whether should display native or custom scrollbars.
       * @return {boolean}
       */
      get native() {
        return this.getAttribute('native') !== null;
      }

      /**
       * Sets whether should display native or custom scrollbars.
       * @param value {boolean}
       */
      set native(value) {
        const newValue = !!value;
        newValue && this.setAttribute('native', '');
        !newValue && this.removeAttribute('native');
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
       * Returns the ratio between horizontal with and horizontal content width.
       * (forwarded from internal auto-scroll-native)
       * @return {number}
       */
      get hRatio() {
        return getElement(this, 'auto-scroll-native').hRatio;
      }

      /**
       * Returns the ratio between vertical height and vertical content height.
       * (forwarded from internal auto-scroll-native)
       * @return {number}
       */
      get vRatio() {
        return getElement(this, 'auto-scroll-native').vRatio;
      }

      /**
       * @return {boolean}
       */
      get _hasHScroll() {
        const autoScrollNative = getElement(this, 'auto-scroll-native');
        return (autoScrollNative.scrollWidth - autoScrollNative.clientWidth) > 0;
      }

      /**
       * @return {boolean}
       */
      get _hasVScroll() {
        const autoScrollNative = getElement(this, 'auto-scroll-native');
        return (autoScrollNative.scrollHeight - autoScrollNative.clientHeight) > 0;
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
        const isRtl = this.isDbuiRTL;
        const paddingDir = isRtl ? 'Left' : 'Right';
        autoScrollNative.style.width = '100%';
        autoScrollNative.style.height = '100%';
        autoScrollNative.style.marginLeft = '0px';
        content.style[`padding${paddingDir}`] = '0px';
        content.style.paddingBottom = '0px';
        this._toggleSliders();
      }

      _customSetupOnNativeSetupOff() {
        const autoScrollNative = getElement(this, 'auto-scroll-native');
        const content = getElement(this, 'content');
        const isRtl = this.isDbuiRTL;
        const paddingDir = isRtl ? 'Left' : 'Right';
        const paddingOtherDir = paddingDir === 'Left' ? 'Right' : 'Left';
        const { hNativeScrollbarThickness, vNativeScrollbarThickness } = autoScrollNative;
        const customSliderThickness = this._customSliderThickness;
        const computedStyle = win.getComputedStyle(this);
        const borderLeftWidth = win.parseInt(computedStyle.getPropertyValue('border-left-width')) || 0;
        const borderRightWidth = win.parseInt(computedStyle.getPropertyValue('border-right-width')) || 0;
        const borderBottomWidth = win.parseInt(computedStyle.getPropertyValue('border-bottom-width')) || 0;
        const borderSide = isRtl ? borderLeftWidth : borderRightWidth;
        const borderBottom = borderBottomWidth;

        const applyDimensions = () => {
          const hasHScroll = this._hasHScroll;
          const hasVScroll = this._hasVScroll;
          const hCustomSliderThickness = !this.native && hasHScroll ? customSliderThickness : 0;
          const vCustomSliderThickness = !this.native && hasVScroll ? customSliderThickness : 0;

          autoScrollNative.style.width = `calc(100% + ${vNativeScrollbarThickness + borderSide + vCustomSliderThickness}px)`;
          autoScrollNative.style.height = `calc(100% + ${hNativeScrollbarThickness + borderBottom + hCustomSliderThickness}px)`;
          autoScrollNative.style.marginLeft = `${(isRtl ? -(vNativeScrollbarThickness + borderSide + vCustomSliderThickness) : 0)}px`;

          content.style[`padding${paddingDir}`] = `${vCustomSliderThickness + borderSide}px`;
          content.style[`padding${paddingOtherDir}`] = '0px';
          content.style.paddingBottom = `${hCustomSliderThickness + borderBottom}px`;
        };

        applyDimensions();
        this._toggleSliders();
        // applying second time since hasHVScroll might change
        // after adding custom scrollbars
        applyDimensions();
      }

      _toggleSliders() {
        const isRtl = this.isDbuiRTL;
        const outer = getElement(this, 'outer');
        const horizontalSlider = getElement(this, 'horizontal-slider');
        const verticalSlider = getElement(this, 'vertical-slider');
        const customSliderThickness = this._customSliderThickness;

        horizontalSlider.debugShowValue = this.debugShowValue;
        verticalSlider.debugShowValue = this.debugShowValue;

        const applyDimensions = () => {
          const hasHScroll = this._hasHScroll;
          const hasVScroll = this._hasVScroll;
          const hCustomSliderThickness = !this.native && hasHScroll ? customSliderThickness : 0;
          const vCustomSliderThickness = !this.native && hasVScroll ? customSliderThickness : 0;

          // Making room for custom scrollbars.
          outer.style.width = `calc(100% - ${vCustomSliderThickness}px)`;
          outer.style.height = `calc(100% - ${hCustomSliderThickness}px)`;
          outer.style.marginLeft = isRtl ? `${vCustomSliderThickness}px` : '0px';

          horizontalSlider.style.width = `calc(100% - ${vCustomSliderThickness}px)`;
          verticalSlider.style.height = `calc(100% - ${hCustomSliderThickness}px)`;
          horizontalSlider.style.visibility = hCustomSliderThickness ? 'visible' : 'hidden';
          verticalSlider.style.visibility = vCustomSliderThickness ? 'visible' : 'hidden';
        };

        applyDimensions();
        // Changing outer size might make the other side not fitting
        // thus causing the other slider to need to pop in.
        applyDimensions();

      }

      _onDBUIAutoScrollNativeResize() {
        if (!this._initialSetupApplied) return;
        getElement(this, 'horizontal-slider').ratio = this.hRatio;
        getElement(this, 'vertical-slider').ratio = this.vRatio;
        this._nativeSetupOnOff();
        dispatchResizeEvent(this);
      }

      _onDBUIAutoScrollNativeScroll(evt) {
        if (!this._initialSetupApplied) return;
        this.hScroll = evt.target.hScroll;
        this.vScroll = evt.target.vScroll;
        // Setting hScroll/vScroll in these methods
        // (_onDBUIAutoScrollNativeScroll, _onHorizontalSliderMove, _onVerticalSliderMove)
        // will trigger _applyHScrollPercentage/_applyVScrollPercentage which in return
        // will set back these values on those components
        // (vertical-slider, horizontal-slider, auto-scroll-native).
        // But since the values will be identical
        //  - when compared oldValue with newValue in their attributeChangedCallback
        // which is handled in DBUIWebComponentCore -
        // their onAttributeChangedCallback will not fire, thus not causing multiple updates.
        dispatchScrollEvent(this);
      }

      _onHorizontalSliderMove(evt) {
        this.hScroll = evt.target.percent;
        dispatchScrollEvent(this);
      }

      _onVerticalSliderMove(evt) {
        this.vScroll = evt.target.percent;
        dispatchScrollEvent(this);
      }

      _setPercentPrecision() {
        getElement(this, 'horizontal-slider').percentPrecision = this.percentPrecision;
        getElement(this, 'vertical-slider').percentPrecision = this.percentPrecision;
        getElement(this, 'auto-scroll-native').percentPrecision = this.percentPrecision;
      }

      _applyHScrollPercentage() {
        getElement(this, 'auto-scroll-native').hScroll = this.hScroll;
        getElement(this, 'horizontal-slider').percent = this.hScroll;
      }

      _applyVScrollPercentage() {
        getElement(this, 'auto-scroll-native').vScroll = this.vScroll;
        getElement(this, 'vertical-slider').percent = this.vScroll;
      }

      _applyHVScrollPercentage() {
        this._applyHScrollPercentage();
        this._applyVScrollPercentage();
      }

      onLocaleDirChanged(newDir, oldDir) {
        super.onLocaleDirChanged(newDir, oldDir);
        if (!this._initialSetupApplied) return;
        this._nativeSetupOnOff();
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        getElement(this, 'auto-scroll-native')
          .addEventListener('dbui-event-resize', this._onDBUIAutoScrollNativeResize);
        getElement(this, 'auto-scroll-native')
          .addEventListener('dbui-event-scroll', this._onDBUIAutoScrollNativeScroll);
        getElement(this, 'horizontal-slider')
          .addEventListener('dbui-event-slidemove', this._onHorizontalSliderMove);
        getElement(this, 'vertical-slider')
          .addEventListener('dbui-event-slidemove', this._onVerticalSliderMove);
        this._setPercentPrecision();
        setTimeout(() => {
          getElement(this, 'horizontal-slider').ratio = this.hRatio;
          getElement(this, 'vertical-slider').ratio = this.vRatio;
          this._nativeSetupOnOff();
          setTimeout(() => {
            this._applyHVScrollPercentage();
            this._initialSetupApplied = true;
          }, 0);
        }, 0);
      }

      onDisconnectedCallback() {
        super.onDisconnectedCallback();
        getElement(this, 'auto-scroll-native')
          .removeEventListener('dbui-event-resize', this._onDBUIAutoScrollNativeResize);
        getElement(this, 'auto-scroll-native')
          .removeEventListener('dbui-event-scroll', this._onDBUIAutoScrollNativeScroll);
        getElement(this, 'horizontal-slider')
          .removeEventListener('dbui-event-slidemove', this._onHorizontalSliderMove);
        getElement(this, 'vertical-slider')
          .removeEventListener('dbui-event-slidemove', this._onVerticalSliderMove);
        this._initialSetupApplied = false;
      }

      onAttributeChangedCallback(name, oldValue, newValue) {
        super.onAttributeChangedCallback(name, oldValue, newValue);
        if (!this.isMounted) return;
        switch (name) {
          case 'native':
            this._nativeSetupOnOff();
            break;
          case 'debug-show-value':
            getElement(this, 'horizontal-slider').debugShowValue = newValue !== null;
            getElement(this, 'vertical-slider').debugShowValue = newValue !== null;
            break;
          case 'percent-precision': {
            this._setPercentPrecision();
            break;
          }
          case 'h-scroll': {
            this._initialSetupApplied && this._applyHScrollPercentage();
            break;
          }
          case 'v-scroll': {
            this._initialSetupApplied && this._applyVScrollPercentage();
            break;
          }
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

