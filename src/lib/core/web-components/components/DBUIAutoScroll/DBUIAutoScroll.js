
import getDBUIWebComponentCore from '../DBUIWebComponentCore/DBUIWebComponentCore';
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import getDBUIAutoScrollNative from '../DBUIAutoScrollNative/DBUIAutoScrollNative';
import getDBUISlider from '../DBUISlider/DBUISlider';

const DBUIAutoScrollCssVars = `
  :root {
    --dbui-auto-scroll-custom-slider-thickness: 20px;
    --dbui-auto-scroll-slider-outer-padding: 0px;
  }
`;

const isDbuiRTL = (self) => {
  return self.getAttribute('dbui-dir') === 'rtl';
};

const getElement = (self, id) => {
  if (self[`_${id}`]) {
    return self[`_${id}`];
  }
  self[`_${id}`] =
    self.shadowRoot.querySelector(`#${id}`);
  return self[`_${id}`];
};

const registrationName = 'dbui-auto-scroll';

/*
TODO:
 - should be used as native or custom
 - import SCROLL_PRECISION
 - add Behavior Extras
*/

export default function getDBUIAutoScroll(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable,
      defineComponentCssVars
    } = getDBUIWebComponentCore(win);

    defineComponentCssVars(win, DBUIAutoScrollCssVars);

    const DBUIAutoScrollNative = getDBUIAutoScrollNative(win);
    const DBUISlider = getDBUISlider(win);

    class DBUIAutoScroll extends DBUIWebComponentBase {

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
          
          #outer {
            width: 100%;
            height: 100%;
            /*overflow: hidden;*/
          }
          
          #auto-scroll-native {
            /* width: calc(100% + 15px); */
            /* height: calc(100% + 15px); */
          }
          
          #content {
            /* padding-right: 15px; */
            /* padding-bottom: 15px; */
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
          <div id="outer">
            <dbui-slider id="horizontal-slider"></dbui-slider>
            <dbui-slider id="vertical-slider" dir="ltr" vertical></dbui-slider>
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
        return [...super.propertiesToUpgrade, 'native', 'debugShowValue'];
      }

      static get observedAttributes() {
        return [...super.observedAttributes, 'native', 'debug-show-value'];
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
        const horizontalSlider = getElement(this, 'horizontal-slider');
        const verticalSlider = getElement(this, 'vertical-slider');
        const autoScrollNative = getElement(this, 'auto-scroll-native');
        const content = getElement(this, 'content');
        const isRtl = isDbuiRTL(this);
        const paddingDir = isRtl ? 'Left' : 'Right';
        autoScrollNative.style.width = '100%';
        autoScrollNative.style.height = '100%';
        autoScrollNative.style.marginLeft = '0px';
        content.style[`padding${paddingDir}`] = '0px';
        content.style.paddingBottom = '0px';
        horizontalSlider.style.visibility = 'hidden';
        verticalSlider.style.visibility = 'hidden';
      }

      _customSetupOnNativeSetupOff() {
        const horizontalSlider = getElement(this, 'horizontal-slider');
        const verticalSlider = getElement(this, 'vertical-slider');
        const autoScrollNative = getElement(this, 'auto-scroll-native');
        const content = getElement(this, 'content');
        const isRtl = isDbuiRTL(this);
        const paddingDir = isRtl ? 'Left' : 'Right';
        const paddingOtherDir = paddingDir === 'Left' ? 'Right' : 'Left';
        const { hNativeScrollbarThickness, vNativeScrollbarThickness } = autoScrollNative;
        const customSliderThickness = this._customSliderThickness;
        autoScrollNative.style.width = `calc(100% + ${vNativeScrollbarThickness}px)`;
        autoScrollNative.style.height = `calc(100% + ${hNativeScrollbarThickness}px)`;
        // TODO: need to address border and padding ?
        autoScrollNative.style.marginLeft = `${(isRtl ? -vNativeScrollbarThickness : 0)}px`;
        content.style[`padding${paddingDir}`] = `${customSliderThickness}px`;
        content.style[`padding${paddingOtherDir}`] = '0px';
        content.style.paddingBottom = `${customSliderThickness}px`;
        horizontalSlider.style.visibility = 'visible';
        verticalSlider.style.visibility = 'visible';
        horizontalSlider.debugShowValue = this.debugShowValue;
        verticalSlider.debugShowValue = this.debugShowValue;
      }

      _onDBUIAutoScrollNativeResize(evt) {
        const { width, height, contentWidth, contentHeight } = evt.detail;
        const toScroll = evt.target._scrollableWidth - evt.target._scrollLeft;
        // TODO: improve and do the same for vertical-slider, use SCROLL_PRECISION
        // this behavior can be seen with an inner content-editable
        const scrollRatio = (1 - +(toScroll / evt.target._scrollableWidth).toFixed(4)).toFixed(4);
        console.log('_onDBUIAutoScrollNativeResize', {
          width, height, contentWidth, contentHeight, toScroll, scrollRatio
        });
        getElement(this, 'horizontal-slider').percent = scrollRatio;
      }

      _onDBUIAutoScrollNativeScroll(evt) {
        console.log('AutoScroll#_onDBUIAutoScrollNativeScroll', evt.target.hScroll, evt.target.vScroll);
        getElement(this, 'vertical-slider').percent = evt.target.vScroll;
        getElement(this, 'horizontal-slider').percent = evt.target.hScroll;
      }

      _onHorizontalSliderMove(evt) {
        console.log('AutoScroll#_onHorizontalSliderMove', evt.target.percent);
        getElement(this, 'auto-scroll-native').hScroll = evt.target.percent;
      }

      _onVerticalSliderMove(evt) {
        console.log('AutoScroll#_onVerticalSliderMove', evt.target.percent);
        getElement(this, 'auto-scroll-native').vScroll = evt.target.percent;
      }

      onLocaleDirChanged(newDir, oldDir) {
        super.onLocaleDirChanged(newDir, oldDir);
        this._nativeSetupOnOff();
      }

      onConnectedCallback() {
        super.onConnectedCallback();
        this._nativeSetupOnOff();
        getElement(this, 'auto-scroll-native')
          .addEventListener('resize', this._onDBUIAutoScrollNativeResize);
        getElement(this, 'auto-scroll-native')
          .addEventListener('scroll', this._onDBUIAutoScrollNativeScroll);
        getElement(this, 'horizontal-slider')
          .addEventListener('dbui-event-slidemove', this._onHorizontalSliderMove);
        getElement(this, 'vertical-slider')
          .addEventListener('dbui-event-slidemove', this._onVerticalSliderMove);
      }

      onDisconnectedCallback() {
        super.onDisconnectedCallback();
        getElement(this, 'auto-scroll-native')
          .removeEventListener('resize', this._onDBUIAutoScrollNativeResize);
        getElement(this, 'auto-scroll-native')
          .removeEventListener('scroll', this._onDBUIAutoScrollNativeScroll);
        getElement(this, 'horizontal-slider')
          .removeEventListener('dbui-event-slidemove', this._onHorizontalSliderMove);
        getElement(this, 'vertical-slider')
          .removeEventListener('dbui-event-slidemove', this._onVerticalSliderMove);
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

