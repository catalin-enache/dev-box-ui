
export default function Focusable(Klass) {
  class Focusable extends Klass {

    static get propertiesToDefine() {
      const inheritedPropertiesToDefine = super.propertiesToDefine || {};
      return {
        ...inheritedPropertiesToDefine,
        // tabindex defines focusable behaviour
        tabindex: 0
      };
    }

    static get observedAttributes() {
      const inheritedObservedAttributes = super.observedAttributes || [];
      return [...inheritedObservedAttributes, 'focused'];
    }

    constructor(...args) {
      super(...args);

      this._currentFocused = null;
      this._onFocusableFocused = this._onFocusableFocused.bind(this);
      this._onFocus = this._onFocus.bind(this);
      this._onBlur = this._onBlur.bind(this);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback &&
        super.attributeChangedCallback(name, oldValue, newValue);

      console.log('attributeChangedCallback', { name, oldValue, newValue });
      const hasValue = newValue !== null;
      if (name === 'focused') {
        hasValue ? this._applyFocusSideEffects() : this._applyBlurSideEffects();
      }
    }

    connectedCallback() {
      super.connectedCallback &&
        super.connectedCallback();

      this.addEventListener('focus', this._onFocus);
      this.addEventListener('blur', this._onBlur);

      this._focusables.forEach((focusable) => {
        focusable.addEventListener('focus', this._onFocusableFocused);
      });

      // if (this.focused) {
      //   this._focusFirstFocusable();
      // }
    }

    disconnectedCallback() {
      super.disconnectedCallback &&
        super.disconnectedCallback();

      this.removeEventListener('focus', this._onFocus);
      this.removeEventListener('blur', this._onBlur);

      this._focusables.forEach((focusable) => {
        focusable.removeEventListener('focus', this._onFocusableFocused);
      });
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

    get _focusables() {
      return this.childrenTree.querySelectorAll('[tabindex]') || [];
    }

    get _firstFocusable() {
      return this.childrenTree.querySelector('[tabindex]');
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
      const firstFocusable = this._firstFocusable;
      console.log('_focusFirstFocusable', firstFocusable);
      if (firstFocusable) {
        // this._currentFocused = focusable;
        firstFocusable.focus();
      }
    }
  }

  Focusable.originalName = Klass.name;
  return Focusable;
}
