import express from 'express';
import { DeliveryController } from '../../controllers/delivery';

export default class DeliveryRoutes {
  public router: express.Router;
  private deliveryController: DeliveryController;

  constructor() {
    this.router = express.Router();
    this.registerRoutes();
    this.deliveryController = new DeliveryController();
  }

  protected registerRoutes(): void {
    this.router.get('/', async (_req, res, _next) => {
      try {
        const result = await this.deliveryController.getAllDeliveries();
        res.status(result.status as number).send(result);
      } catch (e) {
        res.status(500).send({ status: 500, message: 'unknown Error' });
      }
    });
    this.router.get('/:id', async (req, res, _next) => {
      try {
        const result = await this.deliveryController.getDeliveryById(
          req.params.id
        );
        res.status(result.status as number).send(result);
      } catch (e) {
        res.status(500).send({ status: 500, message: 'unknown Error' });
      }
    });
    this.router.post('/create', async (req, res, _next) => {
      try {
        const result = await this.deliveryController.createNewDelivery(
          req.body
        );
        res.status(result.status as number).send(result);
      } catch (e) {
        res.status(500).send({ status: 500, message: 'unknown Error' });
      }
    });
    this.router.put('/:id', async (req, res, _next) => {
      try {
        const result = await this.deliveryController.updateDelivery(
          req.params.id,
          req.body
        );
        res.status(result.status as number).send(result);
      } catch (e) {
        res.status(500).send({ status: 500, message: 'unknown Error' });
      }
    });
    this.router.delete('/:id', async (req, res, _next) => {
      try {
        const result = await this.deliveryController.deleteDelivery(
          req.params.id
        );
        res.status(result.status as number).send(result);
      } catch (e) {
        res.status(500).send({ status: 500, message: 'unknown Error' });
      }
    });
    this.router.get('/track/:deliveryId', async (req, res, _next) => {
      try {
        const result = await this.deliveryController.trackDelivery(
          req.params.deliveryId
        );
        res.status(result.status as number).send(result);
      } catch (error) {
        res.status(500).send({ status: 500, message: 'unknown Error' });
      }
    });
  }
}
