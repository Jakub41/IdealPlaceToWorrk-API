import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { FacebookStrategy } from 'passport-facebook';
import jwt from 'jsonwebtoken';
import basicAuth from 'express-basic-auth';
import atob from 'atob';
import { jwtKey } from '../index';
import DB from '../../models/index';

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

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: facebookConfig.appId,
//       clientSecret: facebookConfig.secretKey,
//       callbackURL: 'http://localhost:9000/auth/facebook/callback',
//     },
//     (accessToken, refreshToken, profile, cb) => {
//       DB.User.findOrCreate(
//         { facebookId: profile.id, active: true },
//         (err, user) => cb(err, user),
//         // eslint-disable-next-line function-paren-newline
//       );
//     },
//   ),
// );

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
    next();
  },
  getToken: (userInfo) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    jwt.sign(userInfo, jwtKey.secretKey, { expiresIn: 10000 }),
};
