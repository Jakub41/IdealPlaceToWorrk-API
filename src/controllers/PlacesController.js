import fetch from 'node-fetch';
import DB from '../models/index';
import Logger from '../loaders/logger';
import { googleApi } from '../config/index';

const PlacesController = {
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
  async searchForPlaces(req, res, next) {
    try {
      let places = [];
      if (req.query.search) {
        places = await DB.Place.find({
          Name: { $regex: req.query.search },
        });
      } else {
        places = await DB.Place.find();
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
  async getDataFromGoogle(req, res, next) {
    try {
      // eslint-disable-next-line no-undef
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=open+night+cafe+in+warsaw&key=${googleApi.key}`,
      );
      Logger.info(googleApi.key);
      const places = await resp.json();
      return res.status(200).send(places.results);
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async findSpecificPlace(req, res, next) {
    try {
      const places = await DB.Place.find({
        Name: { $regex: req.body.searchQuery },
      });
      return res.status(200).send(places);
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
};

export default PlacesController;
