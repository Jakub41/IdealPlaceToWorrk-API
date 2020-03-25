/* eslint-disable implicit-arrow-linebreak */
import beautify from 'js-beautify';

// Helper to have a JSON output in console formatted
const jsonOutHelper = (data) =>
  beautify(data, { indent_size: 2, space_in_empty_paren: true });

export default jsonOutHelper;
