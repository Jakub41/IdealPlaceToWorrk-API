import Logger from '../loaders/logger';
import User from '../models';

// An example of a controller for an endpoint
// Use this only as a starting point
const UserController = {
  async getAll(req, res, next) {
    try {
      return await res.status(200).json({ msg: 'Hello' });
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },

  async createNew(req, res, next) {
    try {
      //   const user = new UserModel({
      //     ...req.body,
      //   });

      const user = new User.UserModel({ ...req.body });

      if (!user) {
        Logger.error('USer body not right');
        return res.status(400).json({ msg: ' something wrong' });
      }

      await user.save();

      return res.status(200).json({ msg: 'User created' });
    } catch (error) {
      Logger.error(error);
      return next(error);
    }
  },
};

export default UserController;
