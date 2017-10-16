import React from 'react';
import {
  FormInputNumber,
  themeAware
} from 'dev-box-ui';

const style = ({ vars }) => {
  return {
    screen: {
      color: vars.colors.primaryTextColor || 'orange'
    }
  };
};

class FormInputNumberScreen extends React.Component {
  render() {
    return (
      <div>
        <FormInputNumber />
      </div>
    );
  }
}

export default themeAware({ style })(FormInputNumber);
