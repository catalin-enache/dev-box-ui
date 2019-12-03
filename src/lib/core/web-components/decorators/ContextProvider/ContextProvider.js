
/*
TODO: add Behavior Extras
*/

function* getDescendants(self, descendantsFilter, thisInstance) {
  const children = self.children;
  const childrenLength = children.length;
  for (let i = 0; i < childrenLength; i += 1) {
    const child = children[i];
    // Stop iterating over nodes of the same time as self
    // so their properties don't get overridden by self.
    if (thisInstance.nodeName !== child.nodeName) {
      // If child is of interest for this provider yield it.
      if (descendantsFilter(child)) {
        yield child;
      }
      yield* getDescendants(child, descendantsFilter, thisInstance);
    }
  }
}

function setPropertyOnDescendant(descendant, self, name, onlyDeclaredProperties) {
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
  descendantsFilter = (descendant) => descendant.nodeName.startsWith('DBUI'),
  onlyDeclaredProperties = true,
  win = window,
  properties = {}
} = {}) => (Klass) => {

  class ContextProvider extends Klass {
    constructor() {
      super();

      this._descendantsoObserver = new win.MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          const { addedNodes } = mutation;
          addedNodes.forEach((descendant) => {
            if (descendantsFilter(descendant)) {
              setPropertiesOnDescendant(descendant, this, properties, onlyDeclaredProperties);
            }
          });
        });
      });
    }

    static get name() {
      return super.name;
    }

    static get properties() {
      return {
        ...super.properties,
        // Merge properties so that onPropertyChangedCallback just works.
        ...properties,
      };
    }

    _onConnectedCallback() {
      super._onConnectedCallback();
      for (const descendant of getDescendants(this, descendantsFilter, this)) {
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

    onPropertyChangedCallback(name, oldValue, value) {
      super.onPropertyChangedCallback(name, oldValue, value);
      if (name in properties) {
        for (const descendant of getDescendants(this, descendantsFilter, this)) {
          setPropertyOnDescendant(descendant, this, name, onlyDeclaredProperties);
        }
      }
    }

  }

  return ContextProvider;
};

export default ContextProviderAware;
