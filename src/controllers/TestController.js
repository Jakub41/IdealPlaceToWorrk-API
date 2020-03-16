import Logger from '../loaders/logger';

// An example of a controller for an endpoint
const TestController = {
  async getAll(req, res, next) {
    try {
      const params = req.params.id;
      // console.log(params);
      return await res.status(200).json({ msg: 'Hello', params });
    } catch (err) {
      Logger.error('🔥 Error: %o', err);
      return next(err);
    }
  },
};

export default TestController;
