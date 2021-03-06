import React from 'react';
import PropTypes from 'prop-types';
import FaSpinner from 'react-icons/lib/fa/spinner';
import List from '../List/List';
import World from '../World/World';
import localeAware from '../../decorators/localeAware';
import getDBUII18nService from './../../../core/services/DBUII18nService';
import template from '../../../core/utils/template';

const i18nService = getDBUII18nService(window);

i18nService.registerTranslations({
  en: {
    Hello: template`Hello ${'age'} ${'name'}`
  },
  other: {
    Hello: template`Hola ${'age'} ${'name'}`
  }
});

const listItems = ['one', 'two'];


class Hello extends React.PureComponent {
  render() {
    const { translations } = this.props;
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Hello component');
    }
    return (
      <div>
        {translations.Hello && translations.Hello({ age: 22, name: this.props.name || 'Nobody' })}
        <FaSpinner />
        <List items={ listItems }/>
        <List items={ listItems }/>
        <World />
        <World />
      </div>
    );
  }
}

Hello.propTypes = {
  translations: PropTypes.object,
  name: PropTypes.string.isRequired
};

export default localeAware(Hello);

