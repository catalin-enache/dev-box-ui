import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import localeService from './../services/LocaleService';
import i18nService from './../services/I18nService';

export default function localeAware(Component) {
  class LocaleAware extends React.PureComponent {
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
        <Component { ...this.props }
          locale={ locale }
          translations={ i18nService.currentLangTranslations }
        />
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
