import fetch from 'node-fetch';
import DB from '../models/index';
import Logger from '../loaders/logger';
import { googleApi } from '../config/index';

// eslint-disable-next-line consistent-return
const addPlaceToDb = async (placeId) => {
  try {
    const fullInfoFronGoogleApiResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?key=${googleApi.key}&place_id=${placeId}`,
    );
    const photos = [];
    const fullInfoFronGoogleApi = await fullInfoFronGoogleApiResponse.json();
    if (
      // eslint-disable-next-line operator-linebreak
      fullInfoFronGoogleApi.result.name === 'Undefined' ||
      fullInfoFronGoogleApi.result.name === 'undefined'
    ) {
      return null;
    }
    if (fullInfoFronGoogleApi.result.photos) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < fullInfoFronGoogleApi.result.photos.length; i++) {
        photos.push(
          `https://maps.googleapis.com/maps/api/place/photo?photoreference=${fullInfoFronGoogleApi.result.photos[i].photo_reference}&key=${googleApi.key}&maxwidth=1600`,
        );
      }
    }
    const placeFromGoogleSchema = {
      Website:
        // eslint-disable-next-line operator-linebreak
        fullInfoFronGoogleApi.result.website &&
        fullInfoFronGoogleApi.result.website,
      Name: fullInfoFronGoogleApi.result.name,
      Location: fullInfoFronGoogleApi.result.formatted_address,
      Types: fullInfoFronGoogleApi.result.types,
      Coordinates: {
          coordinates : [
          fullInfoFronGoogleApi.result.geometry.location.lat,
          fullInfoFronGoogleApi.result.geometry.location.lng
        ]
      },
      OpenHours:
        // eslint-disable-next-line operator-linebreak
        fullInfoFronGoogleApi.result.opening_hours.weekday_text &&
        fullInfoFronGoogleApi.result.opening_hours.weekday_text,
      // to work on pictures and to add link that can be used on fe
      Pictures: photos.length > 0 && photos,
      PriceToEnter: fullInfoFronGoogleApi.result.price_level
        ? fullInfoFronGoogleApi.result.price_level
        : -1,
      RateAverage: fullInfoFronGoogleApi.result.rating,
      IsReferencedOnGoogle: true,
      GoogleId: placeId,
      // timaestamps instead of handwritting
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const placeToSave = await DB.Place.create(placeFromGoogleSchema);
    if (placeToSave) {
      Logger.info('Ok');
      return placeToSave;
    }
    Logger.info('Something went wrong. Please try later');
    return null;
  } catch (err) {
    Logger.error(err);
  }
};

export default { addPlaceToDb };
