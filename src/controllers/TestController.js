import Logger from '../loaders/logger';

// An example of a controller for an endpoint
// Use this only as a starting point
const TestController = {
  async getAll(req, res, next) {
    try {
      // Just as a test try to params params to id and you will see the error
      const params = req.params.id;
      // console.log(params);
      return await res.status(200).json({ msg: 'Hello', params });
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
};

export default TestController;
