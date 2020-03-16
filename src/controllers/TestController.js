import logger from '../loaders/logger';

// An example of a controller for an endpoint
const TestController = {
  async getAll(req, res, next) {
    try {
      // const params = req.params.id;
      // console.log(params);
      return await res.status(200).json({ msg: 'Hello' });
    } catch (err) {
      logger.error('🔥 error: %o', err);
      return next(err);
    }
  },
};

export default TestController;
