/* eslint-disable operator-linebreak */
/* eslint-disable no-continue */
import fetch from 'node-fetch';
import DB from '../models/index';
import Logger from '../loaders/logger';
import GoogleHelper from '../helpers/GoogleApiHelper';
import { googleApi } from '../config/index';

// eslint-disable-next-line consistent-return
const checkPlaceInOurDBAndAddIfNeeded = async (name) => {
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
        GoogleId: googlePlaces.candidates[i].place_id,
      });
      if (duplacetInOurDB) {
        Logger.info('place already exists in our db');
        return null;
      }
      // eslint-disable-next-line no-use-before-define
      return GoogleHelper.addPlaceToDb(googlePlaces.candidates[i].place_id);
    }
    return null;
  } catch (err) {
    Logger.error(err);
  }
};
// https://maps.googleapis.com/maps/api/place/textsearch/json?query=cowork+cafe+in+'Berlin'&key=AIzaSyDlkDftixlz_nvsxuPi0flAOP_0Cc6poBE

// eslint-disable-next-line consistent-return
const checkPlacesOfSpecifcCityInDBOrAddToOurDb = async (location) => {
  try {
    const googlePlacesRespone = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=cowork+cafe+in+${location}&key=${googleApi.key}`,
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

export default {
  checkPlaceInOurDBAndAddIfNeeded,
  checkPlacesOfSpecifcCityInDBOrAddToOurDb,
};
