import express from 'express';
import { HealthRoutes } from './authorization';
import { APPCONFIGS } from '../configs';
import { PackageRoutes } from './package';
import { DeliveryRoutes } from './delivery';

// const authMiddleware = new AuthUtils().verifyLoggedInUser;
const routes = (server: express.Application): void => {
  server.use(`${APPCONFIGS.BASE_PATH}/health`, new HealthRoutes().router);
  server.use(`${APPCONFIGS.BASE_PATH}/package`, new PackageRoutes().router);
  server.use(`${APPCONFIGS.BASE_PATH}/delivery`, new DeliveryRoutes().router);
};

export default routes;
