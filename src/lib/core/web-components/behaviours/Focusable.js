
const readOnlyProperties = ['focused'];

const ERROR_MESSAGES = {
  focused: `'focused' property is read-only as it is controlled by the component.
If you want to set focus programmatically call .focus() method on component.
`
};

/**
 * When an inner focusable is focused (ex: via click) the entire component gets focused.
 * When the component gets focused (ex: via tab) the first inner focusable gets focused too.
 * When the component gets disabled it gets blurred too and all inner focusables get disabled and blurred.
 * When disabled the component cannot be focused.
 * When enabled the component can be focused.
 * @param Klass
 * @returns {Focusable}
 * @constructor
 */
export default function Focusable(Klass) {

  Klass.componentStyle += `
  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.5;
    
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  :host([disabled]) * {
    pointer-events: none;
  }
  `;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within

  class Focusable extends Klass {

    static get name() {
      return super.name;
    }

    static get propertiesToUpgrade() {
      // The reason for upgrading 'focused' is only to show an warning
      // if the consumer of the component attempted to set focus property
      // which is read-only.
      return [...super.propertiesToUpgrade, 'focused', 'disabled'];
    }

    static get observedAttributes() {
      return [...super.observedAttributes, 'disabled'];
    }

    constructor(...args) {
      super(...args);

      this._currentInnerFocused = null;
      this._sideEffectsAppliedFor = null;
      this._onInnerFocusableFocused = this._onInnerFocusableFocused.bind(this);
      this._onFocus = this._onFocus.bind(this);
      this._onBlur = this._onBlur.bind(this);
      this._onTap = this._onTap.bind(this);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);

      const hasValue = newValue !== null;
      if (name === 'disabled') {
        hasValue ? this._applyDisabledSideEffects() : this._applyEnabledSideEffects();
      }
    }

    connectedCallback() {
      super.connectedCallback();

      readOnlyProperties.forEach((readOnlyProperty) => {
        if (this.hasAttribute(readOnlyProperty)) {
          this.removeAttribute(readOnlyProperty);
          console.warn(ERROR_MESSAGES[readOnlyProperty]);
        }
      });

      if (this.disabled) {
        this._applyDisabledSideEffects();
      } else {
        this._applyEnabledSideEffects();
      }

      // when component focused/blurred
      this.addEventListener('focus', this._onFocus);
      this.addEventListener('blur', this._onBlur);
      this.ownerDocument.addEventListener('mousedown', this._onTap);
      this.ownerDocument.addEventListener('touchstart', this._onTap);

      this._innerFocusables.forEach((focusable) => {
        // when inner focusable focused
        focusable.addEventListener('focus', this._onInnerFocusableFocused);
      });
    }

    disconnectedCallback() {
      super.disconnectedCallback();

      this.removeEventListener('focus', this._onFocus);
      this.removeEventListener('blur', this._onBlur);
      this.ownerDocument.removeEventListener('mousedown', this._onTap);
      this.ownerDocument.removeEventListener('touchstart', this._onTap);

      this._innerFocusables.forEach((focusable) => {
        focusable.removeEventListener('focus', this._onInnerFocusableFocused);
      });
    }

    /**
     * Read only.
     * @return Boolean
     */
    get focused() {
      return this.hasAttribute('focused');
    }

    set focused(_) {
      console.warn(ERROR_MESSAGES.focused);
    }

    /**
     *
     * @return Boolean
     */
    get disabled() {
      return this.hasAttribute('disabled');
    }

    set disabled(value) {
      const hasValue = Boolean(value);
      if (hasValue) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
    }

    /**
     *
     * @return Array<HTMLElement>
     * @private
     */
    get _innerFocusables() {
      return this.shadowRoot.querySelectorAll('[tabindex]') || [];
    }

    /**
     *
     * @return HTMLElement || null
     * @private
     */
    get _firstInnerFocusable() {
      return this.shadowRoot.querySelector('[tabindex]');
    }

    /**
     *
     * @param evt Event (mousedown/touchstart)
     * @private
     */
    _onTap(evt) {
      if (evt.target !== this) {
        this.blur();
      }
    }

    /**
     *
     * @param evt Event (FocusEvent)
     * @private
     */
    _onInnerFocusableFocused(evt) {
      this._currentInnerFocused = evt.target;
    }

    _onFocus() {
      if (this.disabled) return;
      // Only for styling purpose.
      // Focused property is controlled from inside.
      // Attempt to set this property from outside will trigger a warning
      // and will be ignored
      this.setAttribute('focused', '');
      this._applyFocusSideEffects();
    }

    _onBlur() {
      this.removeAttribute('focused');
      this._applyBlurSideEffects();
    }

    _applyFocusSideEffects() {
      if (this._currentInnerFocused) {
        // Some inner component is already focused.
        // No need to set focus on anything.
        return;
      }
      this._focusFirstInnerFocusable();
    }

    _applyBlurSideEffects() {
      if (this._currentInnerFocused) {
        this._currentInnerFocused.blur();
        this._currentInnerFocused = null;
      }
    }

    _focusFirstInnerFocusable() {
      const firstInnerFocusable = this._firstInnerFocusable;
      if (firstInnerFocusable) {
        this._currentInnerFocused = firstInnerFocusable;
        firstInnerFocusable.focus();
      }
    }

    _applyDisabledSideEffects() {
      if (this._sideEffectsAppliedFor === 'disabled') return;
      this._lastTabIndexValue = this.getAttribute('tabindex');
      this.removeAttribute('tabindex');
      this._innerFocusables.forEach((innerFocusable) => {
        innerFocusable.setAttribute('tabindex', '-1');
        innerFocusable.setAttribute('disabled', 'disabled');
        if (innerFocusable.hasAttribute('contenteditable')) {
          innerFocusable.setAttribute('contenteditable', 'false');
        }
      });
      this.blur();
      this._sideEffectsAppliedFor = 'disabled';
    }

    _applyEnabledSideEffects() {
      if (this._sideEffectsAppliedFor === 'enabled') return;
      !this.getAttribute('tabindex') && this.setAttribute('tabindex', this._lastTabIndexValue || 0);
      this._innerFocusables.forEach((innerFocusable) => {
        innerFocusable.setAttribute('tabindex', '0');
        innerFocusable.removeAttribute('disabled');
        if (innerFocusable.hasAttribute('contenteditable')) {
          innerFocusable.setAttribute('contenteditable', 'true');
        }
      });
      this._sideEffectsAppliedFor = 'enabled';
    }
  }

  return Focusable;
}
