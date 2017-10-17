import React from 'react';
import {
  FormInputNumber,
  themeAware
} from 'dev-box-ui';

const style = ({ vars }) => {
  return {
    screen: {
      color: vars.colors.primaryTextColor || 'orange'
    },
    formInputNumber: {
      '&:focus': {
        color: 'red',
        boxShadow: '3px 3px 3px #888888'
      }
    }
  };
};

class FormInputNumberScreen extends React.Component {
  render() {
    const { theme, classes } = this.props;
    return (
      <div>
        <FormInputNumber inputExtraClasses={[
          theme.common.withoutBorderBottomLeftRadius,
          classes.formInputNumber
        ]} />
      </div>
    );
  }
}

export default themeAware({ style })(FormInputNumberScreen);
