/* eslint-disable no-param-reassign */
// To capitalize the first letter like name to Name
const capitalize = (string) => {
  if (typeof string !== 'string') string = '';
  return string.charAt(0).toUpperCase() + string.substring(1);
};

export default capitalize;
