import { Body, Delete, Example, Get, Path, Post, Put, Route, Tags } from 'tsoa';
import { DeliveryService } from '../../services';
import { ServiceResponse } from '../../utils';
import { Delivery } from '../../types/delivery.type';

@Route('/api/v1/delivery')
@Tags('Delivery Controller Operations')
export default class DeliveryController {
  private deliveryService: DeliveryService;
  public emailContext: string;
  constructor() {
    this.emailContext = '';
    this.deliveryService = new DeliveryService();
  }

  @Get('/')
  @Example<ServiceResponse<Partial<Delivery>>>({
    status: 200,
    message: 'success',
    data: [
      {
        delivery_id: 'xxxx1',
        status: 'open',
      },
      {
        delivery_id: 'xxxx2',
        status: 'picked-up',
      },
    ],
  })
  public async getAllDeliveries(): Promise<ServiceResponse<Delivery>> {
    return this.deliveryService.getAllDeliveries();
  }

  @Get('/{deliveryId}')
  @Example<ServiceResponse<Partial<Delivery>>>({
    status: 200,
    message: 'success',
    data: {
      delivery_id: 'xxxx2',
      status: 'open',
    },
  })
  public async getDeliveryById(
    @Path() deliveryId: string
  ): Promise<ServiceResponse<Delivery>> {
    return this.deliveryService.getDeliveryById(deliveryId);
  }

  @Post('/create')
  @Example<ServiceResponse<Partial<Delivery>>>({
    status: 201,
    message: 'success',
    data: {
      delivery_id: 'xxxx2',
      status: 'open',
    },
  })
  public async createNewDelivery(
    @Body() data: Partial<Delivery>
  ): Promise<ServiceResponse<Delivery>> {
    return this.deliveryService.createNewDelivery(data);
  }

  @Put('/{deliveryId}')
  @Example<ServiceResponse<Partial<Delivery>>>({
    status: 201,
    message: 'success',
    data: {
      delivery_id: 'xxxx2',
      status: 'open',
    },
  })
  public async updateDelivery(
    @Path() deliveryId: string,
    @Body() data: Partial<Delivery>
  ): Promise<ServiceResponse<Delivery>> {
    return this.deliveryService.updateDelivery(deliveryId, data);
  }

  @Delete('/{deliveryId}')
  @Example<ServiceResponse<Partial<Delivery>>>({
    status: 201,
    message: 'success',
  })
  public async deleteDelivery(
    @Path() deliveryId: string
  ): Promise<ServiceResponse<Delivery>> {
    return this.deliveryService.deleteDelivery(deliveryId);
  }
}
