import React from 'react';

class DBUWebComponentDummyScreen extends React.Component {
  render() {
    return (
      <div>

        <dbu-web-component-dummy
          style={{ color: 'blue' }}
        >
          <span>hello world 1</span>
        </dbu-web-component-dummy>

        <dbu-web-component-dummy
          style={{ color: 'blue' }}
          componentInstanceStyle="b{color:deepskyblue;}"
        >
          <span>hello world 2</span>
        </dbu-web-component-dummy>
        <dbu-web-component-dummy-parent></dbu-web-component-dummy-parent>

      </div>
    );
  }
}

export default DBUWebComponentDummyScreen;
