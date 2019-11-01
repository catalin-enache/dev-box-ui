
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import DBUICommonCssVars from './DBUICommonCssVars';
import DBUICommonCssClasses from './DBUICommonCssClasses';

const registrationName = 'DBUIWebComponentBase';

const cssMap = {
  'dbui-common-css-vars': DBUICommonCssVars,
  'dbui-common-css-classes': DBUICommonCssClasses,
};

function defineCommonCSS(win) {
  const { document } = win;
  Object.keys(cssMap).forEach((key) => {
    const commonStyle = document.createElement('style');
    commonStyle.setAttribute(key, '');
    commonStyle.innerHTML = cssMap[key];
    document.querySelector('head').appendChild(commonStyle);
  });
}

/* istanbul ignore next */
function defineComponentCssVars(win, cssVars) {
  const { document } = win;
  const commonCSSVarsStyleNode = document.querySelector('[dbui-common-css-vars]');
  commonCSSVarsStyleNode.innerHTML += cssVars;
}

/* istanbul ignore next */
function defineComponentCssClasses(win, cssClasses) {
  const { document } = win;
  const commonCSSClassesStyleNode = document.querySelector('[dbui-common-css-classes]');
  commonCSSClassesStyleNode.innerHTML += cssClasses;
}

/*
TODO:
 - implement static css and adopt it (see constructable stylesheets)
 - dimensionsAndCoordinates method should take into consideration rotation matrix ?
 - make setters and getters dynamically to avoid boilerplate
 - make properties like in lit-html
 - what behaviour when component is adopted ? what about its dependency on global variables ?
 - inject global css to handle dbui-web-component (hide when not defined, un hide when defined) ?
 - handle locale with a service
 - make context stuff like in React
*/

/*
Behavior Extras:
*/

/**
 *
 * @param win Window
 * @return {
 *   DBUIWebComponentBase,
 *   defineCommonStaticMethods,
 *   Registerable
 * }
 */
export default function getDBUIWebComponentBase(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    defineCommonCSS(win);

    const { document, HTMLElement, customElements } = win;

    class DBUIWebComponentBase extends HTMLElement {

      /**
       *
       * @return String
       */
      static get registrationName() {
        throw new Error('registrationName must be defined in derived classes');
      }

      /**
       *
       * @return String HTML
       */
      static get templateInnerHTML() {
        return '<style></style><slot></slot>';
      }

      /**
       *
       * @return String CSS
       */
      static get cssVars() {
        return '';
      }

      /**
       *
       * @return String CSS
       */
      static get cssClasses() {
        return '';
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      static get dependencies() {
        return [];
      }

      /**
       *
       * @return Array<String>
       */
      static get propertiesToUpgrade() {
        return ['unselectable'];
      }

      /**
       *
       * @return Object { String, String }
       */
      static get attributesToDefine() {
        return { 'dbui-web-component': '' };
      }

      /**
       *
       * @return Array<String>
       */
      static get observedAttributes() {
        // web components standard API
        return ['dir', 'lang', 'unselectable'];
      }

      static get template() {
        if (this._template) return this._template;
        const templateInnerHTML = this.templateInnerHTML;
        this._template = document.createElement('template');
        this._template.innerHTML = templateInnerHTML;
        return this._template;
      }

      static get componentStyle() {
        return this.template.content.querySelector('style').innerHTML;
      }

      static set componentStyle(value) {
        this.template.content.querySelector('style').innerHTML = value;
      }

      static registerSelf() {
        const {
          registrationName, dependencies, cssVars, cssClasses
        } = this;

        dependencies.forEach((dependency) => {
          dependency.registerSelf();
        });

        // Don't try to register self if already registered
        if (!customElements.get(registrationName)) {
          defineComponentCssVars(win, cssVars);
          defineComponentCssClasses(win, cssClasses);
          // Give a chance to override web-component style if provided before being registered.
          const componentStyle = ((win.DBUIWebComponents || {})[registrationName] || {}).componentStyle;
          if (componentStyle) {
            this.componentStyle += '\n\n/* ==== overrides ==== */\n\n';
            this.componentStyle += componentStyle;
          }
          // Do registration
          // https://html.spec.whatwg.org/multipage/custom-elements.html#concept-upgrade-an-element
          customElements.define(registrationName, this);
        }
      }

      static get prototypeChainInfo() {
        const chain = [this];
        let parentProto = Object.getPrototypeOf(this);
        while (parentProto !== HTMLElement) {
          chain.push(parentProto);
          parentProto = Object.getPrototypeOf(parentProto);
        }
        chain.push(parentProto);
        return chain;
      }

      constructor() {
        super();

        this.attachShadow({
          mode: 'open',
          // delegatesFocus: true
          // Not working on IPad so we do an workaround
          // by setting "focused" attribute when needed.
        });

        this._insertTemplate();

        this.connectedCallback = this.connectedCallback.bind(this);
        this.disconnectedCallback = this.disconnectedCallback.bind(this);
        this.attributeChangedCallback = this.attributeChangedCallback.bind(this);
        this.adoptedCallback = this.adoptedCallback.bind(this);
      }

      dispatchDbuiEvent(name, options) {
        this.dispatchEvent(new win.CustomEvent(name, options));
      }

      // ============================ [Locale] >> =============================================

      get isDbuiRTL() {
        return this.getAttribute('dbui-dir') === 'rtl';
      }

      // ============================ << [Locale]  =============================================

      /**
       *
       * @param prop String
       * @private
       */
      _upgradeProperty(prop) {
        // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
        // https://developers.google.com/web/fundamentals/web-components/examples/howto-checkbox
        /* eslint no-prototype-builtins: 0 */
        if (this.hasOwnProperty(prop)) {
          const value = this[prop];
          // get rid of the property that might shadow a setter/getter
          delete this[prop];
          // this time if a setter was defined it will be properly called
          this[prop] = value;
          // if a getter was defined, it will be called from now on
        }
      }

      /**
       *
       * @param key String
       * @param value String
       * @private
       */
      _defineAttribute(key, value) {
        // don't override user defined attribute
        if (!this.hasAttribute(key)) {
          this.setAttribute(key, value);
        }
      }

      _insertTemplate() {
        const { template } = this.constructor;
        template &&
        this.shadowRoot.appendChild(template.content.cloneNode(true));
      }

      /**
       *
       * @param oldDocument HTMLDocument
       * @param newDocument HTMLDocument
       */
      adoptedCallback(oldDocument, newDocument) {
        // web components standard API
        // callbacks order:
        // disconnectedCallback => adoptedCallback => connectedCallback
        // adoptedCallback does not work well in mozilla.
        // The component is downgraded to HTMLElement.
        // also see:
        // https://github.com/w3c/webcomponents/issues/512
        // https://github.com/w3c/webcomponents/issues/210
        // https://github.com/w3c/webcomponents/issues/176
        this._onAdoptedCallback(oldDocument, newDocument);
      }

      /**
       *
       * @param oldDocument HTMLDocument
       * @param newDocument HTMLDocument
       * @private
       */
      _onAdoptedCallback(oldDocument, newDocument) {
        // Call public hook.
        this.onAdoptedCallback(oldDocument, newDocument);
      }

      /**
       * Public hook.
       *
       * @param oldDocument HTMLDocument
       * @param newDocument HTMLDocument
       */
      // eslint-disable-next-line
      onAdoptedCallback(oldDocument, newDocument) {
        // pass
      }

      /*
      * https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
      * connectedCallback:
      * Invoked each time the custom element is appended into a document-connected element.
      * This will happen each time the node is moved,
      * and !!! may happen before the element's contents have been fully parsed !!!
      *
      * connectedCallback may be called once your element is no longer connected,
      * use Node.isConnected to make sure.
      *
      * web components standard API
      * connectedCallback is fired from children to parent in shadow DOM
      * but the order is less predictable in light DOM.
      * Should not read light/shadowDomDbuiChildren here.
      * Is called after attributeChangedCallback.
      * */
      connectedCallback() {
        // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
        if (!this.isConnected) return;
        // Using this pattern as it seems that the component
        // is immune to overriding connectedCallback at runtime.
        // Most probably the browser keeps a reference to connectedCallback
        // existing/defined at the time of upgrading and calls that one instead of the
        // latest (monkey patched / runtime evaluated) one.
        // Now, we can monkey patch onConnectedCallback if we want.
        this._onConnectedCallback();
      }

      /**
       * @private
       */
      _onConnectedCallback() {
        const { propertiesToUpgrade, attributesToDefine } = this.constructor;
        propertiesToUpgrade.forEach((property) => {
          this._upgradeProperty(property);
        });
        Object.keys(attributesToDefine).forEach((property) => {
          this._defineAttribute(property, attributesToDefine[property]);
        });
        win.addEventListener('beforeunload', this.disconnectedCallback, false);
        this.onConnectedCallback();
      }

      /**
       * Public hook.
       */
      onConnectedCallback() {
        // pass
      }

      // web components standard API
      disconnectedCallback() {
        this._onDisconnectedCallback();
      }

      /**
       * @private
       */
      _onDisconnectedCallback() {
        win.removeEventListener('beforeunload', this.disconnectedCallback, false);
        // Call public hook.
        this.onDisconnectedCallback();
      }

      /**
       * Public hook.
       */
      onDisconnectedCallback() {
        // pass
      }

      /**
       *
       * @param name String
       * @param oldValue String
       * @param newValue String
       */
      attributeChangedCallback(name, oldValue, newValue) {
        // web components standard API
        // Scenario 1: component was created in detached tree BEFORE being defined.
        // attributeChangedCallback will not be called when being defined but when inserted into DOM.
        // (this implies component is upgraded after being inserted into DOM).
        // Scenario 2: component is created in detached tree AFTER being defined.
        // attributeChangedCallback will be called right away
        // (this implies component is upgraded before being inserted into DOM).
        // When inserted in DOM then connectedCallback will be called.
        // In any case attributeChangedCallback is called before connectedCallback.
        // Things changed as a result of attributeChangedCallback should be preserved
        // when disconnectedCallback because these attribute changes will not be fired again
        // when node is removed then re-inserted back in the DOM tree.
        // Chrome behavior: if observed attribute is changed when disconnectedCallback
        // and the component is replaced with another node using replaceChild
        // then attributeChangedCallback will be fired after (re)connectedCallback
        // and not after disconnectedCallback as expected. (Note: Safari behaves as expected here)
        // Though if component is explicitly removed then
        // attributeChangedCallback will be fired after disconnectedCallback as expected.
        if (this.getAttribute(name) === oldValue) return;
        if (name === 'dir' || name === 'lang') {
          [...this.shadowRoot.querySelectorAll('[dbui-web-component]')].forEach((shadowAncestor) => {
            shadowAncestor.setAttribute(name, newValue);
          });
        }

        this._onAttributeChangedCallback(name, oldValue, newValue);
      }

      /**
       *
       * @param name String
       * @param oldValue String
       * @param newValue String
       * @private
       */
      _onAttributeChangedCallback(name, oldValue, newValue) {
        // Call public hook.
        this.onAttributeChangedCallback(name, oldValue, newValue);
      }

      /**
       * Public hook.
       *
       * @param name String
       * @param oldValue String
       * @param newValue String
       */
      // eslint-disable-next-line
      onAttributeChangedCallback(name, oldValue, newValue) {
        // pass
      }

    }

    return DBUIWebComponentBase;
  });
}
