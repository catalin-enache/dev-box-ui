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
      this._mounted = false;
      this._component = null;
    }

    handleLocaleChange(locale) {
      this._mounted && this.state.locale !== locale && this.setState({
        locale
      });
    }

    componentDidMount() {
      this.unregisterLocaleChange = localeService.onLocaleChange(this.handleLocaleChange);
      this._mounted = true;
    }

    componentWillUnmount() {
      this._mounted = false;
      this.unregisterLocaleChange();
    }

    render() {
      const { locale } = this.state;
      return (
        <Component { ...this.props }
          locale={ locale }
          translations={ i18nService.currentLangTranslations }
          ref={ comp => this._component = comp }
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
