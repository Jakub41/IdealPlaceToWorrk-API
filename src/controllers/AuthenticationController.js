import Logger from '../loaders/logger';
import auth from '../config/auth/index';
// eslint-disable-next-line import/named
import DB from '../models';

const AuthController = {
  async registerUser(req, res, next) {
    try {
      const userSchema = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const user = await DB.User.register(userSchema, req.body.password);
      // eslint-disable-next-line no-underscore-dangle
      const token = auth.getToken({ _id: req.user._id });
      if (!user) {
        Logger.error('User was not created. Something went wrong');
        return res
          .status(500)
          .send('User was not created. Something went wrong');
      }
      if (!token) {
        Logger.error('Token was not created. Something went wrong');
        return res
          .status(500)
          .send('Token was not created. Something went wrong');
      }
      Logger.info('User and token created successfully.');
      return res.status(200).send({ user, token });
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async loginUser(req, res, next) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const token = auth.getToken({ _id: req.user._id });
      Logger.info(token);
      if (!token) {
        Logger.error('Token was not created. Something went wrong');
        return res
          .status(401)
          .send('Token was not created. Something went wrong');
      }
      return res.status(200).send({ user: req.user, accessToken: token });
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async refreshToken(req, res, next) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const token = auth.getToken({ _id: req.user._id });
      Logger.info(token);
      if (!token) {
        Logger.error('Token was not created. Something went wrong');
        return res
          .status(401)
          .send('Token was not created. Something went wrong');
      }
      return res.status(200).send({ user: req.user, accessToken: token });
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
};

export default AuthController;
