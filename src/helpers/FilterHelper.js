/* eslint no-unused-expressions: ["error", { "allowShortCircuit": true, "allowTernary": true }] */
import DB from '../models/index';
import Logger from '../loaders/logger';

const filter = async (req, type) => {
  const match = {};
  const sort = {};
  let listOfObjects = [];
  // eslint-disable-next-line object-curly-newline
  // Query const
  // eslint-disable-next-line object-curly-newline
  const { wifi, limit, sortBy, OrderBy, skip } = req.query;

  // Wifi in query we filter only places with WiFi === True
  if (wifi) {
    Logger.info('WiFI', wifi);
    match.Wifi = wifi === 'true';
  }

  // We can sortBy or OrderBy => sortBy = Nam || OrderBy = desc
  if (sortBy || OrderBy) {
    Logger.info('Sorting');
    sort[sortBy] = OrderBy === 'desc' ? -1 : 1;
  }
  Logger.info(JSON.stringify(sort));
  if (type === 'places') {
    listOfObjects = await DB.Place.find(match)
      .limit(parseInt(limit, 10)) // limit result per pag => 10 a radix validator
      .skip(parseInt(skip, 10)) // skip results
      .sort(sort); // sort results
    // Count of the results
    listOfObjects.total = await DB.Place.find({}).countDocuments();
    listOfObjects.totalWifi = await DB.Place.find({
      Wifi: true,
    }).countDocuments();
  } else if (type === 'users') {
    listOfObjects = await DB.User.find(match)
      .limit(parseInt(limit, 10)) // limit result per pag
      .skip(parseInt(skip, 10)) // skip results
      // Count of the results
      .sort(sort); // sort results
    listOfObjects.total = await DB.User.find({}).countDocuments();
  } else if (type === 'reviews') {
    listOfObjects = await DB.Review.find(match)
      .limit(parseInt(limit, 10)) // limit result per pag
      .skip(parseInt(skip, 10)) // skip results
      .sort(sort); // sort results
    // Count of the results
    listOfObjects.total = await DB.Review.find({}).countDocuments();
  }
  /**
   * !Wifi — This is set to true, and we will get the wifi places only
   * !limit & skip — Both the values are set to 2,
   * !we will iterate up to the second page with 2 records if we have any
   * !sortBy — This is set to createdAt. The field on which the sorting will be performed
   * !OrderBy — This is set to desc. It will sort posts in descending order.
   */
  //   Logger.info(listOfObjects);
  return listOfObjects;
};

export default { filter };
