import appendStyles from '../internals/appendStyles';

/**
* @param components Array<Object> [{
*  registrationName,
*  componentStyle,
*  ...
* }]
* @returns components Array<Object>
*/
const dbuiWebComponentsSetUp = (win) => (components) => {
  return appendStyles(win)(components);
};

export default dbuiWebComponentsSetUp;
