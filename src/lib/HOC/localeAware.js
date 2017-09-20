import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
  localeService
} from 'dev-box-ui';

export default function localeAware(Component) {
  class LocaleAware extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.handleLocaleChange = this.handleLocaleChange.bind(this);
      this.unregisterLocaleChange = null;
      this.state = {
        locale: localeService.locale
      };
    }

    handleLocaleChange(locale) {
      this.state.locale !== locale && this.setState({
        locale
      });
    }

    componentDidMount() {
      this.unregisterLocaleChange = localeService.onLocaleChange(this.handleLocaleChange);
    }

    componentWillUnmount() {
      this.unregisterLocaleChange();
    }

    render() {
      const { locale } = this.state;
      return (
        <Component { ...this.props } locale={ locale } />
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
