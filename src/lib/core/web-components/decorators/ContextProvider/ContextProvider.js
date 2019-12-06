
/*
Behavior Extras:
 - descendantsFilter allows to define which descendants are of interest for current provider.
 - Descendant providers of the same node name are not iterated when deep walking through children
   thus allowing them to keep control over their own descendants.
 - Descendant provider properties are overridden by ancestors controlling the same properties.
   Best practice is that one provider type has its own unique set of controlled properties
   which no other provider should compete with.
 - Descendants added at runtime (if they pass the filter of interest) are updated
 - Events are dispatched when descendants of interest are added/removed from DOM.
 - We rely on properties behaviour of the base dbui class which allows updating properties
   before component is upgraded.
 - Properties are passed down to all nodes of interest (dbui or not) unless onlyDeclaredProperties is true.
   However, onlyDeclaredProperties can be checked only on already upgraded components.
   Only rely on onlyDeclaredProperties flag when being certain that descendants of interest are already registered.
 - Provider properties are merged into properties static getter
   allowing this way to benefit from onPropertyChangedCallback hook and for value checking.
*/

function* getDescendants(parent, descendantsFilter, thisInstance) {
  const children = parent.children;
  const childrenLength = children.length;
  for (let i = 0; i < childrenLength; i += 1) {
    const child = children[i];
    // Stop iterating over nodes of the same type as thisInstance
    // so their properties don't get overridden by thisInstance.
    if (thisInstance.nodeName !== child.nodeName) {
      // If child is of interest for this provider yield it.
      if (descendantsFilter(child, thisInstance)) {
        yield child;
      }
      yield* getDescendants(child, descendantsFilter, thisInstance);
    }
  }
}

function setPropertyOnDescendant(descendant, self, name, onlyDeclaredProperties) {
  // Declared properties are indeed available sooner in
  // self.ownerDocument.defaultView.DBUIWebComponents.registrations[descendant.nodeName.toLowerCase()]
  // but even that does not completely resolves the problem of declared properties availability.
  if (!onlyDeclaredProperties || (descendant.constructor.properties || {})[name]) {
    descendant[name] = self[name];
  }
}

function setPropertiesOnDescendant(descendant, self, properties, onlyDeclaredProperties) {
  Object.entries(properties).forEach(([name]) => {
    setPropertyOnDescendant(descendant, self, name, onlyDeclaredProperties);
  });
}

const ContextProviderAware = ({
  // eslint-disable-next-line
  descendantsFilter = (descendant, self) => descendant.nodeName.startsWith('DBUI'),
  // onlyDeclaredProperties: true must be used with care
  // since declared properties are only available when descendant is already registered.
  // So, it should be used with confidence only when being sure that targeted descendants
  // are registered before provider.
  onlyDeclaredProperties = false,
  win = window,
  properties = {}
} = {}) => (Klass) => {

  class ContextProvider extends Klass {
    static get name() {
      return super.name;
    }

    static get properties() {
      return {
        ...super.properties,
        // Merging properties so that onPropertyChangedCallback just works.
        ...properties,
      };
    }

    constructor() {
      super();

      this._descendantsoObserver = new win.MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          const { addedNodes, removedNodes } = mutation;
          removedNodes.forEach((descendant) => {
            if (descendantsFilter(descendant, this)) {
              this.dispatchDbuiEvent('dbui-event-node-removed', { detail: { descendant, mutation } });
            }
          });
          addedNodes.forEach((descendant) => {
            if (descendantsFilter(descendant, this)) {
              // While un-mounted properties set on descendant will not trigger descendant#onPropertyChange
              // but new values will be visible on descendant#onConnectedCallback.
              setPropertiesOnDescendant(descendant, this, properties, onlyDeclaredProperties);
              this.dispatchDbuiEvent('dbui-event-node-added', { detail: { descendant, mutation } });
            }
          });
        });
      });
    }

    /**
     *
     * @return {IterableIterator<*|*>}
     */
    get descendants() {
      return getDescendants(this, descendantsFilter, this);
    }

    _onConnectedCallback() {
      super._onConnectedCallback();
      for (const descendant of this.descendants) {
        setPropertiesOnDescendant(descendant, this, properties, onlyDeclaredProperties);
      }

      this._descendantsoObserver.observe(this, {
        attributes: false, childList: true, subtree: true, characterData: false
      });
    }

    _onDisconnectedCallback() {
      super._onDisconnectedCallback();
      this._descendantsoObserver.disconnect();
    }

    // Not fired by base class while disconnected.
    onPropertyChangedCallback(name, oldValue, value) {
      super.onPropertyChangedCallback(name, oldValue, value);
      if (name in properties) {
        for (const descendant of this.descendants) {
          setPropertyOnDescendant(descendant, this, name, onlyDeclaredProperties);
        }
      }
    }

  }

  return ContextProvider;
};

export default ContextProviderAware;
