import emailService from './emailService';

export default emailService;

/*
 async emailVerification(req, res, next) {
    try {
      Logger.info(req.user);
      // eslint-disable-next-line no-underscore-dangle
      const user = await DB.User.findOne({
        _id: req.user._id,
      });
      const html = `We are concerned about your safety.
      <br/>
      Please follow the link to confirm your identity
      <br/>
      http://localhost:9000/api/v1/emailverification/${req.user._id}
      `;
      const email = await emailService.sendEmail(
        'idealPlaceToWork@gmail.com',
        req.user.username,
        'verification email',
        html,
      );
      if (!user) {
        Logger.error('User was not found');
        res.status(404).send('User not found');
      }
      if (!email) {
        Logger.error('Email was not sent');
        res.status(404).send('Email was not sent');
      }
      return res.status(200).send('ok');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  }, */
