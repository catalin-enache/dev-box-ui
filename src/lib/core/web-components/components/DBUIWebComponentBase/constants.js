
export const arrayOrObject = new Set(['Array', 'Object']);
export const undefinedOrNull = new Set([undefined, null]);
export const stringOrNumber = new Set(['String', 'Number']);
export const mapOrSet = new Set(['Map', 'Set']);
export const booleanAttributeValue = '';
export const supportsAdoptingStyleSheets =
    ('adoptedStyleSheets' in Document.prototype) &&
    ('replace' in CSSStyleSheet.prototype);
