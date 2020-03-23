import fetch from 'node-fetch';
import DB from '../models/index';
import Logger from '../loaders/logger';
import { googleApi } from '../config/index';

// eslint-disable-next-line consistent-return
const checkPlaceInOurDBAndAddInNeeded = async (name) => {
  try {
    const googlePlacesRespone = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${googleApi.key}&input=${name}&inputtype=textquery`,
    );
    const googlePlaces = await googlePlacesRespone.json();
    // eslint-disable-next-line vars-on-top
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < googlePlaces.candidates.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const duplacetInOurDB = await DB.Place.findOne({
        googleId: googlePlaces.candidates[i].place_id,
      });
      if (duplacetInOurDB) {
        return Logger.info('place already exists in our db');
      }
      // eslint-disable-next-line no-use-before-define
      return addPlaceToDb(googlePlaces.candidates[i].place_id);
    }
  } catch (err) {
    Logger.error(err);
  }
};

const addPlaceToDb = async (placeId) => {
  const fullInfoFronGoogleApiResponse = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${googleApi.key}&place_id=${placeId}`,
  );
  const fullInfoFronGoogleApi = await fullInfoFronGoogleApiResponse.json();
  const placeFromGoogleSchema = {
    Name: fullInfoFronGoogleApi.result.name,
    Location: fullInfoFronGoogleApi.result.formatted_address,
    Type: fullInfoFronGoogleApi.result.types,
    OpenHours:
      fullInfoFronGoogleApi.result.opening_hours.weekday_text || 'undefined',
    // to work on pictures and to add link that can be used on fe
    Pictures: fullInfoFronGoogleApi.result.photos,
    PriceToEnter: fullInfoFronGoogleApi.result.price_level || -1,
    RateAverage: fullInfoFronGoogleApi.result.rating,
    isReferencedOnGoogle: true,
    GoogleId: placeId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const placeToSave = await DB.Place.create(placeFromGoogleSchema);
  if (placeToSave) {
    return placeToSave;
  }
  return Logger.info('Something went wrong. Please try later');
};

export default { checkPlaceInOurDBAndAddInNeeded };
