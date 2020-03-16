import Logger from '../loaders/logger';

// An example of a controller for an endpoint
// Use this only as a starting point
const TestController = {
  async getAll(req, res, next) {
    try {
      const params = req.params.id;
      // console.log(params);
      return await res.status(200).json({ msg: 'Hello', id });
    } catch (err) {
      Logger.error('🔥', err);
      return next(err);
    }
  },
};

export default TestController;
