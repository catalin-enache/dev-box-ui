import React from 'react';
import PropTypes from 'prop-types';
import localeAware from '../../behaviours/localeAware';
import getDBUII18nService from './../../../web-components/services/DBUII18nService';
import template from '../../../web-components/utils/template';

const i18nService = getDBUII18nService(window);

i18nService.registerTranslations({
  en: {
    list: template`list`
  },
  sp: {
    list: template`lista`
  }
});

class List extends React.PureComponent {
  render() {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering List component');
    }
    return (
      <div>
        {this.props.translations.list()}
        <ul>
          {this.props.items.map(item => <li key={item}>{item}</li>)}
        </ul>
      </div>
    );
  }
}

List.defaultProps = {
  items: []
};

List.propTypes = {
  items: PropTypes.array,
  translations: PropTypes.object
};

export default localeAware(List);
