
import getDBUIWebComponentBase from '../DBUIWebComponentBase/DBUIWebComponentBase';
import ensureSingleRegistration from '../internals/ensureSingleRegistration';
import LocaleService from "../../services/LocaleService";

const registrationName = 'dbui-web-component-form-input-text';

export default function getDBUIWebComponentFormInputText(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    const { DBUIWebComponentBase, defineCommonStaticMethods } = getDBUIWebComponentBase(win);
    const { document } = win;

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
      :host {
        all: initial; 
        display: inline-block;
        width: 100%;
        /*height: var(--dbui-web-component-form-input-height);*/
        /*line-height: var(--dbui-web-component-form-input-height);*/
        height: 200px;
        padding: 0px;
        font-size: 18px;
        color: var(--dbui-web-component-form-input-color);
        background-color: var(--dbui-web-component-form-input-background-color);
        unicode-bidi: bidi-override;
        box-sizing: border-box;
        border: none;
        border-bottom: var(--dbui-web-component-form-input-border-width) var(--dbui-web-component-form-input-border-style) var(--dbui-web-component-form-input-border-color);
      }
      
      :host [tabindex] {
        width: 100%;
        height: 50px;
        line-height: 50px;
        border: none;
        margin: 0px;
        padding: 0px;
        background-color: transparent;
      }
      
      :host [tabindex]:focus {
        background-color: rgba(255, 0, 0, .3);
        outline: none;
      }

      :host([focused]) {
        background-color: rgba(0, 255, 0, .3);
      }
      
      :host([disabled]) {
        background-color: rgba(0, 0, 0, .3);
      }
      
      :host([hidden]) {
        display: none;
      }

      :host([dir=rtl]) {
      
      }
      
      :host([dir=ltr]) {
      
      }
      </style>
      <div contenteditable="true" tabindex="0"></div>
      <div contenteditable="true" tabindex="0"></div>
      <input type="text" tabindex="0" />
      <input type="text" tabindex="0" />
    `;

    class DBUIWebComponentFormInputText extends DBUIWebComponentBase {
      static get registrationName() {
        return registrationName;
      }

      static get template() {
        return template;
      }

      static get propertiesToDefine() {
        return {
          // without tabindex focus does nothing
          tabindex: 0,
          role: 'dbui-web-component-form-input'
        };
      }

      constructor() {
        super();

        this._currentFocused = null;
        this._onFocusableFocused = this._onFocusableFocused.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
      }

      _onFocusableFocused(evt) {
        console.log('_onFocusableFocused');
        this._currentFocused = evt.target;
      }

      _onFocus() {
        console.log('_onFocus', this);
        if (!this.focused) {
          this.focused = true;
        }
        // this._applyFocusSideEffects();
      }

      _onBlur() {
        console.log('_onBlur', this);
        if (this.focused) {
          this.focused = false;
        }
        // this._applyBlurSideEffects();
      }

      _applyFocusSideEffects() {
        console.log('_applyFocusSideEffects');
        if (this._currentFocused) {
          // Some inner component is already focused.
          // No need to set focus on anything.
          return;
        }
        this._focusFirstFocusable();
      }

      _applyBlurSideEffects() {
        console.log('_applyBlurSideEffects');
        if (this._currentFocused) {
          this._currentFocused.blur();
          this._currentFocused = null;
        }
      }

      _focusFirstFocusable() {
        const focusable = this.childrenTree.querySelector('[tabindex]');
        console.log('_focusFirstFocusable', focusable)
        if (focusable) {
          // this._currentFocused = focusable;
          focusable.focus();
        }
      }

      static get observedAttributes() {
        return ['focused'];
      }

      attributeChangedCallback(name, oldValue, newValue) {
        console.log('attributeChangedCallback', {name, oldValue, newValue})
        const hasValue = newValue !== null;
        if (name === 'focused') {
          hasValue ? this._applyFocusSideEffects() : this._applyBlurSideEffects();
        }
      }

      get focused() {
        return this.hasAttribute('focused');
      }

      // keep this generic (so we can put it in base class), do not add custom logic
      set focused(value) {
        console.log('set focused', value);
        const hasValue = Boolean(value);
        if (hasValue) {
          this.setAttribute('focused', '');
        } else {
          this.removeAttribute('focused');
        }
      }

      // onLocaleChange(locale) {
      //   // console.log('onLocaleChange', locale);
      // }

      connectedCallback() {
        super.connectedCallback();

        this.addEventListener('focus', this._onFocus);
        this.addEventListener('blur', this._onBlur);

        const focusables = this.childrenTree.querySelectorAll('[tabindex]');
        focusables.forEach((focusable) => {
          focusable.addEventListener('focus', this._onFocusableFocused);
        });

        // if (this.focused) {
        //   this._focusFirstFocusable();
        // }
      }

      disconnectedCallback() {
        super.disconnectedCallback();

        this.removeEventListener('focus', this._onFocus);
        this.removeEventListener('blur', this._onBlur);

        const focusables = this.childrenTree.querySelectorAll('[tabindex]');
        focusables.forEach((focusable) => {
          focusable.removeEventListener('focus', this._onFocusableFocused);
        });
      }
    }

    defineCommonStaticMethods(DBUIWebComponentFormInputText);

    return DBUIWebComponentFormInputText;
  });
}

getDBUIWebComponentFormInputText.registrationName = registrationName;

