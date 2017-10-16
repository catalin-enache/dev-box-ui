import React from 'react';
import PropTypes from 'prop-types';
import FaSpinner from 'react-icons/lib/fa/spinner';
import List from '../List/List';
import World from '../World/World';
import themeAware from '../../HOC/themeAware';
import localeAware from '../../HOC/localeAware';
import i18nService from './../../services/I18nService';
import template from '../../utils/template';

i18nService.registerTranslations({
  en: {
    'Hello': template`Hello ${'age'} ${'name'}`
  },
  sp: {
    'Hello': template`Hola ${'age'} ${'name'}`
  }
});

const listItems = ['one', 'two'];


const style = ({ vars }) => {
  return {
    hello: {
      color: vars.colors.primaryColor || 'orange'
    }
  };
};

class Hello extends React.PureComponent {
  render() {
    const { theme, translations } = this.props;
    if (process.env.NODE_ENV !== 'production') {
      /* eslint no-console: 0 */
      // console.log('rendering Hello component');
    }
    return (
      <div className={ this.props.classes.hello }>
        {translations.Hello({ age: 22, name: this.props.name || 'Nobody' })}
        <FaSpinner className={ theme.animations.dbuAnimationSpin }/>
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
  theme: PropTypes.object,
  name: PropTypes.string.isRequired,
  classes: PropTypes.object
};

export default themeAware({ style })(localeAware(Hello));

