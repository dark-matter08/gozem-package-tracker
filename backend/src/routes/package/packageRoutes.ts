import express from 'express';
import { PackageController } from '../../controllers';

export default class PackageRoutes {
  public router: express.Router;
  private packageController: PackageController;
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
    this.packageController = new PackageController();
  }

  protected registerRoutes(): void {
    this.router.get('/', async (_req, res, _next) => {
      try {
        const result = await this.packageController.getAllPackages();
        res.status(result.status as number).send(result);
      } catch (e) {
        res.status(500).send({ status: 500, message: 'unknown Error' });
      }
    });
    this.router.get('/:id', async (req, res, _next) => {
      try {
        const result = await this.packageController.getPackageById(
          req.params.id
        );
        res.status(result.status as number).send(result);
      } catch (e) {
        res.status(500).send({ status: 500, message: 'unknown Error' });
      }
    });
    this.router.post('/create', async (req, res, _next) => {
      try {
        const result = await this.packageController.createNewPackage(req.body);
        res.status(result.status as number).send(result);
      } catch (e) {
        console.log(e);

        res.status(500).send({ status: 500, message: 'unknown Error' });
      }
    });
    this.router.put('/:id', async (req, res, _next) => {
      try {
        const result = await this.packageController.updatePackage(
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
        const result = await this.packageController.deletePackage(
          req.params.id
        );
        res.status(result.status as number).send(result);
      } catch (e) {
        res.status(500).send({ status: 500, message: 'unknown Error' });
      }
    });
  }
}
