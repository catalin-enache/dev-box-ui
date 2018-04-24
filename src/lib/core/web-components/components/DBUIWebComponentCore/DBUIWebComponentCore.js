
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import DBUICommonCssVars from './DBUICommonCssVars';

const registrationName = 'DBUIWebComponentBase';

function defineCommonCSSVars(win) {
  const { document } = win;
  const commonStyle = document.createElement('style');
  commonStyle.setAttribute('dbui-common-css-vars', '');
  commonStyle.innerHTML = DBUICommonCssVars;
  document.querySelector('head').appendChild(commonStyle);
}

/*
Accessing parents and children:
If parent is accessed in connectedCallback it exists (if it should exist), however,
the parent might not be itself connected yet.
If children are accessed in connectedCallback they might not be complete yet at that time.
*/

// https://www.kirupa.com/html5/handling_events_for_many_elements.htm
export default function getDBUIWebComponentCore(win) {
  return ensureSingleRegistration(win, registrationName, () => {
    defineCommonCSSVars(win);

    const { document, HTMLElement, customElements } = win;

    class DBUIWebComponentBase extends HTMLElement {

      static get registrationName() {
        throw new Error('registrationName must be defined in derived classes');
      }

      static get templateInnerHTML() {
        return '<style></style><slot></slot>';
      }

      static get dependencies() {
        return [];
      }

      static get propertiesToUpgrade() {
        return [];
      }

      static get attributesToDefine() {
        return { 'dbui-web-component': '' };
      }

      // web components standard API
      static get observedAttributes() {
        return ['dir', 'lang'];
      }

      get isMounted() {
        return this._isMounted;
      }

      // We need isDisconnected info when DOM tree is constructed
      // - after constructor() and before connectedCallback() -
      // when closestDbuiParent should not return null.
      get isDisconnected() {
        return this._isDisconnected;
      }

      constructor(...args) {
        super();

        this.attachShadow({
          mode: 'open',
          // delegatesFocus: true
          // Not working on IPad so we do an workaround
          // by setting "focused" attribute when needed.
        });

        this._propagatingContext = false;
        this._providingContext = {};
        this._lastReceivedContext = {};
        this._closestDbuiParent = null;
        this._closestDbuiChildren = [];
        this._isMounted = false;
        this._isDisconnected = false;
        this._insertTemplate();

        this.connectedCallback = this.connectedCallback.bind(this);
        this.disconnectedCallback = this.disconnectedCallback.bind(this);
        this.attributeChangedCallback = this.attributeChangedCallback.bind(this);
        this.adoptedCallback = this.adoptedCallback.bind(this);
        this.unregisterLocaleChange = null;

        // provide support for traits if any as they can't override constructor
        this.init && this.init(...args);
      }

      // ============================ [Locale] >> =============================================

      _setDefaultLocale() {
        !this.getAttribute('dir') && this.setAttribute('dbui-dir', 'ltr');
        !this.getAttribute('lang') && this.setAttribute('dbui-lang', 'en');
      }

      _resetLocale() {
        // dbuiDir/Lang dbui-dir/lang can be set
        // as a result of attributeChangedCallback
        // or as a result of checking locale up the tree (_captureLocale).
        // We can remove them if they were set
        // as a result of _captureLocale
        // because when node will be re-inserted
        // the look-up will happen again and they will be set again.
        // But we can't delete them if they were set onAttributeChangedCallback
        // because that will not be fired again when node is moved in other part of the DOM.
        if (!this.getAttribute('dir')) {
          // we know that locale props/attrs were set
          // as a result of checking up the tree.
          delete this._providingContext.dbuiDir;
          this.removeAttribute('dbui-dir');
        }
        if (!this.getAttribute('lang')) {
          delete this._providingContext.dbuiLang;
          this.removeAttribute('dbui-lang');
        }
      }

      _onLocaleAttributeChangedCallback(name, oldValue, newValue) {
        if (!['dir', 'lang'].includes(name)) return;
        const defaultValue = name === 'dir' ? 'ltr' : 'en';
        const contextKey = name === 'dir' ? 'dbuiDir' : 'dbuiLang';
        const closestDbuiParent = this.closestDbuiParent;
        const surroundingLocale =
          !closestDbuiParent ? this._findSurroundingLocale() : null;
        const valueToSet = newValue ||
          (closestDbuiParent && closestDbuiParent._getContext([contextKey])[contextKey]) ||
          (!closestDbuiParent && surroundingLocale[name]) ||
          defaultValue;
        this.setAttribute(`dbui-${name}`, valueToSet);
        this.setContext({
          [contextKey]: valueToSet
        });
        surroundingLocale && this._watchLocaleChanges(surroundingLocale);
      }

      _findSurroundingLocale() {
        const locale = ['dir', 'lang'].reduce((acc, attr) => {
          // Don't override user defined locale attributes.
          // dbuiDir/Lang were set on context onAttributeChangedCallback.
          if (this.getAttribute(attr)) return acc;
          // Find closest ancestor having dir or lang set.
          const closestAncestorHavingLocale =
            this._getClosestAncestorMatchingCondition((node) => {
              return node.getAttribute(attr);
            });

          if (closestAncestorHavingLocale) {
            const value =
              closestAncestorHavingLocale.getAttribute(attr);
            acc[attr] = value;
            acc[`${attr}Parent`] = closestAncestorHavingLocale;
          }
          return acc;
        }, {});
        return locale;
      }

      _captureLocale() {
        // Only capture locale if node is top most ancestor.
        // The children will be notified via context.
        if (this.closestDbuiParent) return;
        const { dir, lang, dirParent, langParent } =
          this._findSurroundingLocale();

        if (dir || lang) {
          dir && this.setAttribute('dbui-dir', dir);
          lang && this.setAttribute('dbui-lang', lang);
          const context = {};
          dir && (context.dbuiDir = dir);
          lang && (context.dbuiLang = lang);
          this.setContext(context);
          this._watchLocaleChanges({ dir, lang, dirParent, langParent });
        }
      }

      _watchLocaleChanges({ dir, lang, dirParent, langParent }) {
        let dirAndLangObserver = null;
        if (dirParent && (dirParent === langParent)) {
          dirAndLangObserver = dirParent;
        }

        if (dirAndLangObserver) {
          this._localeDirObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              const mutationAttributeName = mutation.attributeName;
              if (mutationAttributeName === 'dir') {
                const value = dirParent.getAttribute('dir');
                this.setAttribute('dbui-dir', value);
                this.setContext({ dbuiDir: value });
              } else if (mutationAttributeName === 'lang') {
                const value = langParent.getAttribute('lang');
                this.setAttribute('dbui-lang', value);
                this.setContext({ dbuiLang: value });
              }
            });
          });
          this._localeDirObserver.observe(dirAndLangObserver, {
            attributes: true
          });
          this._localeLangObserver = this._localeDirObserver;
        } else if (dir) {
          this._localeDirObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              const mutationAttributeName = mutation.attributeName;
              if (mutationAttributeName === 'dir') {
                const value = dirParent.getAttribute('dir');
                this.setAttribute('dbui-dir', value);
                this.setContext({ dbuiDir: value });
              }
            });
          });
          this._localeDirObserver.observe(dirParent, {
            attributes: true
          });
        } else if (lang) {
          this._localeLangObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              const mutationAttributeName = mutation.attributeName;
              if (mutationAttributeName === 'lang') {
                const value = langParent.getAttribute('lang');
                this.setAttribute('dbui-lang', value);
                this.setContext({ dbuiLang: value });
              }
            });
          });
          this._localeLangObserver.observe(langParent, {
            attributes: true
          });
        }
      }

      // ============================ << [Locale]  =============================================

      // ============================ [Context] >> =============================================

      static get contextProvide() {
        return ['dbuiDir', 'dbuiLang'];
      }

      static get contextSubscribe() {
        return ['dbuiDir', 'dbuiLang'];
      }

      _providesContextFor(key) {
        return this.constructor.contextProvide.some((_key) => _key === key);
      }

      _hasValueForContext(key) {
        return this._providingContext[key] !== undefined;
      }

      _subscribesForContext(key) {
        return this.constructor.contextSubscribe.some((_key) => _key === key);
      }

      setContext(contextObj) {
        const newKeys = Object.keys(contextObj).filter((key) => {
          return this._providesContextFor(key);
        });

        const contextToSet = newKeys.reduce((acc, key) => {
          acc[key] = contextObj[key];
          return acc;
        }, {});

        const newProvidingContext = {
          ...this._providingContext,
          ...contextToSet
        };

        this._providingContext = newProvidingContext;

        if (this._propagatingContext) return;

        this._propagateContextChanged(this._providingContext);
      }

      _propagateContextChanged(newContext) {
        this._propagatingContext = true;
        const newContextKeys = Object.keys(newContext);

        // if context is received from ancestors
        if (newContext !== this._providingContext) {
          // makes self aware
          const keysSubscribedFor = newContextKeys.reduce((acc, key) => {
            this._subscribesForContext(key) && acc.push(key);
            return acc;
          }, []);

          if (keysSubscribedFor.length) {
            const contextSubscribedFor = keysSubscribedFor.reduce((acc, key) => {
              acc[key] = newContext[key];
              return acc;
            }, {});
            this._onContextChanged(contextSubscribedFor);
            // At this point user might have call setContext inside onContextChanged
            // in which case _providingContext is updated with latest values.
          }
        }

        // propagate with overrides
        // If user called setContext() from within onContextChanged() then
        // this._providingContext has the newest values to be propagated
        const overriddenContext = this.constructor.contextProvide.reduce((acc, key) => {
          if (this._hasValueForContext(key)) {
            acc[key] = this._providingContext[key];
          }
          return acc;
        }, {});

        const contextToPropagate = {
          ...newContext,
          ...overriddenContext
        };

        // children that will mount later will ask for context (_checkContext)
        this.closestDbuiChildren.forEach((child) => {
          child._propagateContextChanged(contextToPropagate);
        });
        this._propagatingContext = false;
      }

      _getContext(keys) {
        // This must run always in the parent of the node asking for context
        // and not in the node itself.
        const ownedKeys = [];
        const keysToAskFor = [];
        keys.forEach((key) => {
          if (this._hasValueForContext(key)) {
            ownedKeys.push(key);
          } else {
            keysToAskFor.push(key);
          }
        });
        const closestDbuiParent = this.closestDbuiParent;
        return {
          ...ownedKeys.reduce((acc, key) => {
            acc[key] = this._providingContext[key];
            return acc;
          }, {}),
          ...(closestDbuiParent ? closestDbuiParent._getContext(keysToAskFor) : {})
        };
      }

      _onContextChanged(newContext, { reset = false } = {}) {
        const lastReceivedContext = this._lastReceivedContext;
        const newContextFilteredKeys = Object.keys(newContext || {}).filter((key) => {
          return newContext[key] !== lastReceivedContext[key];
        });
        // Prevents triggering onContextChanged against a context found on some ancestor
        // which did not managed yet to setup its context
        // due to for example attributeChangedCallback did not fired on that ancestor yet.
        if (!newContextFilteredKeys.length && !reset) return;
        const newContextFiltered = newContextFilteredKeys.reduce((acc, key) => {
          acc[key] = newContext[key];
          return acc;
        }, {});
        const contextToSet = reset ? {} : { ...lastReceivedContext, ...newContextFiltered };
        this._lastReceivedContext = contextToSet;
        const [_newContext, _prevContext] = [this._lastReceivedContext, lastReceivedContext];
        this.onContextChanged(_newContext, _prevContext);
      }

      // Might be fired more than once until DOM tree settles down.
      // ex: first call is the result of _checkContext which might get the top most existing context.
      // The next ones can be the result of middle ancestors firing attributeChangeCallback
      // which might set their context and propagate it down.
      // eslint-disable-next-line
      onContextChanged(newContext, prevContext) {
        const {
          dbuiDir, dbuiLang
        } = newContext;
        // keep eventual changes done by attributeChangedCallback over onContextChanged
        dbuiDir && !this.getAttribute('dir') && this.setAttribute('dbui-dir', dbuiDir);
        dbuiLang && !this.getAttribute('lang') && this.setAttribute('dbui-lang', dbuiLang);
      }

      // _checkContext can propagate to the very top even if ancestors are not connected.
      // If there is context defined somewhere upstream then it will be reached by grandchildren.
      _checkContext() {
        const closestDbuiParent = this.closestDbuiParent;
        if (closestDbuiParent) {
          const newContext = closestDbuiParent._getContext(
            this.constructor.contextSubscribe
          );
          // _onContextChanged is not fired for tree root
          this._onContextChanged(newContext);
          // No need to propagate to the children because they can search upward for context
          // until top of the tree is reached, even if ancestors are not connected yet.
          // If some middle ancestor has context to provide and did not managed to provide it yet
          // (ex: attributeChangedCallback not fired before descendants looked for upstream context)
          // then descendants will receive first context from upstream then from middle ancestor.
          // This was verified!
        }
      }

      _resetContext() {
        // this._providingContext is NOT reset from component providing context
        // because if context is dependent on attributeChangedCallback
        // that will not fire when component is moved from one place to another place in DOM tree.
        const closestDbuiParent = this.closestDbuiParent;
        // Checking closestDbuiParent to be symmetric with _checkContext
        // or we'll end up with empty context object after reset,
        // when it initially was undefined.
        if (closestDbuiParent) {
          this._onContextChanged(null, { reset: true });
        }
      }

      // ============================ << [Context] =============================================

      // ============================ [Descendants/Ancestors and registrations] >> =============================================

      _getClosestAncestorMatchingCondition(callback) {
        let closestAncestor = this.parentElement;
        while (closestAncestor && !callback(closestAncestor)) {
          closestAncestor = closestAncestor.parentElement;
        }
        return closestAncestor;
      }

      get shadowDomDbuiChildren() {
        // children in slots are NOT included here
        return [...this.shadowRoot.querySelectorAll('[dbui-web-component]')];
      }

      get shadowDomDbuiParent() {
        return this.getRootNode().host || null;
      }

      get lightDomDbuiParent() {
        // can return a parent which is in shadow DOM of the grand-parent
        let parent = this.parentElement;
        while (parent && !parent.hasAttribute('dbui-web-component')) {
          parent = parent.parentElement;
        }
        return parent || null;
      }

      get lightDomDbuiChildren() {
        // children in slots ARE included here
        return [...this.querySelectorAll('[dbui-web-component]')];
      }

      get closestDbuiParentLiveQuery() {
        let closestParent = this.parentElement;
        // might be null if disconnected from dom
        if (closestParent === null) {
          return null;
        }
        closestParent = closestParent.closest('[dbui-web-component]');
        return closestParent || this.shadowDomDbuiParent;
      }

      get closestDbuiParent() {
        // cached
        // Reason for cache is to allow a child to unregister from its parent when unmounted
        // because when browser calls disconnectedCallback the parent is not reachable anymore.
        // If parent could not be reachable it could not unregister its closest children
        // thus leading to memory leak.
        if (this._closestDbuiParent) {
          return this._closestDbuiParent;
        }
        if (this.isDisconnected) return null;
        this._closestDbuiParent = this.closestDbuiParentLiveQuery;
        return this._closestDbuiParent;
      }

      // might be useful in some scenarios
      get topDbuiAncestor() {
        let closestDbuiParent = this.closestDbuiParent;
        while (closestDbuiParent) {
          const _closestDbuiParent = closestDbuiParent.closestDbuiParent;
          if (!_closestDbuiParent) {
            return closestDbuiParent;
          }
          closestDbuiParent = _closestDbuiParent;
        }
        return closestDbuiParent; // this is null
      }

      // might be useful in some scenarios
      get closestDbuiChildrenLiveQuery() {
        const dbuiChildren = [...this.lightDomDbuiChildren, ...this.shadowDomDbuiChildren];
        const closestDbuiChildren = dbuiChildren.filter((child) => child.closestDbuiParentLiveQuery === this);
        return closestDbuiChildren;
      }

      get closestDbuiChildren() {
        return this._closestDbuiChildren;
      }

      _registerSelfToClosestDbuiParent() {
        const closestDbuiParent = this.closestDbuiParent;
        if (!closestDbuiParent) return;
        closestDbuiParent._registerChild(this);
      }

      _unregisterSelfFromClosestDbuiParent() {
        const closestDbuiParent = this.closestDbuiParent;
        if (!closestDbuiParent) return;
        closestDbuiParent._unregisterChild(this);
      }

      _registerChild(child) {
        this._closestDbuiChildren.push(child);
      }

      _unregisterChild(child) {
        this._closestDbuiChildren =
          this._closestDbuiChildren.filter((_child) => _child !== child);
      }

      // ============================ << [Descendants/Ancestors and registrations] =============================================

      // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
      // https://developers.google.com/web/fundamentals/web-components/examples/howto-checkbox
      /* eslint no-prototype-builtins: 0 */
      _upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
          const value = this[prop];
          // get rid of the property that might shadow a setter/getter
          delete this[prop];
          // this time if a setter was defined it will be properly called
          this[prop] = value;
          // if a getter was defined, it will be called from now on
        }
      }

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

      // web components standard API
      adoptedCallback(oldDocument, newDocument) {
        // callbacks order:
        // disconnectedCallback => adoptedCallback => connectedCallback
        this.onAdoptedCallback(oldDocument, newDocument);
      }

      // eslint-disable-next-line
      onAdoptedCallback(oldDocument, newDocument) {
        // pass
      }

      /*
      * web components standard API
      * connectedCallback is fired from children to parent in shadow DOM
      * but the order is less predictable in light DOM.
      * Should not read light/shadowDomDbuiChildren here.
      * Is called after attributeChangedCallback.
      * */
      connectedCallback() {
        // Using this pattern as it seems that the component
        // is immune to overriding connectedCallback at runtime.
        // Most probably the browser keeps a reference to connectedCallback
        // existing/defined at the time of upgrading and calls that one instead of the
        // latest (monkey patched / runtime evaluated) one.
        // Now, we can monkey patch onConnectedCallback if we want.
        this.onConnectedCallback();
      }

      onConnectedCallback() {
        this._isMounted = true;
        this._isDisconnected = false;
        win.addEventListener('beforeunload', this.disconnectedCallback, false);
        const { propertiesToUpgrade, attributesToDefine } = this.constructor;
        propertiesToUpgrade.forEach((property) => {
          this._upgradeProperty(property);
        });
        Object.keys(attributesToDefine).forEach((property) => {
          this._defineAttribute(property, attributesToDefine[property]);
        });
        this._setDefaultLocale(); // run by every dbui node in the tree
        this._captureLocale(); // only the top most dbui ancestor does this and propagates it to the descendants
        // We can safely register to closestDbuiParent because it exists at this time
        // but we must not assume it was connected.
        // NOTE: even if closestDbuiParent (or any ancestor) is not connected
        // the top of the tree (topDbuiAncestor) can be reached if needed
        this._registerSelfToClosestDbuiParent();
        // will most likely override (default) locale that was just set
        this._checkContext();
      }

      // web components standard API
      disconnectedCallback() {
        this.onDisconnectedCallback();
      }

      onDisconnectedCallback() {
        this._resetContext();
        this._resetLocale();
        this._unregisterSelfFromClosestDbuiParent();
        win.removeEventListener('beforeunload', this.disconnectedCallback, false);
        this._isMounted = false;
        this._isDisconnected = true;
        this._closestDbuiParent = null;
      }

      cloneNodeDeep({ idPrefix = '', idSuffix = '' }) {
        const clone = super.cloneNode(true);
        if (!idPrefix && !idSuffix) return clone;
        if (clone.hasAttribute('id')) {
          clone.setAttribute('id', `${idPrefix}${clone.getAttribute('id')}${idSuffix}`);
        }
        clone.querySelectorAll('[dbui-web-component]').forEach((child) => {
          if (child.hasAttribute('id')) {
            child.setAttribute('id', `${idPrefix}${child.getAttribute('id')}${idSuffix}`);
          }
        });
        return clone;
      }

      // web components standard API
      // Scenario 1: component was created in detached tree before being defined.
      // attributeChangedCallback will not be called when being defined but when inserted into DOM.
      // (this implies component is upgraded after being inserted into DOM).
      // Scenario 2: component is created in detached tree after being defined.
      // attributeChangedCallback will be called right away
      // (this implies component is upgraded before being inserted into DOM).
      // When inserted in DOM then connectedCallback will be called.
      // In any case attributeChangedCallback is called before connectedCallback.
      // Things changed as a result of attributeChangedCallback should be preserved
      // when disconnectedCallback because these attribute changes will not be fired again
      // when node is removed then re-inserted back in the DOM tree.
      attributeChangedCallback(name, oldValue, newValue) {
        if (this.getAttribute(name) === oldValue) return;
        this.onAttributeChangedCallback(name, oldValue, newValue);
      }

      // eslint-disable-next-line
      onAttributeChangedCallback(name, oldValue, newValue) {
        this._onLocaleAttributeChangedCallback(name, oldValue, newValue);
      }
    }

    function defineCommonStaticMethods(klass) {
      const templateInnerHTML = klass.templateInnerHTML;
      const template = document.createElement('template');
      template.innerHTML = templateInnerHTML;

      Object.defineProperty(klass, 'template', {
        get() { return template; },
        enumerable: false,
        configurable: true
      });

      Object.defineProperty(klass, 'componentStyle', {
        get() {
          return klass.template.content.querySelector('style').innerHTML;
        },
        set(value) {
          klass.template.content.querySelector('style').innerHTML = value;
        },
        enumerable: false,
        configurable: true
      });

      return klass;
    }

    function Registerable(klass) {
      klass.registerSelf = () => {
        const registrationName = klass.registrationName;
        const dependencies = klass.dependencies;
        // Make sure our dependencies are registered before we register self
        dependencies.forEach((dependency) => dependency.registerSelf());
        // Don't try to register self if already registered
        if (customElements.get(registrationName)) return registrationName;
        // Give a chance to override web-component style if provided before being registered.
        const componentStyle = ((win.DBUIWebComponents || {})[registrationName] || {}).componentStyle;
        if (componentStyle) {
          klass.componentStyle += '\n\n/* ==== overrides ==== */\n\n';
          klass.componentStyle += componentStyle;
        }
        // Do registration
        // https://html.spec.whatwg.org/multipage/custom-elements.html#concept-upgrade-an-element
        customElements.define(registrationName, klass);
        return registrationName;
      };

      Object.defineProperty(klass, 'prototypeChainInfo', {
        get() {
          const chain = [klass];
          let parentProto = Object.getPrototypeOf(klass);
          while (parentProto !== HTMLElement) {
            chain.push(parentProto);
            parentProto = Object.getPrototypeOf(parentProto);
          }
          chain.push(parentProto);
          return chain;
        },
        enumerable: false,
        configurable: true
      });

      return klass;
    }

    return {
      DBUIWebComponentBase,
      defineCommonStaticMethods,
      Registerable
    };
  });
}
