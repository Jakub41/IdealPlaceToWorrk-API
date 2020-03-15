import { Router } from 'express';
import shopify from './shopifyGitHub';

export default () => {
  const app = Router();

  shopify(app);

  return app;
};
