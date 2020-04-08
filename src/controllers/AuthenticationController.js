import randomstring from 'randomstring';
import Logger from '../loaders/logger';
// eslint-disable-next-line import/no-named-as-default
import auth from '../config/auth/index';
import Service from '../services/index';
// eslint-disable-next-line import/named
import DB from '../models';
import Middleware from '../middleware';

const AuthController = {
  async registerUser(req, res, next) {
    try {
      const userSchema = {
        ...req.body,
        emailToken: randomstring.generate(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Validate password
      const isValid = Middleware.isValidPassword.validate(req.body.password);
      const failedRules = Middleware.isValidPassword.validate(
        req.body.password,
        {
          list: true,
        },
      );

      // Not valid message and list failed rules otherwise register
      if (isValid === false) {
        Logger.info('Invalid password', failedRules);
        return res
          .status(400)
          .json({ msg: 'Password invalid', rules: failedRules });
      }

      const user = await DB.User.register(userSchema, req.body.password);
      // Redis
      Middleware.cache.post_set(req, user, '/api/v1/users');
      if (!user) {
        Logger.error('User was not created. Something went wrong');
        return res
          .status(500)
          .send('User was not created. Something went wrong');
      }

      // sending an email verification to user
      const html = `Hello, thank you that you have choosen us!
      <br/>
      Please click on this email to verify your email
      <br/>
      http://localhost:3000/callback/${user.emailToken}
      `;
      const email = await Service.emailService.sendEmail(
        'idealPlaceToWork@gmail.com',
        user.username,
        'verification email',
        html,
      );
      Logger.info(email, user.username);
      if (!email) {
        Logger.error('Email was not sent. Something went wrong');
      }
      Logger.info('User and token created successfully.');
      return res.status(200).send({ user });
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
  async verifyEmail(req, res, next) {
    try {
      const user = await DB.User.findOne({ emailToken: req.params.emailToken });
      if (user) {
        user.active = true;
        user.save();
      }
      // eslint-disable-next-line no-underscore-dangle
      const token = auth.getToken({ _id: user._id });
      Logger.info('user');
      if (!user) {
        Logger.error('User was not found. Something went wrong');
        return res.status(404).send('User was not found. Something went wrong');
      }
      return res.status(200).send({ user, accessToken: token });
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async authRedirect(req, res, next) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const token = auth.getToken({ _id: req.user._id });
      return res.redirect(
        `http://localhost:3000/callback?token=${token}&username=${req.user.username}`,
      );
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
};

export default AuthController;
