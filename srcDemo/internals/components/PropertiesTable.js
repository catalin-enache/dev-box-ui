import React from 'react';
import PropTypes from 'prop-types';
// defines generateComponentPropertiesTable on window
import '../../screens/js/onWindowDefinedHelpers';

class PropertiesTable extends React.Component {
  componentDidMount() {
    window.generateComponentPropertiesTable(this.props.properties);
  }

  render() {
    return <div className="properties" />;
  }
}

PropertiesTable.propTypes = {
  properties: PropTypes.object
};

export default PropertiesTable;
