import express from 'express';
import { HealthRoutes } from './authorization';
import { APPCONFIGS } from '../configs';

// const authMiddleware = new AuthUtils().verifyLoggedInUser;
const routes = (server: express.Application): void => {
  server.use(`${APPCONFIGS.BASE_PATH}/health`, new HealthRoutes().router);
};

export default routes;
