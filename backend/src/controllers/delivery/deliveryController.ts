import { Body, Delete, Example, Get, Path, Post, Put, Route, Tags } from 'tsoa';
import { Delivery } from '../../models';
import { DeliveryService } from '../../services';
import { ServiceResponse } from '../../utils';

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
  @Example<ServiceResponse<Partial<Delivery>[]>>({
    status: 200,
    message: 'success',
    data: [
      {
        delivery_id: 'xxxx1',
        status: 'xxxx',
      },
      {
        delivery_id: 'xxxx2',
        status: 'xxxxxxxx',
      },
    ],
  })
  public async getAllDeliveries(): Promise<ServiceResponse<Delivery[]>> {
    return this.deliveryService.getAllDeliveries();
  }

  @Get('/{deliveryId}')
  @Example<ServiceResponse<Partial<Delivery>>>({
    status: 200,
    message: 'success',
    data: {
      delivery_id: 'xxxx2',
      status: 'xxxxxxxx',
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
      status: 'xxxxxxxx',
    },
  })
  public async createNewDelivery(
    @Body() data: Partial<Delivery>
  ): Promise<ServiceResponse<Delivery>> {
    return this.deliveryService.createNewDelivery(data);
  }

  @Put('/update/{deliveryId}')
  @Example<ServiceResponse<Partial<Delivery>>>({
    status: 201,
    message: 'success',
    data: {
      delivery_id: 'xxxx2',
      status: 'xxxxxxxx',
    },
  })
  public async updateDelivery(
    @Path() deliveryId: string,
    @Body() data: Partial<Delivery>
  ): Promise<ServiceResponse<Delivery>> {
    return this.deliveryService.updateDelivery(deliveryId, data);
  }

  @Delete('/delete/{deliveryId}')
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
