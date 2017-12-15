import React from 'react';
import PropTypes from 'prop-types';
import localeAware from '../../../src/lib/HOC/localeAware';

let IFrameScreen = class IFrameScreen extends React.Component {
  constructor(props) {
    super(props);
    this.iframeNode = null;
  }

  componentWillReceiveProps(nextProps) {
    const { locale: { dir } } = nextProps;
    this.iframeNode.contentWindow.postMessage(`changeDir ${dir}`, '*');
  }

  render() {
    const isProd = !window.location.pathname.includes('.dev.');
    const windowLocationHash = window.location.hash.replace('#', '');
    return (
      <iframe
        ref={(node) => this.iframeNode = node}
        src={`srcDemo/screens/${windowLocationHash}?production=${isProd ? '1' : '0'}`} />
    );
  }
};
IFrameScreen.propTypes = {
  locale: PropTypes.shape({
    dir: PropTypes.string,
    lang: PropTypes.string
  })
};
IFrameScreen = localeAware(IFrameScreen);

export default IFrameScreen;
