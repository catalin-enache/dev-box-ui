import React from 'react';

class DBUWebComponentDummyScreen extends React.Component {
  render() {
    return (
      <div>

        <dbu-web-component-dummy
          style={{ color: 'blue' }}
        >
          <span>hello 1</span>
        </dbu-web-component-dummy>

        <dbu-web-component-dummy
          style={{ color: 'blue' }}
        >
          <span>hello 2</span>
        </dbu-web-component-dummy>
        <dbu-web-component-dummy-parent>hello 3</dbu-web-component-dummy-parent>

      </div>
    );
  }
}

export default DBUWebComponentDummyScreen;
