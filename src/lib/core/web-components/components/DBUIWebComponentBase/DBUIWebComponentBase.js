import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import {
  defineSettersAndGetters, defineObservedAttributes,
  setPropertyFromAttribute,
  handlePropertiesAndAttributesDefinedBeforeFirstTimeConnected,
  deferOwnProperties, applyDefaultValues
} from './helpers/propertiesAndAttributes.helpers';
import { propagateLocaleAttributes } from './helpers/locale.helpers';
import {
  defineCommonCSS, defineComponentCssVars, defineComponentCssClasses
} from './helpers/cssStyle.helpers';
import { supportsAdoptingStyleSheets } from './constants';

/**
 *
 * @param self DBUIWebComponentBase instance
 */
function insertTemplate(self) {
  const { template } = self.constructor;
  self.shadowRoot.appendChild(template.content.cloneNode(true));
}

/*
TODO:
 - inject global css to handle dbui-web-component (hide when not defined, un hide when defined) ?
 - handle locale with a service
 - dimensionsAndCoordinates method should take into consideration rotation matrix ?
*/

/*
Behavior Extras:

Properties:
 - Properties needs to be declared in static properties getter as a configuration object.
 - Every property auto-defines its own getter/setter.
 - Properties are type checked.
 - Properties are also checked against allowedValues function when declared in property configuration object.
 - Properties require a default value to be defined in configuration object.
 - Values for properties can be set on a node before it is upgraded.
 - Properties can be reflected to attributes and attributes can update properties
   when attribute flag is set in in property configuration object.
 - Attributes override default properties and properties overrides attributes before component is upgraded.
 - There is a lock in place for handling the case of property updating the attribute
   and the attribute updating the property.
 - onPropertyChangedCallback is guaranteed to be triggered only when component is already mounted.
   Attributes changed before component first time connected are deferred then applied at first component mount.
 - Own properties set before component upgrade are deferred.
 - Initial values for properties are set in a controlled order:
   1. Own properties (if any) before component upgrade are deferred/remembered in constructor.
   2. Default values are applied in constructor (without reflecting to attributes)
      (if setters are not shadowed they apply validation).
   3. Attribute changes are deferred.
   4. At first mount (_onConnectedCallback)
           a. Deferred attributes are applied if there is no related remembered own property.
              (will update default values) (if setters are not shadowed they apply validation).
           b. Own/remembered properties (if any before upgrade) are applied
              (will update default values) (attributes not reflected yet)
              (setters validation not applied since setters for this properties are still shadowed).
           c. Attributes are allowed to be reflected.
           d. Properties are upgraded (delete own properties (if any) and reveal/un-shadow setters).
           e. The setters will ensure properties values are checked and reflected to attributes.
   5. Further attributes changes will update properties and
      further properties changes will update attributes
      attributeOrPropertyLock ensure this happens in one way only.
*/

const registrationName = 'DBUIWebComponentBase';

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
      // eslint-disable-next-line
      static get registrationName() {
        this.throwError('registrationName must be defined in derived classes');
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
      static get extendedSharedStyleSheet() {
        return this._extendedSharedStyleSheet || '';
      }

      /**
       *
       * @param value String CSS
       */
      static set extendedSharedStyleSheet(value) {
        this._extendedSharedStyleSheet = value;
      }

      /**
       *
       * @return String CSS
       */
      static get defaultSharedStyleSheet() {
        return '';
      }

      /**
       *
       * @return String CSS
       */
      static get sharedStyleSheet() {
        return this.defaultSharedStyleSheet + this.extendedSharedStyleSheet;
      }

      /**
       *
       * @return String CSS
       */
      static get extendedCssVars() {
        return this._extendedCssVars || '';
      }

      /**
       *
       * @param value String CSS
       */
      static set extendedCssVars(value) {
        this._extendedCssVars = value;
      }

      /**
       *
       * @return String CSS
       */
      static get defaultCssVars() {
        return '';
      }

      /**
       *
       * @return String CSS
       */
      static get cssVars() {
        return this.defaultCssVars + this.extendedCssVars;
      }

      /**
       *
       * @return String CSS
       */
      static get extendedCssClasses() {
        return this._extendedCssClasses || '';
      }

      /**
       *
       * @param value String CSS
       */
      static set extendedCssClasses(value) {
        this._extendedCssClasses = value;
      }

      /**
       *
       * @return String CSS
       */
      static get defaultCssClasses() {
        return '';
      }

      /**
       *
       * @return String CSS
       */
      static get cssClasses() {
        return this.defaultCssClasses + this.extendedCssClasses;
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      static get dependencies() {
        return [];
      }

      /**
       * {
       *   prop: {
       *     type: String | Number | Boolean | Array | Object,
       *     attribute: 'some-attr' | true | false,
       *     toProperty: (value) => { },
       *     toAttribute: (value) => { },
       *     noAccessor: true | false,
       *     allowedValues: func({ self, value }) | undefined,
       *     defaultValue: any (required)
       *   }
       * }
       * @return Object
       */
      static get properties() {
        return {
          dbuiWebComponent: {
            type: win.Boolean, attribute: 'dbui-web-component',
            // eslint-disable-next-line
            allowedValues: ({ value }) => value === true,
            defaultValue: true
          },
          dir: { type: win.String, attribute: true, defaultValue: null },
          dbuiDir: { type: win.String, attribute: 'dbui-dir', defaultValue: 'ltr' },
          lang: { type: win.String, attribute: true, defaultValue: null },
          dbuiLang: { type: win.String, attribute: 'dbui-lang', defaultValue: 'en' },
          unselectable: { type: win.Boolean, attribute: true, defaultValue: false }
        };
      }

      /**
       *
       * @return Array<String>
       */
      static get observedAttributes() {
        // web components standard API
        return this._observedAttributes;
      }

      static get template() {
        if (this._template) return this._template;
        const templateInnerHTML = this.templateInnerHTML;
        this._template = document.createElement('template');
        this._template.innerHTML = templateInnerHTML;
        return this._template;
      }

      static get templateStyle() {
        return this.template.content.querySelector('style').innerHTML;
      }

      static set templateStyle(value) {
        this.template.content.querySelector('style').innerHTML = value;
      }

      static registerSelf() {
        // Static internal properties reference
        // _sharedStyleSheetInstance
        // _attributesToPropertiesMapper
        // _extendedCssVars
        // _extendedCssClasses
        // _extendedSharedStyleSheet
        // _observedAttributes

        const {
          registrationName, dependencies, templateStyle,
          cssVars, cssClasses, sharedStyleSheet
        } = this;

        // Don't try to register self if already registered
        if (customElements.get(registrationName)) { return; }

        dependencies.forEach((dependency) => {
          dependency.registerSelf();
        });

        defineComponentCssVars(win, cssVars);
        defineComponentCssClasses(win, cssClasses);

        if (supportsAdoptingStyleSheets) {
          this._sharedStyleSheetInstance = new win.CSSStyleSheet();
          this._sharedStyleSheetInstance.replaceSync(sharedStyleSheet);
        } else {
          this.templateStyle = `${sharedStyleSheet}\n\n${templateStyle}`;
        }

        defineSettersAndGetters(this);
        defineObservedAttributes(this);

        // Do registration
        // https://html.spec.whatwg.org/multipage/custom-elements.html#concept-upgrade-an-element
        customElements.define(registrationName, this);

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

      static throwError(msg) {
        throw new win.Error(msg);
      }

      throwError(msg) {
        this._invalidComponentState = true;
        this.constructor.throwError(msg);
      }

      // https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance
      constructor() {
        super();

        this.attachShadow({
          mode: 'open',
          // delegatesFocus: true
          // Not working on IPad so we do an workaround
          // by setting "focused" attribute when needed.
        });

        insertTemplate(this);

        if (supportsAdoptingStyleSheets) {
          this.shadowRoot.adoptedStyleSheets =
            [this.constructor._sharedStyleSheetInstance];
        }

        this.connectedCallback = this.connectedCallback.bind(this);
        this.disconnectedCallback = this.disconnectedCallback.bind(this);
        this.attributeChangedCallback = this.attributeChangedCallback.bind(this);
        this.adoptedCallback = this.adoptedCallback.bind(this);
        this.onBeforeUnload = this.onBeforeUnload.bind(this);

        this._internalProperties = {}; // Stores values for setters ad getters.
        this._consumerDefinedPropertiesBeforeUpgrade = {};
        this._attributesChangedBeforeFirstTimeConnected = {};
        this._componentIsConnected = false;
        this._componentFirstTimeConnected = false;
        this._componentHasBeenInitialized = false;
        this._attributesCanBeDefined = false;
        // This is for unit-tests only as we cannot throw errors when component is initialized.
        this._invalidComponentState = false;

        deferOwnProperties(this);
        applyDefaultValues(this);

      }

      toString() {
        return `[object ${this.constructor.name}]`;
      }

      dispatchDbuiEvent(name, options) {
        this.dispatchEvent(new win.CustomEvent(name, options));
      }

      // ============================ [Parents/Ancestors] >> =============================================

      /**
       *
       * @return DBUIWebComponent | null
       */
      get shadowDomDbuiParent() {
        return this.getRootNode().host || null;
      }

      /**
       *
       * @return DBUIWebComponent | null
       */
      get shadowDomDbuiAncestor() {
        let shadowDomDbuiParent = this.shadowDomDbuiParent;
        let shadowDomDbuiAncestor = null;
        while (shadowDomDbuiParent !== null) {
          shadowDomDbuiAncestor = shadowDomDbuiParent;
          shadowDomDbuiParent = shadowDomDbuiParent.shadowDomDbuiParent;
        }
        return shadowDomDbuiAncestor;
      }

      // ============================ [Parents/Ancestors] >> =============================================

      // ============================ [Locale] >> =============================================

      get isDbuiRTL() {
        return this.getAttribute('dbui-dir') === 'rtl';
      }

      // ============================ << [Locale]  =============================================

      // Fired when window is closed or refreshed.
      onBeforeUnload() {
        // TODO: test this
        // pass
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
      * Should not read light DOM children here.
      * Is called after attributeChangedCallback.
      * */
      connectedCallback() {
        if (this._invalidComponentState) return;
        // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
        if (!this.isConnected) return;
        // Using this pattern as it seems that the component
        // is immune to overriding connectedCallback at runtime.
        // Most probably the browser keeps a reference to connectedCallback
        // existing/defined at the time of upgrading and calls that one instead of the
        // latest (monkey patched / runtime evaluated) one.
        // Now, we can monkey patch onConnectedCallback if we want.
        this._onConnectedCallback();
        this.onConnectedCallback();
      }

      /**
       * @private
       */
      _onConnectedCallback() {
        this._componentIsConnected = true;
        handlePropertiesAndAttributesDefinedBeforeFirstTimeConnected(this);
        win.addEventListener('beforeunload', this.onBeforeUnload, false);
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
        // Call public hook.
        this.onDisconnectedCallback();
      }

      /**
       * @private
       */
      _onDisconnectedCallback() {
        this._componentIsConnected = false;
        win.removeEventListener('beforeunload', this.onBeforeUnload, false);
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
        if (this._invalidComponentState) return;
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
        // if (this.getAttribute(name) === oldValue) return; // not needed since we use withLock
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
        if (!this._componentFirstTimeConnected) {
          this._attributesChangedBeforeFirstTimeConnected[name] = { oldValue, newValue };
          return;
        }

        propagateLocaleAttributes(this, name, newValue);
        setPropertyFromAttribute(this, name, newValue);
      }

      /**
      * Public hook.
      *
      * @param name String
      * @param oldValue *
      * @param newValue *
      */// eslint-disable-next-line
      onPropertyChangedCallback(name, oldValue, newValue) {
        // pass
      }

    }

    return DBUIWebComponentBase;
  });
}
