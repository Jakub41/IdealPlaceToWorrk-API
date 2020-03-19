import Logger from '../loaders/logger';
// eslint-disable-next-line import/named
import DB from '../models';

const UserController = {
  async getAllUsers(req, res, next) {
    try {
      const users = await DB.User.find({});
      if (!users) {
        Logger.error('User was not found');
        return res.status(404).send('Nothing found');
      }
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
      Logger.info(`User with id ${req.params.userId} was found`);
      return res.status(200).send(user);
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async updateUser(req, res, next) {
    try {
      // const userSchema = {
      //   ...req.body,
      //   updatedAt: new Date(),
      // };
      const user = await DB.User.findOneAndUpdate(
        { _id: req.params.userId },
        { updatedAt: new Date() },
        req.body,
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
      Logger.info(`User with id ${req.params.userId} was deleted`);
      return res.status(200).send('Ok');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
};

export default UserController;
