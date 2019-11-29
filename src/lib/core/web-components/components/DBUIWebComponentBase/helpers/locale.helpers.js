
// eslint-disable-next-line
export function propagateLocaleAttributes(self, name, newValue) {
  if (name === 'dir' || name === 'lang') {
    if (newValue === null) {
      self.hasAttribute(`dbui-${name}`) && self.removeAttribute(`dbui-${name}`);
    } else {
      self.setAttribute(`dbui-${name}`, newValue);
    }
    [...self.shadowRoot.querySelectorAll('[dbui-web-component]')].forEach((shadowAncestor) => {
      if (newValue === null) {
        shadowAncestor.removeAttribute(name);
      } else {
        shadowAncestor.setAttribute(name, newValue);
      }
    });
  }
}
