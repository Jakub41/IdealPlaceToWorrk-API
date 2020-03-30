import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import FacebookStrategy from 'passport-facebook';
import jwt from 'jsonwebtoken';
import basicAuth from 'express-basic-auth';
import atob from 'atob';
import Logger from '../../loaders/logger';
import { jwtKey, facebookConfig, googleOAuthConfig } from '../index';
import DB from '../../models/index';
// eslint-disable-next-line import/order
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(DB.User.serializeUser());
passport.deserializeUser(DB.User.deserializeUser());

const jwtConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtKey.secretKey,
};

passport.use(
  new Strategy(jwtConfig, (jwtPayload, next) => {
    // eslint-disable-next-line no-underscore-dangle
    DB.User.findById(jwtPayload._id, (err, user) => {
      if (err) return next(err, null);
      if (user) return next(null, user);
      // eslint-disable-next-line no-sequences
      return null, false;
    });
  }),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: googleOAuthConfig.client_id,
      clientSecret: googleOAuthConfig.client_secret,
      callbackURL: 'http://localhost:9100/api/v1/auth/google/callback',
    },
    // eslint-disable-next-line consistent-return
    async (token, refreshToken, profile, cb) => {
      try {
        Logger.info(profile);
        // eslint-disable-next-line no-console
        console.log(profile);
        const user = await DB.User.findOne({ googleId: profile.id });
        if (user) {
          return cb(null, user);
        }
        const newUser = await DB.User.create({
          googleId: profile.id,
          active: true,
          firstname: profile.displayName.split(' ')[0],
          lastname: profile.displayName.split(' ')[1],
          username: profile.displayName,
          picture: profile.picture,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return cb(null, newUser);
      } catch (err) {
        return cb(err);
      }
    },
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: facebookConfig.appId,
      clientSecret: facebookConfig.secretKey,
      callbackURL: 'http://localhost:9100/api/v1/auth/facebook/callback',
    },
    async (token, refreshToken, profile, cb) => {
      try {
        Logger.info(profile);
        // eslint-disable-next-line no-console
        console.log(profile);
        const user = await DB.User.findOne({ facebookId: profile.id });
        if (user) {
          return cb(null, user);
        }
        const newUser = await DB.User.create({
          facebookId: profile.id,
          active: true,
          firstname: profile.displayName.split(' ')[0],
          lastname: profile.displayName.split(' ')[1],
          username: profile.displayName,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return cb(null, newUser);
      } catch (err) {
        return cb(err);
      }
    },
  ),
);

const checkInMongoose = async (username, password, cb) => {
  const authResult = await DB.User.authenticate()(username, password);
  return cb(null, authResult.user);
};

export default {
  basic: basicAuth({
    authorizer: checkInMongoose,
    authorizeAsync: true,
  }),
  setUserInfo: async (req, res, next) => {
    const username = atob(req.headers.authorization.split(' ')[1]).split(
      ':',
    )[0];
    req.user = await DB.User.findOne({ username });

    // Checking if the user is active if not stop here with message
    // else continue the login
    if (req.user.active === false) {
      Logger.info('User is not active');
      return res.status(400).json('User is not active!');
    }

    Logger.info('User is active');

    return next();
  },
  getToken: (userInfo) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    jwt.sign(userInfo, jwtKey.secretKey, { expiresIn: 10000 }),
};
