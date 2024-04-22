import express from 'express';
import { DeliveryController } from '../../controllers/delivery';
import { Server, Socket } from 'socket.io';
import { ioInstance, socketInstance } from '../../utils/socket-service';

export default class DeliveryRoutes {
  public router: express.Router;
  private deliveryController: DeliveryController;
  private socketInstance: Socket | null;
  private ioInstance: Server;

  constructor() {
    this.router = express.Router();
    this.registerRoutes();
    this.deliveryController = new DeliveryController();
    this.socketInstance = socketInstance;
    this.ioInstance = ioInstance;
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
        const result = await this.deliveryController.deleteDelivery(
          req.params.deliveryId
        );
        res.status(result.status as number).send(result);
      } catch (error) {
        res.status(500).send({ status: 500, message: 'unknown Error' });
      }
    });
    this.router.post('/update-location/:id', async (req, res, _next) => {
      try {
        // const result = await this.deliveryController.updateDeliveryLocation(
        //   req.params.id,
        //   req.body
        // );

        res.send({ hi: 'hello' });
        this.ioInstance?.to(req.params.id).emit('location_changed', {
          tunnelId: req.params.id,
          data: req.body.location,
        });
        return;
      } catch (e) {
        return res.status(500).send({ status: 500, message: 'unknown Error' });
      }
    });
  }
}
