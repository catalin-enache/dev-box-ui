import React from 'react';
import PropTypes from 'prop-types';

class PropertiesTable extends React.Component {
  componentDidMount() {
    // re-using the helper defined for iFrame
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
