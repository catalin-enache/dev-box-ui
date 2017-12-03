import React from 'react';

class DBUWebComponentScreen extends React.Component {
  render() {
    return (
      <div>

        <dbu-web-component
          style={{ color: 'blue' }}
        >
          <span>hello world 1</span>
        </dbu-web-component>

        <dbu-web-component
          style={{ color: 'blue' }}
          componentInstanceStyle="b{color:deepskyblue;}"
        >
          <span>hello world 2</span>
        </dbu-web-component>
        <dbu-web-component-parent></dbu-web-component-parent>

      </div>
    );
  }
}

export default DBUWebComponentScreen;
