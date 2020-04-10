/* eslint-disable operator-linebreak */
/* eslint-disable no-continue */
import fetch from 'node-fetch';
import DB from '../models/index';
import Logger from '../loaders/logger';
import GoogleHelper from '../helpers/GoogleApiHelper';
import { googleApi } from '../config/index';

// eslint-disable-next-line consistent-return
const checkPlaceInOurDBAndAddIfNeeded = async (name, latitude, longitude) => {
  try {
    const googlePlacesRespone = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?&query=${name}&location=${latitude},${longitude}&radius=10000&key=${googleApi.key}`,
    );
    const googlePlaces = await googlePlacesRespone.json();
    // eslint-disable-next-line vars-on-top
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < googlePlaces.results.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const duplacetInOurDB = await DB.Place.findOne({
        GoogleId: googlePlaces.results[i].place_id,
      });
      if (duplacetInOurDB) {
        Logger.info('place already exists in our db');
        continue;
      }
      // eslint-disable-next-line no-use-before-define
      GoogleHelper.addPlaceToDb(googlePlaces.results[i].place_id);
    }
    return null;
  } catch (err) {
    Logger.error(err);
  }
};
// https://maps.googleapis.com/maps/api/place/textsearch/json?query=cowork+cafe+in+'Berlin'&key

const checkPlacesOfSpecifcCityInDBOrAddToOurDb = async (
  latitude,
  longitude,
  token,
  // eslint-disable-next-line consistent-return
) => {
  try {
    const googlePlacesRespone = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?&query=coffee+work+cowork&location=${latitude},${longitude}&radius=10000&key=${googleApi.key}&pagetoken=${token}`,
    );
    const googlePlaces = await googlePlacesRespone.json();
    // eslint-disable-next-line vars-on-top
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < googlePlaces.results.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const duplacetInOurDB = await DB.Place.findOne({
        GoogleId: googlePlaces.results[i].place_id,
      });
      if (duplacetInOurDB) {
        Logger.info('place already exists in our db');
        continue;
      }
      // eslint-disable-next-line no-use-before-define
      GoogleHelper.addPlaceToDb(googlePlaces.results[i].place_id);
    }
    if (googlePlaces.next_page_token) {
      checkPlacesOfSpecifcCityInDBOrAddToOurDb(
        latitude,
        longitude,
        googlePlaces.next_page_token,
      );
    }
    return null;
  } catch (err) {
    Logger.error(err);
  }
};

export default {
  checkPlaceInOurDBAndAddIfNeeded,
  checkPlacesOfSpecifcCityInDBOrAddToOurDb,
};
