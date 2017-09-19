import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
  registerLocaleChange
} from 'dev-box-ui';

export default function localeAware(Component) {
  class LocaleAware extends React.PureComponent {
    constructor(props, context) {
      super(props, context);
      this.handleLocaleChange = this.handleLocaleChange.bind(this);
      this.unregisterLocaleChange = null;
    }

    handleLocaleChange() {
      this.forceUpdate();
    }

    componentDidMount() {
      this.unregisterLocaleChange = registerLocaleChange(this.handleLocaleChange);
    }

    componentWillUnmount() {
      this.unregisterLocaleChange();
    }

    render() {
      const locale = registerLocaleChange.getCurrentLocale();
      return (
        <Component { ...this.props } locale={locale} />
      );
    }
  }

  LocaleAware.displayName = `LocaleAware(${
    Component.displayName ||
    Component.name ||
    'Component'
  })`;

  return hoistNonReactStatics(LocaleAware, Component);
}
