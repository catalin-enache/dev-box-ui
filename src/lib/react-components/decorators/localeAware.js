import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import getDBUILocaleService from './../../core/services/DBUILocaleService';
import getDBUII18nService from './../../core/services/DBUII18nService';

const localeService = getDBUILocaleService(window);
const i18nService = getDBUII18nService(window);

export default function localeAware(Component) {
  class LocaleAware extends React.Component {
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
          translations={ i18nService.translations[locale.lang] || {} }
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
