/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
/* eslint-disable radix */
/* eslint-disable implicit-arrow-linebreak */
import geoip from 'geoip-lite';
import DB from '../models/index';
import Logger from '../loaders/logger';
import Service from '../services/index';
import { Filter } from '../helpers';
// import { googleApi } from '../config/index';

// basic route for places done (all we have to do is to add filtering option)

const PlacesController = {
  async getAll(req, res, next) {
    try {
      const places = await Filter.filter(req, 'places').then(
        (response) => response,
      );
      if (places) {
        Logger.info('Places found');
        return res.status(200).json(places);
      }
      Logger.error('Places not found');
      return res.status(404).json('places not found');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async getSpecificPlace(req, res, next) {
    try {
      const place = await DB.Place.findById(req.params.placeId);
      if (place) {
        return res.status(200).json(place);
      }
      return res.status(404).json('place not found');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async addPlace(req, res, next) {
    try {
      Logger.info(req.user);
      const placesSchema = {
        // eslint-disable-next-line no-underscore-dangle
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const place = await DB.Place.create(placesSchema);
      if (!place) {
        Logger.error('Place was not added. Something went wrong');
        return res
          .status(400)
          .send('Place was not added. Something went wrong');
      }
      if (req.user) {
        await DB.User.findOneAndUpdate(
          // eslint-disable-next-line no-underscore-dangle
          { _id: req.user._id },
          // eslint-disable-next-line no-underscore-dangle
          { $push: { addedPlaces: place._id } },
        );
      }
      Logger.info('Place was added successfully.');
      return res.status(200).send(place);
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async updateSpecificPlace(req, res, next) {
    try {
      const placeData = await DB.Place.findById(req.params.placeId);
      // eslint-disable-next-line no-underscore-dangle
      const userId = req.user._id.toString();
      const incomingData = req.body;
      if (placeData.userId === userId) {
        const updatedPlace = await DB.Place.findByIdAndUpdate(
          req.params.placeId,
          incomingData,
          { new: true },
        );
        if (updatedPlace) {
          return res.status(200).json(updatedPlace);
        }
        return res.status(500).send('Place was not updated. Please try later');
      }
      return res.status(400).send('not authorised');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async deletePlace(req, res, next) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const userId = req.user._id.toString();
      const placeData = await DB.Place.findById(req.params.placeId);
      if (placeData.posterId === userId) {
        // eslint-disable-next-line no-unused-vars
        const removed = await DB.Place.findByIdAndRemove(req.params.placeId);
        await DB.User.findByIdAndUpdate(userId, {
          $pull: { addedPlaces: req.params.placeId },
        });
        return res.status(200).json('Deleted');
      }
      return res.status(500).send('Was not deleted');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async findSpecificPlace(req, res, next) {
    try {
      const placesFromGoogle = await Service.GoogleService.checkPlaceInOurDBAndAddIfNeeded(
        req.body.searchQuery,
      );
      let places = [];
      if (placesFromGoogle || placesFromGoogle === null) {
        places = await DB.Place.find({
          Name: { $regex: new RegExp(req.body.searchQuery, 'i') },
        });
      }
      if (places.length === 0) {
        Logger.error('Nothing was found');
        return res.status(404).send('Nothing was found');
      }
      Logger.info('List of places.ok');
      return res.status(200).send(places);
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async findPlacesForSpecificArea(req, res, next) {
    try {
      // i'm using hardcoded ip cause i can't get my public ip lol but this info should be
      // in req.ip after we won't be using localhost
      const geo = geoip.lookup('2a02:a318:8240:6200:45b2:79d6:3bb5:9665');
      const location = geo.city;
      Logger.info(location);
      // eslint-disable-next-line max-len
      const placesFromGoogle = await Service.GoogleService.checkPlacesOfSpecifcCityInDBOrAddToOurDb(
        'Berlin',
      );
      let places = [];
      if (placesFromGoogle || placesFromGoogle === null) {
        places = await DB.Place.find({
          Location: { $regex: new RegExp('Berlin', 'i') },
        });
      }
      if (places.length === 0) {
        Logger.error('Nothing was found');
        return res.status(404).send('Nothing was found');
      }
      Logger.info('List of places.ok');
      return res.status(200).send(places);
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async removeAddPlacesToFavourite(req, res, next) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const user = await DB.User.findById(req.user._id);
      if (user) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < user.favouritePlaces.length; i++) {
          if (user.favouritePlaces[i].toString() === req.params.placeId) {
            user.favouritePlaces.splice(i, 1);
            user.save();
            Logger.info('Place was removed from favourites');
            return res.status(200).send(user);
          }
        }
        user.favouritePlaces.push(req.params.placeId);
        user.save();
        Logger.info('Place was added to favourites');
        return res.status(200).send(user);
      }
      // eslint-disable-next-line max-len
      Logger.info('User was not found. Unauthorized');
      return res.status(404).send('User was not found. Unauthorized');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
};

export default PlacesController;
