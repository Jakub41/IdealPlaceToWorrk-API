/* eslint-disable no-underscore-dangle */
import Logger from '../loaders/logger';
import Redis from '../middleware';
import Service from '../services/index';
import { FilterHelper } from '../helpers';

// eslint-disable-next-line import/named
import DB from '../models';

const UserController = {
  async getAllUsers(req, res, next) {
    try {
      // const users = await DB.User.find({});
      const users = await FilterHelper.filter(req, 'users').then(
        (response) => response,
      );
      if (!users) {
        Logger.error('User was not found');
        return res.status(404).send('Nothing found');
      }
      // Redis cache
      Redis.cache.set_All(req, JSON.stringify(users), next);
      Logger.info('All the users were found');
      return res.status(200).send(users);
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async getSpecificUser(req, res, next) {
    try {
      const user = await DB.User.findOne({ _id: req.params.userId });
      if (!user) {
        Logger.error('User was not found');
        return res.status(404).send('User not found');
      }
      // Redis
      Redis.cache.set_Specific_Data(req, JSON.stringify(user), next);
      Logger.info(`User with id ${req.params.userId} was found`);
      return res.status(200).send(user);
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async getMyself(req, res, next) {
    try {
      const user = await DB.User.findById(req.user._id).populate(
        'favouritePlaces',
      );
      if (!user) {
        Logger.error('User was not found');
        return res.status(404).send('User not found');
      }
      // Redis
      // Redis.cache.set_Specific_Data(req, JSON.stringify(user), next);
      return res.status(200).send(user);
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async updateUser(req, res, next) {
    try {
      if (req.body.newPassword) {
        const user = await DB.User.findOne({
          emailToken: req.params.emailToken,
        });
        if (user) {
          user.active = true;
          user.setPassword(req.body.newPassword);
          user.save();
          Redis.cache.update_Specific_Data(req, JSON.stringify(user), next);
          Logger.info('New password was set successfully');
          return res.status(200).send('New password was set successfully');
        }
        Logger.error('User was not found');
        return res.status(404).send('User was not found');
      }
      if (req.params.userId) {
        const user = await DB.User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: { updatedAt: new Date(), ...req.body } },
          // eslint-disable-next-line arrow-body-style
          (err, doc) => {
            if (err) return err;
            return doc;
          },
          { new: true },
          { returnOriginal: false },
        );
        if (!user) {
          Logger.error('User was not updated');
          return res.status(500).send('User not updated');
        }
        Logger.info(`User with id ${req.params.userId} was updated`);
        return res.status(200).send(user);
      }
      return res.status(400).send('Bad request');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async deleteUser(req, res, next) {
    try {
      const user = await DB.User.findByIdAndDelete({ _id: req.params.userId });
      if (!user) {
        Logger.error('User was not found');
        return res.status(404).send('User not found');
      }
      Redis.cache.set_Delete_data(req, JSON.stringify(user), next);
      Logger.info(`User with id ${req.params.userId} was deleted`);
      return res.status(200).send('Ok');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async verifyEmail(req, res, next) {
    try {
      // username
      const user = await DB.User.findOne({
        username: req.body.username,
      });
      if (!user) {
        Logger.error('User was not found');
        res.status(404).send('User not found');
      }
      user.active = false;
      user.save();
      const html = `We are concerned about your safety.
      <br/>
      Please follow the link to confirm your identity
      <br/>
      http://localhost:9000/api/v1/users/resetpassword/${req.user.emailToken}
      `;
      const email = await Service.emailService.sendEmail(
        'idealPlaceToWork@gmail.com',
        req.user.username,
        'verification email',
        html,
      );
      if (!email) {
        Logger.error('Email was not sent');
        res.status(404).send('Email was not sent');
      }
      return res.status(200).send('ok');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
};

export default UserController;
