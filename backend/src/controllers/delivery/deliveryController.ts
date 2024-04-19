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
        package_id: '----xxxxxx-----',
        pickup_time: new Date('2024-05-21T09:50:45.523Z'),
        start_time: new Date('2024-04-13T09:50:45.523Z'),
        end_time: new Date('2024-05-13T09:50:45.523Z'),
        location: {
          lat: 4.1121,
          lng: 9.313131,
        },
        status: 'open',
      },
      {
        package_id: '----xx4xxx-----',
        pickup_time: new Date('2024-05-21T09:50:45.523Z'),
        start_time: new Date('2024-04-13T09:50:45.523Z'),
        end_time: new Date('2024-05-13T09:50:45.523Z'),
        location: {
          lat: 4.1121,
          lng: 9.313131,
        },
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
      package_id: '----xx4xxx-----',
      pickup_time: new Date('2024-05-21T09:50:45.523Z'),
      start_time: new Date('2024-04-13T09:50:45.523Z'),
      end_time: new Date('2024-05-13T09:50:45.523Z'),
      location: {
        lat: 4.1121,
        lng: 9.313131,
      },
      status: 'picked-up',
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
      package_id: '----xx4xxx-----',
      pickup_time: new Date('2024-05-21T09:50:45.523Z'),
      start_time: new Date('2024-04-13T09:50:45.523Z'),
      end_time: new Date('2024-05-13T09:50:45.523Z'),
      location: {
        lat: 4.1121,
        lng: 9.313131,
      },
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
      package_id: '----xx4xxx-----',
      pickup_time: new Date('2024-05-21T09:50:45.523Z'),
      start_time: new Date('2024-04-13T09:50:45.523Z'),
      end_time: new Date('2024-05-13T09:50:45.523Z'),
      location: {
        lat: 4.1121,
        lng: 9.313131,
      },
      status: 'picked-up',
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
