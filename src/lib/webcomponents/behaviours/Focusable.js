
export default function Focusable(Klass) {
  class Focusable extends Klass {
    static get propertiesToDefine() {
      const inheritedPropertiesToDefine = super.propertiesToDefine;
      return {
        ...inheritedPropertiesToDefine,
        someNewProperty: 'xxx'
      };
    }
  }
  Focusable.originalName = Klass.name;
  return Focusable;
}
