
import ensureSingleRegistration from '../../../internals/ensureSingleRegistration';
import DBUICommonCssVars from './DBUICommonCssVars';
import DBUICommonCssClasses from './DBUICommonCssClasses';
import toggleSelectable from '../../../utils/toggleSelectable';

const {
  disableSelection,
  enableSelection
} = toggleSelectable;

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

// https://www.kirupa.com/html5/handling_events_for_many_elements.htm

/*
TODO:
 - dimensionsAndCoordinates method should take into consideration rotation matrix ?
 - make setters and getters dynamically to avoid boilerplate ?
 - what behaviour when component is adopted ? what about its dependency on global variables ?
 - inject global css to handle dbui-web-component (hide when not defined, un hide when defined) ?
 - test a setup like auto-scroll to check the order of registrations and onDomSettled
 - what happens when shadow children are added dynamically later ?
 - improve onConnectedCallback algorithm performance
*/

/*
Behavior Extras:
 - Accessing parents and children:
   Parents and children are not always accessible/upgraded in connectedCallback (native)
   but they are in onConnectedCallback (custom - internally fired)
*/

// const describeElement =
//   (element) => `${element.constructor.registrationName}|${element.tagName.toUpperCase()}#${element.id}`;

/**
 *
 * @param win Window
 * @return {
 *   DBUIWebComponentBase,
 *   defineCommonStaticMethods,
 *   Registerable
 * }
 */
export default function getDBUIWebComponentCore(win) {
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
        return ['dir', 'lang', 'sync-locale-with', 'unselectable'];
      }

      /**
       *
       * @return Array<String>
       */
      get observedDynamicAttributes() {
        return [];
      }

      /**
       *
       * @return Boolean
       */
      get hasDynamicAttributes() {
        return false;
      }

      /**
       *
       * @return Boolean
       */
      get isMounted() {
        return this._isMounted;
      }

      /**
       *
       * @return Boolean
       */
      get isDisconnected() {
        // We need isDisconnected info when DOM tree is constructed
        // - after constructor() and before connectedCallback() -
        // when closestDbuiParent should not return null.
        return this._isDisconnected;
      }

      /* istanbul ignore next */
      get dimensionsAndCoordinates() {
        // vp stands for view-port
        const { x: _xvp, y: _yvp, width: _fullWidth, height: _fullHeight } =
          this.getBoundingClientRect();
        const [xvp, yvp, fullWidth, fullHeight] =
          [_xvp, _yvp, _fullWidth, _fullHeight].map(Math.round);
        const width = this.offsetWidth;
        const height = this.offsetHeight;
        const x = xvp + win.scrollX;
        const y = yvp + win.scrollY;
        return {
          x, y, xvp, yvp, width, height, fullWidth, fullHeight
        };
      }

      constructor() {
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
        this._closestDbuiChildren = new Set();
        this._isMounted = false;
        this._isDisconnected = false;
        this._localeObserver = null;
        this._dynamicAttributesObserver = null;
        this._previouslyObservedDynamicAttributes = {};
        this._prevDir = null;
        this._prevLang = null;
        this._dbuiWebComponentRoot = null;

        // delivery flags
        this._wasOnConnectedCallbackFired = false;
        this._wasRuntimeSetUpForLightDomMutationsRun = false;
        this._isDelivered = false;

        this._pendingAttributeChanges = [];
        this._isSafeToAccessClosestDbuiParent = false;
        this._shadowDescendantsNotConnectedDeepCache = null;

        this._insertTemplate();

        this.connectedCallback = this.connectedCallback.bind(this);
        this.disconnectedCallback = this.disconnectedCallback.bind(this);
        this.attributeChangedCallback = this.attributeChangedCallback.bind(this);
        this.adoptedCallback = this.adoptedCallback.bind(this);
      }

      dispatchDbuiEvent(name, options) {
        this.dispatchEvent(new win.CustomEvent(name, options));
      }

      // ============================ [Observe Dynamic Attributes] >> =============================================

      _initializeDynamicAttributesObserver() {
        if (!this.hasDynamicAttributes) return;

        this._dynamicAttributesObserver = new win.MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            const { oldValue, attributeName } = mutation;
            const newValue = this.getAttribute(attributeName);
            const currentlyObservedDynamicAttributesKeys = this.observedDynamicAttributes;
            const previouslyObservedDynamicAttributes = this._previouslyObservedDynamicAttributes;
            const previouslyObservedDynamicAttributesKeys = Object.keys(previouslyObservedDynamicAttributes);
            const isInCurrentlyObservedDynamicAttributes =
              currentlyObservedDynamicAttributesKeys.includes(attributeName);
            const isInPreviouslyObservedDynamicAttributes =
              previouslyObservedDynamicAttributesKeys.includes(attributeName);

            if (isInCurrentlyObservedDynamicAttributes) {
              this._previouslyObservedDynamicAttributes[attributeName] = newValue;
              this.attributeChangedCallback(
                attributeName, oldValue, newValue
              );
            } else if (isInPreviouslyObservedDynamicAttributes) {
              const oldValue = this._previouslyObservedDynamicAttributes[attributeName];
              delete this._previouslyObservedDynamicAttributes[attributeName];
              this.attributeChangedCallback(
                attributeName, oldValue, null
              );
            }

          });
        });

        this._dynamicAttributesObserver.observe(this, {
          attributes: true,
          attributeOldValue: true
        });
      }

      _dismissDynamicAttributesObserver() {
        if (!this._dynamicAttributesObserver) return;

        this._dynamicAttributesObserver.disconnect();
        this._dynamicAttributesObserver = null;
      }

      // ============================ << [Observe Dynamic Attributes] =============================================

      // ============================ [Locale] >> =============================================

      get isDbuiRTL() {
        return this.getAttribute('dbui-dir') === 'rtl';
      }

      // eslint-disable-next-line
      onLocaleDirChanged(newDir, prevDir) {
        // pass
      }

      // eslint-disable-next-line
      onLocaleLangChanged(newLang, prevLang) {
        // pass
      }

      // eslint-disable-next-line
      _onLocaleDirChanged(newDir) {
        if (newDir === this._prevDir) return;
        this.onLocaleDirChanged(newDir, this._prevDir);
        this._prevDir = newDir;
      }

      _onLocaleLangChanged(newLang) {
        if (newLang === this._prevLang) return;
        this.onLocaleLangChanged(newLang, this._prevLang);
        this._prevLang = newLang;
      }

      /**
       *
       * @return HTMLElement
       * @private
       */
      get _localeTarget() {
        const target = document.querySelector(this.getAttribute('sync-locale-with'));
        const defaultTarget = document.querySelector('html');
        return target || defaultTarget;
      }

      /**
       *
       * @return Object { dir, lang }
       * @private
       */
      get _targetedLocale() {
        // Return locale from target
        const target = this._localeTarget;
        return {
          dir: target.getAttribute('dir') || 'ltr',
          lang: target.getAttribute('lang') || 'en',
        };
      }

      _resetProvidedLocale() {
        // Called onDisconnectedCallback.
        //
        // dbuiDir/Lang dbui-dir/lang can be set
        // as a result of attributeChangedCallback
        // or as a result of syncing with (or monitoring) locale target (_syncLocaleAndMonitorChanges).
        // We can remove them if they were set
        // as a result of _syncLocaleAndMonitorChanges
        // because when this node will be re-inserted
        // the syncing will happen again and dbui-dir/lang attrs and dbuiDir/Lang provided context will be set again.
        // But we can't delete them if they were set onAttributeChangedCallback
        // because that will not be fired again when node is moved in other part of the DOM.
        if (!this.getAttribute('dir')) {
          // We know that locale props/attrs were set
          // as a result of locale syncing
          // and we can reset locale from _providingContext.
          delete this._providingContext.dbuiDir; // affects context providers / no effect on context receivers
          this.removeAttribute('dbui-dir'); // affects providers and receivers
          this._onLocaleDirChanged(null);
        }

        if (!this.getAttribute('lang')) {
          delete this._providingContext.dbuiLang;
          this.removeAttribute('dbui-lang');
          this._onLocaleLangChanged(null);
        }

        if (this._localeObserver) {
          this._localeObserver.disconnect();
          this._localeObserver = null;
        }
      }

      /**
       *
       * @param newContext Object
       * @param prevContext Object
       * @private
       */
      // eslint-disable-next-line
      _onLocaleContextChanged(newContext, prevContext) {
        // If we are monitoring locale from elsewhere discard this notification.
        if (this._localeObserver) return;
        const {
          dbuiDir, dbuiLang
        } = newContext;

        // changes done by attributeChangedCallback(dir/lang) takes precedence over onContextChanged

        if (!this.getAttribute('dir')) {
          if (dbuiDir) {
            this.setAttribute('dbui-dir', dbuiDir);
          } else {
            this.removeAttribute('dbui-dir');
          }
          this._onLocaleDirChanged(dbuiDir || null);
        }

        if (!this.getAttribute('lang')) {
          if (dbuiLang) {
            this.setAttribute('dbui-lang', dbuiLang);
          } else {
            this.removeAttribute('dbui-lang');
          }
          this._onLocaleLangChanged(dbuiLang || null);
        }
      }

      /**
       *
       * @param name String
       * @param oldValue String
       * @param newValue String
       * @private
       */
      _onLocaleAttributeChangedCallback(name, oldValue, newValue) {
        // If locale value is truthy, set it (on context too)
        // else read value from _targetedLocale
        // or from closestDbuiParent context.

        if (name === 'sync-locale-with') {
          // stop monitoring old target and start monitoring new target
          this._syncLocaleAndMonitorChanges();
          return;
        }

        const contextKey = name === 'dir' ? 'dbuiDir' : 'dbuiLang';
        const hasLocaleSync = !!this.hasAttribute('sync-locale-with');
        const closestDbuiParent = this.closestDbuiParent;
        const isTopDbuiAncestor = !closestDbuiParent;
        const targetedLocale =
          (hasLocaleSync || isTopDbuiAncestor) ? this._targetedLocale : null;
        const valueToSet = newValue ||
          (targetedLocale && targetedLocale[name]) ||
          closestDbuiParent._getContext([contextKey])[contextKey];

        if (newValue || targetedLocale) {
          this.setAttribute(`dbui-${name}`, valueToSet);
          this.setContext({
            [contextKey]: valueToSet
          });
          contextKey === 'dbuiDir' ?
            this._onLocaleDirChanged(valueToSet) :
            this._onLocaleLangChanged(valueToSet);
          targetedLocale && this._watchLocaleChanges();
        } else {
          this._unsetAndRelinkContext(contextKey);
        }
      }

      _syncLocaleAndMonitorChanges() {
        // Called onConnectedCallback and _onLocaleAttributeChangedCallback (only for sync-locale-with).
        //
        // If being top most dbui ancestor or having attr "sync-locale-with" defined,
        // read locale from target, set values on context
        // then watch for locale changes on target.
        const isDescendantDbui = !!this.closestDbuiParent;
        const hasLocaleSync = !!this.hasAttribute('sync-locale-with');
        if (isDescendantDbui && !hasLocaleSync) return;

        const { dir: targetedDir, lang: targetedLang } = this._targetedLocale;
        const selfDir = this.getAttribute('dir');
        const selfLang = this.getAttribute('lang');
        // dir/lang (when truthy) take priority over _targetedLocale which takes priority over context
        const newDir = selfDir || targetedDir;
        const newLang = selfLang || targetedLang;

        this.setAttribute('dbui-dir', newDir);
        this.setAttribute('dbui-lang', newLang);

        this.setContext({
          dbuiDir: newDir,
          dbuiLang: newLang
        });

        this._onLocaleDirChanged(newDir);
        this._onLocaleLangChanged(newLang);

        this._watchLocaleChanges();
      }

      _watchLocaleChanges() {
        // Called from _syncLocaleAndMonitorChanges and _onLocaleAttributeChangedCallback (only for dir/lang).
        if (this._localeObserver) {
          this._localeObserver.disconnect();
        }

        const localeTarget = this._localeTarget;

        this._localeObserver = new win.MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            const attr = mutation.attributeName;
            const value = this._targetedLocale[attr];
            const attrKey = `dbui-${attr}`;
            const contextKey = `dbui${attr.charAt(0).toUpperCase() + attr.slice(1)}`;

            this.setAttribute(attrKey, value);
            this.setContext({
              [contextKey]: value
            });
            contextKey === 'dbuiDir' ?
              this._onLocaleDirChanged(value) :
              this._onLocaleLangChanged(value);
          });
        });

        this._localeObserver.observe(localeTarget, {
          attributes: true,
          attributeFilter: ['dir', 'lang']
        });
      }

      // ============================ << [Locale]  =============================================

      // ============================ [Context] >> =============================================

      /**
       *
       * @return Array<String>
       */
      static get contextProvide() {
        return ['dbuiDir', 'dbuiLang'];
      }

      /**
       *
       * @return Array<String>
       */
      static get contextSubscribe() {
        return ['dbuiDir', 'dbuiLang'];
      }

      /**
       *
       * @param key String
       * @return Boolean
       * @private
       */
      _providesContextFor(key) {
        return this.constructor.contextProvide.some((_key) => _key === key);
      }

      /**
       *
       * @param key String
       * @return Boolean
       * @private
       */
      _hasValueForContext(key) {
        return this._providingContext[key] !== undefined;
      }

      /**
       *
       * @param key String
       * @return Boolean
       * @private
       */
      _subscribesForContext(key) {
        return this.constructor.contextSubscribe.some((_key) => _key === key);
      }

      /**
       *
       * @param contextObj Object
       */
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

      /**
       *
       * @param newContext Object
       */
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

      /**
       * Resets _lastReceivedContext and _providingContext,
       * looks up for new value on closestDbuiParent context
       * and propagates that to self and ancestors.
       *
       * @param contextKey String | Array<String>
       * @private
       */
      _unsetAndRelinkContext(contextKey) {
        const contextKeys = Array.isArray(contextKey) ? contextKey : [contextKey];

        contextKeys.forEach((key) => {
          delete this._providingContext[key];
        });

        const closestDbuiParent = this.closestDbuiParent;
        const valuesToSet =
            !closestDbuiParent ?
              undefined :
              closestDbuiParent._getContext(contextKeys);

        const newContext = contextKeys.reduce((acc, key) => {
          acc[key] = (valuesToSet || {})[key];
          return acc;
        }, {});

        this._propagateContextChanged(newContext);
      }

      /**
       *
       * @param keys Array<String>
       * @return Object
       * @private
       */
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

      /**
       *
       * @param newContext Object
       * @param options { reset = false }
       * @private
       */
      _onContextChanged(newContext, { reset = false } = {}) {
        // Might be fired more than once until DOM tree settles down.
        // ex: first call is the result of _checkContext which might get the top most existing context.
        // The next ones can be the result of middle ancestors firing attributeChangeCallback
        // which might set their context and propagate it down.
        const lastReceivedContext = this._lastReceivedContext;
        // Because locale is ignoring context if node has dir/lang or sync-locale-with,
        // when _unsetAndRelinkContext _lastReceivedContext will equal newContext
        // and _onLocaleContextChanged will not be fired due to !newContextFilteredKeys.length.
        // That's why we trigger _onLocaleContextChanged early here.
        this._onLocaleContextChanged(
          { ...lastReceivedContext, ...newContext }, { ...lastReceivedContext }
        );
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
        this._lastReceivedContext = { ...contextToSet };
        this.onContextChanged({ ...contextToSet }, { ...lastReceivedContext });
      }


      /**
       * Public hook.
       *
       * @param newContext Object
       * @param prevContext Object
       */
      // eslint-disable-next-line
      onContextChanged(newContext, prevContext) {
        // pass
      }

      _checkContext() {
        // _checkContext can propagate recursively to the very top even if ancestors are not connected.
        // If there is context defined somewhere upstream then it will be reached by descendants.
        const closestDbuiParent = this.closestDbuiParent;
        // no need to check context if is top most dbui ancestor
        if (!closestDbuiParent) return;

        const newContext = closestDbuiParent._getContext(
          this.constructor.contextSubscribe
        );
        this._onContextChanged(newContext);
        // No need to propagate to the children because they can search upward for context
        // until top of the tree is reached, even if ancestors are not connected yet.
        // If some middle ancestor has context to provide and did not managed to provide it yet
        // (ex: attributeChangedCallback not fired before descendants looked for upstream context)
        // then descendants will receive first context from upstream then from middle ancestor.
        // This was verified!
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

      /**
       *
       * @param callback Function
       * @return HTMLElement
       */
      getClosestAncestorMatchingCondition(callback) {
        let closestAncestor = this.parentElement;
        while (closestAncestor && !callback(closestAncestor)) {
          closestAncestor = closestAncestor.parentElement;
        }
        return closestAncestor;
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      get shadowDomDbuiChildren() {
        // children in slots are NOT included here
        return [...this.shadowRoot.querySelectorAll('[dbui-web-component]')];
      }

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
      get lightDomDbuiParent() {
        // can return a parent which is in shadow DOM of the grand-parent
        let parent = this.parentElement;
        while (parent && !parent.hasAttribute('dbui-web-component')) {
          parent = parent.parentElement;
        }
        return parent || null;
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      get lightDomDbuiChildren() {
        // children in slots ARE included here
        return [...this.querySelectorAll('[dbui-web-component]')];
      }

      /**
       *
       * @return DBUIWebComponent | null
       */
      get closestDbuiParentLiveQuery() {
        let closestParent = this.parentElement;
        // might be null if disconnected from DOM
        if (closestParent === null) {
          return this.shadowDomDbuiParent;
        }
        closestParent = closestParent.closest('[dbui-web-component]');
        return closestParent || this.shadowDomDbuiParent;
      }

      /**
       *
       * @return DBUIWebComponent | null
       */
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
        if (!this._isSafeToAccessClosestDbuiParent) {
          throw new Error('Do not access closestDbuiParent before DOM is settled!');
        }
        this._closestDbuiParent = this.closestDbuiParentLiveQuery;
        return this._closestDbuiParent;
      }

      /**
       * The only dbui component that returns true is DBUIWebComponentRoot
       * @return Boolean
       */
      get isDBUIRootNode() {
        return false;
      }

      /**
       *
       * @return DBUIWebComponentRoot | null
       */
      get dbuiWebComponentRoot() {
        if (this.isDBUIRootNode) {
          return this;
        } else if (this._dbuiWebComponentRoot) {
          return this._dbuiWebComponentRoot;
        }
        this._dbuiWebComponentRoot =
          win.document.querySelector('dbui-web-component-root');
        return this._dbuiWebComponentRoot;
      }

      /**
       *
       * @return DBUIWebComponent | null
       */
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

      /**
       * @return Array<DBUIWebComponent>
       */
      // might be useful in some scenarios
      get closestDbuiChildrenLiveQuery() {
        const allClosestDbuiChildren = [
          ...this.closetsDBUIChildrenInLightDomLiveQuery,
          ...this.closetsDBUIChildrenInShadowDomLiveQuery
        ];
        return allClosestDbuiChildren;
      }

      /**
       * @return Array<DBUIWebComponent>
       */
      get closetsDBUIChildrenInLightDomLiveQuery() {
        const lightDomDbuiChildren = [...this.lightDomDbuiChildren];
        const closestLightDomDbuiChildren =
          lightDomDbuiChildren.filter((child) => child.closestDbuiParentLiveQuery === this);
        return closestLightDomDbuiChildren;
      }

      /**
       * @return Array<DBUIWebComponent>
       */
      get closetsDBUIChildrenInShadowDomLiveQuery() {
        const shadowDomDbuiChildren = [...this.shadowDomDbuiChildren];
        const closestShadowDomDbuiChildren =
          shadowDomDbuiChildren.filter((child) => child.closestDbuiParentLiveQuery === this);
        return closestShadowDomDbuiChildren;
      }

      /**
       * @return Array<DBUIWebComponent>
       */
      get lightDescendantsLiveQuery() {
        return [...this.querySelectorAll('*')].filter((descendant) =>
          descendant.tagName.toUpperCase().startsWith('DBUI-')
        );
      }

      /**
       * @return Array<DBUIWebComponent>
       */
      get lightDescendantsUpgradedLiveQuery() {
        return this.lightDomDbuiChildren;
      }

      /**
       * @return Array<DBUIWebComponent>
       */
      get lightDescendantsNotUpgradedLiveQuery() {
        return [...this.querySelectorAll('*')].filter((descendant) =>
          descendant.tagName.toUpperCase().startsWith('DBUI-') &&
          !(descendant instanceof DBUIWebComponentBase)
        );
      }

      /**
       * @return Array<DBUIWebComponent>
       */
      get lightDescendantsNotConnectedLiveQuery() {
        return [...this.querySelectorAll('*')].filter((descendant) =>
          descendant.tagName.toUpperCase().startsWith('DBUI-') &&
          !descendant.isMounted
        );
      }

      /**
       * @return Array<DBUIWebComponent>
       */
      get shadowDescendantsLiveQuery() {
        return [...this.shadowRoot.querySelectorAll('*')].filter((descendant) =>
          descendant.tagName.toUpperCase().startsWith('DBUI-')
        );
      }

      /**
       * @return Array<DBUIWebComponent>
       */
      get shadowDescendantsDeepLiveQuery() {
        const dbuiChildren = this.shadowDescendantsLiveQuery;
        return [...dbuiChildren,
          ...dbuiChildren.map((descendant) => (
            descendant.shadowDescendantsDeepLiveQuery
          )).flat()];
      }

      /**
       * @return Array<DBUIWebComponent>
       */
      get shadowDescendantsConnectedLiveQuery() {
        return this.shadowDomDbuiChildren;
      }

      /**
       * @return Array<DBUIWebComponent>
       */
      get shadowDescendantsNotUpgradedLiveQuery() {
        return [...this.shadowRoot.querySelectorAll('*')].filter((descendant) =>
          descendant.tagName.toUpperCase().startsWith('DBUI-') &&
          !(descendant instanceof DBUIWebComponentBase)
        );
      }

      get shadowDescendantsNotConnectedLiveQuery() {
        return [...this.shadowRoot.querySelectorAll('*')].filter((descendant) =>
          descendant.tagName.toUpperCase().startsWith('DBUI-') &&
          !descendant.isMounted
        );
      }

      /**
       * @return Array<DBUIWebComponent>
       */
      get shadowDescendantsNotConnectedDeepLiveQuery() {
        const dbuiChildren = [...this.shadowRoot.querySelectorAll('*')].filter((descendant) =>
          descendant.tagName.toUpperCase().startsWith('DBUI-')
        );
        const dbuiChildrenUpgraded = dbuiChildren.filter((descendant) => (
          (descendant instanceof DBUIWebComponentBase)
        ));
        const dbuiChildrenUpgradedButNotConnected = dbuiChildrenUpgraded.filter((descendant) => (
          !descendant.isMounted
        ));
        const dbuiChildrenNotUpgraded = dbuiChildren.filter((descendant) => (
          !(descendant instanceof DBUIWebComponentBase)
        ));
        const shadowDescendantsNotConnectedDeep = [...dbuiChildrenNotUpgraded, ...dbuiChildrenUpgradedButNotConnected,
          ...dbuiChildrenUpgraded.map((descendant) => (
            descendant.shadowDescendantsNotConnectedDeepLiveQuery
          )).flat()];
        return shadowDescendantsNotConnectedDeep;
      }

      get _shadowDescendantsNotConnectedDeepCached() {
        if (this._shadowDescendantsNotConnectedDeepCache) {
          return this._shadowDescendantsNotConnectedDeepCache;
        }
        this._shadowDescendantsNotConnectedDeepCache =
          new Set(this.shadowDescendantsNotConnectedDeepLiveQuery);
        return this._shadowDescendantsNotConnectedDeepCache;
      }

      _removeSelfFromAncestorsCachedCollectionOfShadowDescendantsNotConnected() {
        let parentElement = this.closestDbuiParentLiveQuery;
        while (parentElement) {
          if (parentElement._shadowDescendantsNotConnectedDeepCache) {
            parentElement._shadowDescendantsNotConnectedDeepCache.delete(this);
          }
          parentElement = parentElement.closestDbuiParentLiveQuery;
        }
      }

      /**
       *
       * @return Array<DBUIWebComponent>
       */
      get closestDbuiChildren() {
        return [...this._closestDbuiChildren];
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

      /**
       *
       * @param child DBUIWebComponent
       * @private
       */
      _registerChild(child) {
        this._closestDbuiChildren.add(child);
      }

      /**
       *
       * @param child DBUIWebComponent
       * @private
       */
      _unregisterChild(child) {
        this._closestDbuiChildren.delete(child);
      }

      // ============================ << [Descendants/Ancestors and registrations] =============================================


      // ============================ [unselectable] >> =============================================

      _onUnselectableAttributeChanged() {
        const unselectable = this.unselectable;

        if (unselectable) {
          disableSelection(this);
        } else {
          enableSelection(this);
        }
      }

      get unselectable() {
        return this.hasAttribute('unselectable');
      }

      set unselectable(value) {
        const hasValue = Boolean(value);
        if (hasValue) {
          this.setAttribute('unselectable', '');
        } else {
          this.removeAttribute('unselectable');
        }
      }

      // ============================ << [unselectable] =============================================

      // ============================ [browser features/behaviors detection] >> ======================================

      /**
       * Returns native vertical slider thickness in pixels.
       * @return {number}
       */
      get vNativeScrollbarThickness() {
        return (win._DBUIBDetectedBrowserFeatures || {})
          ._vNativeScrollbarThickness;
      }

      /**
       * Returns native horizontal slider thickness in pixels.
       * @return {number}
       */
      get hNativeScrollbarThickness() {
        return (win._DBUIBDetectedBrowserFeatures || {})
          ._hNativeScrollbarThickness;
      }

      /**
       * Returns whether browser runs on desktop.
       * @return {boolean}
       */
      get isDesktopBrowser() {
        return this.vNativeScrollbarThickness > 0;
      }

      /**
       * Returns whether browser runs on mobile.
       * @return {boolean}
       */
      get isMobileBrowser() {
        return this.vNativeScrollbarThickness === 0;
      }

      /**
       * Returns whether browser has negative RTL scroll values.
       * @return {boolean}
       */
      get hasNegativeRTLScroll() {
        return (win._DBUIBDetectedBrowserFeatures || {})
          ._hasNegativeRTLScroll;
      }

      _detectScrollPropertiesAndBehavior() {
        if (this.hasNegativeRTLScroll !== undefined) {
          return;
        }

        const parent = win.document.createElement('div');
        const child = win.document.createElement('div');
        parent.dir = 'rtl';
        parent.style.cssText = `
        position: absolute;
        width: 50px;
        height: 50px;
        overflow: scroll;
        outline: 1px solid red;
        `;
        child.style.cssText = `
        width: 50px;
        height: 50px;
        background-color: gray;
        border: 2px solid blue;
        `;
        parent.appendChild(child);
        this.shadowRoot.appendChild(parent);
        parent.scrollLeft = -2;
        win._DBUIBDetectedBrowserFeatures._hasNegativeRTLScroll =
          parent.scrollLeft < 0;
        win._DBUIBDetectedBrowserFeatures._vNativeScrollbarThickness =
          parent.offsetWidth - parent.clientWidth;
        win._DBUIBDetectedBrowserFeatures._hNativeScrollbarThickness =
          parent.offsetHeight - parent.clientHeight;
        child.innerText = this.hasNegativeRTLScroll ? 'negative' : 'positive';
        parent.remove();
      }

      _detectFeaturesAndBehaviors() {
        if (win._DBUIBDetectedBrowserFeatures === undefined) {
          win._DBUIBDetectedBrowserFeatures = {};
        }
        this._detectScrollPropertiesAndBehavior();
      }

      // ============================ << [browser features/behaviors detection] ======================================

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
        this._detectFeaturesAndBehaviors();
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
        if (this.dbuiWebComponentRoot._disconnectChainStartedWith) {
          this.dbuiWebComponentRoot._pendingConnectionsDuringDisconnectFlow.push(this);
          return;
        }

        this._removeSelfFromAncestorsCachedCollectionOfShadowDescendantsNotConnected();
        this._wasOnConnectedCallbackFired = true;
        const shadowDescendantsNotConnected = this._shadowDescendantsNotConnectedDeepCached;
        const anyShadowDescendantsNotConnected = shadowDescendantsNotConnected.size;
        this._initSelf();

        if (!this.shadowDomDbuiParent && !anyShadowDescendantsNotConnected) {
          // Connecting light DOM node, no shadow.
          this._doLightDomSetup();
        } else if (this.shadowDomDbuiParent && !anyShadowDescendantsNotConnected) {
          // Connecting shadow DOM node, no shadow,
          // but parent (which was actually added) setup was delayed due to self.
          if (!this.shadowDomDbuiParent._isDelivered) {
            if (!anyShadowDescendantsNotConnected) {
              this.shadowDomDbuiParent._onShadowDomChildConnected();
            }
          } else {
            // Connecting shadow DOM node, no shadow.
            // This is the node being added at runtime and has no unconnected shadow children.
            this._doShadowDomSetup();
          }
        }
      }

      // Descendants tell their ancestors that they are connected
      // so that their ancestors can do their setup.
      // Recursively propagating up-tree.
      _onShadowDomChildConnected() {
        const shadowDescendantsNotConnected = this._shadowDescendantsNotConnectedDeepCached;
        const anyShadowDescendantsNotConnected = shadowDescendantsNotConnected.size;
        if (anyShadowDescendantsNotConnected || !this._wasOnConnectedCallbackFired) {
          return;
        }
        this._removeSelfFromAncestorsCachedCollectionOfShadowDescendantsNotConnected();
        if (!this.shadowDomDbuiParent && !this._isDelivered) {
          // light node added at runtime (setup was delayed)
          this._doLightDomSetup();
        } else if (this.shadowDomDbuiParent && this.shadowDomDbuiParent._isDelivered) {
          // shadow node was added at runtime (setup was delayed)
          this._doShadowDomSetup();
        } else if (this.shadowDomDbuiParent && !this.shadowDomDbuiParent._isDelivered) {
          this.shadowDomDbuiParent._onShadowDomChildConnected();
        }
      }

      _initSelf() {
        this._isMounted = true;
        this._isDisconnected = false;
        this._detectFeaturesAndBehaviors(); // This runs only once then is cached on window.
        win.addEventListener('beforeunload', this.disconnectedCallback, false);
        const { propertiesToUpgrade, attributesToDefine } = this.constructor;
        propertiesToUpgrade.forEach((property) => {
          this._upgradeProperty(property);
        });
        Object.keys(attributesToDefine).forEach((property) => {
          this._defineAttribute(property, attributesToDefine[property]);
        });
      }

      _doLightDomSetup() {
        if (!this.dbuiWebComponentRoot) return;
        if (!win.DBUIWebComponents.dbuiRootNodeUpgraded && !this.isDBUIRootNode) return;

        if (this.isDBUIRootNode) {
          this._initialSetUpForLightDomEventuallyFullyUpgraded(this);
          // If light node.
          // For non dbuiRoot the following code is only run at runtime after dbuiRoot was connected.
        } else if (
          // If in light DOM and not directly under dbuiRoot
          // and lightDomDbuiParent has not run runtimeSetUpForLightDom
          !this.shadowDomDbuiParent &&
          this.lightDomDbuiParent !== this.dbuiWebComponentRoot &&
          !this.lightDomDbuiParent._wasRuntimeSetUpForLightDomMutationsRun
        ) {
          // Complication due to Safari which provides light DOM nodes for runtimeSetup
          // before their shadow DOM was ready.
          // Ex: Safari is providing a, b, a_shadow, b_shadow
          // Ex: if b is light child of a then b should not be allowed to runtimeSetup before a.
          this.dbuiWebComponentRoot._pendingRuntimeSetupForLightDom.add(this);
        } else {
          this.dbuiWebComponentRoot
            ._runtimeSetUpForLightDomMutations(this);
        }
      }

      _doShadowDomSetup() {
        this._runtimeSetUpForShadowDomMutations();
      }


      /**
       * Only triggered by DBUIWebComponentRoot subclass in light DOM
       * or by any component for its shadow DOM
       * @param node DBUIWebComponent
       */
      // For the case when dbui children connectedCallback was already fired
      // (where components registration happened after DOM has been parsed
      // and DBUIWebComponentRoot.registerSelf() was called last)
      // This method is only triggered on dbuiRoot.
      _initialSetUpForLightDomEventuallyFullyUpgraded(dbuiRootNode) {
        const lightDescendantsUpgraded = [dbuiRootNode, ...this.lightDescendantsUpgradedLiveQuery];
        const lightDescendantsNotConnected = this.lightDescendantsNotConnectedLiveQuery;

        // In Safari only, when DOM is parsed after all registrations happened,
        // all descendants are fully upgraded during the parsing.
        // Setting win.DBUIWebComponents.dbuiRootNodeUpgraded = true here is incorrect
        // as it will make children register twice,
        // once by dbui-web-component-root and once by themselves.
        if (
          lightDescendantsUpgraded.length === 1 || // where 1 is dbuiRootNode itself
          lightDescendantsNotConnected.length > 0
        ) {
          // Handle exceptional case when _initialSetUp is called on DBUIWebComponentRoot
          // before children (upgraded or not upgraded) fired connectedCallback.
          // Ex: all children's Classes were registered
          // and the innerHTML of dbui-web-component-root container was rewritten.
          // or dbuiRoot was unmounted then mounted back.
          // Switch to the other kind of setup.
          win.DBUIWebComponents.dbuiRootNodeUpgraded = true;
          this._runtimeSetUpForLightDomMutations(dbuiRootNode);
          return;
        }
        // Handling the main case where DOM is fully upgraded and all children had fired connectedCallback already.
        // With this approach we guarantee that registrations and context discovery
        // happens from root to leaves and onConnectedCallback is fired from leaves to root.
        // Benefits: when onConnectedCallback is fired
        // - the component can access its upgraded parent
        // - all descendants are also mounted and upgraded
        // - component is fully aware of surrounding context
        lightDescendantsUpgraded
          .forEach((descendant) => {
            descendant._integrateSelfInTheTree();
            descendant._shadowDomSetUp();
          });
        lightDescendantsUpgraded.reverse().forEach((descendant) => {
          // Call public hook.
          descendant._deliverSelf();
          descendant._wasRuntimeSetUpForLightDomMutationsRun = true;
        });
        win.DBUIWebComponents.dbuiRootNodeUpgraded = true;
      }

      // For the case dbui children connectedCallback will be fired after
      // (when innerHTML is changed after registerSelf was called).
      // Assuming light descendants are not connected.
      // This method is only triggered on dbuiRoot.
      _runtimeSetUpForLightDomMutations(node) {
        this._pendingRuntimeSetupForLightDom.delete(node);

        // Only rootNode which is only instance uses _descendantsQueueLightDom.
        // Here this is always rootNode.
        if (this._descendantsQueueLightDom.length === 0) {
          const lightDescendants = node.lightDescendantsLiveQuery;
          const allDBUIComponentsNotConnected = [node, ...lightDescendants];
          const pendingLightDomConnections = lightDescendants;
          /* eslint no-multi-assign: 0 */
          this._descendantsQueueLightDom = allDBUIComponentsNotConnected;
          this._pendingLightDomConnections = new Set(pendingLightDomConnections);
          // if component asking for registration has no dbui descendant
          if (this._descendantsQueueLightDom.length === 1) { // the node itself
            // this._pendingLightDomConnections is 0 in this case
            const lastDescendantInQueue = this._descendantsQueueLightDom.pop();
            lastDescendantInQueue._integrateSelfInTheTree();
            lastDescendantInQueue._shadowDomSetUp();
            lastDescendantInQueue._deliverSelf();
          }
        } else {
          this._pendingLightDomConnections.delete(node);
          if (!this._pendingLightDomConnections.size) {
            this._descendantsQueueLightDom.forEach((descendant) => {
              descendant._integrateSelfInTheTree();
              descendant._shadowDomSetUp();
            });
            while (this._descendantsQueueLightDom.length) {
              const lastDescendantInQueue = this._descendantsQueueLightDom.pop();
              lastDescendantInQueue._deliverSelf();
            }
          }
        }

        node._wasRuntimeSetUpForLightDomMutationsRun = true;

        // Complication due to Safari which provide consecutive light DOM nodes for runtimeSetup
        // before their shadow DOM was ready.
        // Ex: Safari is providing a, b, a_shadow, b_shadow
        // Kick it again.
        this._pendingRuntimeSetupForLightDom.forEach((pendingNode) => {
          if (pendingNode.lightDomDbuiParent === node) {
            this._runtimeSetUpForLightDomMutations(pendingNode);
          }
        });
      }

      _runtimeSetUpForShadowDomMutations() {
        this._integrateSelfInTheTree();
        this._shadowDomSetUp();
        this._deliverSelf();
      }

      _shadowDomSetUp() {
        // Assuming all shadow descendants are already connected.
        const shadowDescendantsConnected = this.shadowDescendantsConnectedLiveQuery;
        shadowDescendantsConnected
          .forEach((descendant) => {
            descendant._integrateSelfInTheTree();
            descendant._shadowDomSetUp();
          });
        shadowDescendantsConnected.reverse().forEach((descendant) => {
          descendant._deliverSelf();
        });
      }

      _integrateSelfInTheTree() {
        this._isSafeToAccessClosestDbuiParent = true;
        this._registerSelfToClosestDbuiParent();
      }

      _deliverSelf() {
        this._shadowDescendantsNotConnectedDeepCache = null;
        // Call public hook.
        this.onConnectedCallback();
        this._isDelivered = true;
        this._checkContext(); // is ignored by top most dbui ancestors
        // makes top most ancestors or dbui components having localeTarget specified
        // to set dbuiDir/Locale on context
        this._syncLocaleAndMonitorChanges();
        this._initializeDynamicAttributesObserver();
        while (this._pendingAttributeChanges.length) {
          this.attributeChangedCallback(...this._pendingAttributeChanges.pop());
        }
      }

      /**
       * Public hook.
       */
      onConnectedCallback() {
        // pass
        // console.log(describeElement(this),
        //   'having shadowDomDbuiParent', this.shadowDomDbuiParent && describeElement(this.shadowDomDbuiParent),
        //   'and closestDBUIParent', this.closestDbuiParent && describeElement(this.closestDbuiParent),
        //   'onConnectedCallback',
        //   'closestDbuiChildren', this.closestDbuiChildren.map(describeElement),
        // );
      }

      // web components standard API
      disconnectedCallback() {
        this._onDisconnectedCallback();
      }

      /**
       * @private
       */
      _onDisconnectedCallback() {
        if (this._isDisconnected) return;
        if (!this.dbuiWebComponentRoot._disconnectChainStartedWith) {
          this.dbuiWebComponentRoot._disconnectChainStartedWith = this;
        }

        this._isMounted = false;
        this._isDisconnected = true;
        this._resetContext();
        this._resetProvidedLocale();
        this._unregisterSelfFromClosestDbuiParent();
        win.removeEventListener('beforeunload', this.disconnectedCallback, false);

        this._closestDbuiParent = null;
        this._isSafeToAccessClosestDbuiParent = false;

        // delivery flags
        this._wasOnConnectedCallbackFired = false;
        this._wasRuntimeSetUpForLightDomMutationsRun = false;
        this._isDelivered = false;

        this._dismissDynamicAttributesObserver();
        this.closestDbuiChildren.forEach((child) => child._onDisconnectedCallback());

        if (this.dbuiWebComponentRoot._disconnectChainStartedWith === this) {
          this.dbuiWebComponentRoot._disconnectChainStartedWith = null;
          while (this.dbuiWebComponentRoot._pendingConnectionsDuringDisconnectFlow.length) {
            const pendingConnection =
              this.dbuiWebComponentRoot._pendingConnectionsDuringDisconnectFlow.shift();
            pendingConnection._onConnectedCallback();
          }
        }

        // Call public hook.
        this.onDisconnectedCallback();
      }

      /**
       * Public hook.
       */
      onDisconnectedCallback() {
        // pass
      }

      cloneNodeDeep({ idPrefix = '', idSuffix = '' }) {
        const clone = super.cloneNode(true);
        clone._isSafeToAccessClosestDbuiParent = this._isSafeToAccessClosestDbuiParent;
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


      /**
       *
       * @param name String
       * @param oldValue String
       * @param newValue String
       */
      attributeChangedCallback(name, oldValue, newValue) {
        if (!this._isDelivered) {
          this._pendingAttributeChanges.push([name, oldValue, newValue]);
          return;
        }
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
        ['dir', 'lang', 'sync-locale-with'].includes(name) &&
          this._onLocaleAttributeChangedCallback(name, oldValue, newValue);
        name === 'unselectable' &&
          this._onUnselectableAttributeChanged();
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

    /**
     * @param klass Class
     */
    function defineCommonStaticMethods(klass) {
      const templateInnerHTML = klass.templateInnerHTML;
      const template = document.createElement('template');
      template.innerHTML = templateInnerHTML;

      /**
       * @property template (getter) template element
       */
      Object.defineProperty(klass, 'template', {
        get() { return template; },
        enumerable: false,
        configurable: true
      });

      /**
       * @property componentStyle (getter/setter) String
       */
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
        const {
          registrationName, dependencies, cssVars, cssClasses
        } = klass;

        if (customElements.get('dbui-web-component-root')) {
          throw new win.Error(`
          DBUIWebComponentRoot must be registered last.
          You can register in advance all dbui components that you plan to use.
          `);
        }

        // This order (registering dependencies before or after)
        // eventually matters only when registrations happen after DOM tree was parsed and displayed.

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
            klass.componentStyle += '\n\n/* ==== overrides ==== */\n\n';
            klass.componentStyle += componentStyle;
          }
          // Do registration
          // https://html.spec.whatwg.org/multipage/custom-elements.html#concept-upgrade-an-element
          customElements.define(registrationName, klass);
        }

        return registrationName;
      };

      /**
       * @property prototypeChainInfo (getter) Array<Prototype>
       */
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
