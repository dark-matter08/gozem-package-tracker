import { Delivery, DeliveryModel } from '../../models';
import { ResponseCode, ServiceResponse } from '../../utils';
import { IModelService, MongoService } from '../utils/mongo.service';

export default class DeliveryService {
  private mongoService: IModelService<Delivery>;
  constructor() {
    this.mongoService = new MongoService<Delivery>(DeliveryModel);
  }
  public async getAllDeliveries(): Promise<ServiceResponse<Delivery[]>> {
    const deliveries = await this.mongoService.read();

    // ToDo: Paginate data
    return {
      status: ResponseCode.HTTP_200_OK,
      message: `returning all deliveries`,
      data: deliveries,
    };
  }

  public async getDeliveryById(
    deliveryId: string
  ): Promise<ServiceResponse<Delivery>> {
    const deliveryItem = await this.mongoService.readById(deliveryId);
    if (deliveryItem) {
      return {
        status: ResponseCode.HTTP_200_OK,
        message: `returning delivery with id: ${deliveryId}`,
        data: deliveryItem,
      };
    }

    return {
      status: ResponseCode.HTTP_404_NOT_FOUND,
      message: `delivery with id: ${deliveryId} not found`,
    };
  }

  public async createNewDelivery(
    deliveryData: Partial<Delivery>
  ): Promise<ServiceResponse<Delivery>> {
    const deliveryItem = await this.mongoService.create(deliveryData);
    return {
      status: ResponseCode.HTTP_201_CREATED,
      message: `successfully created new delivery`,
      data: deliveryItem,
    };
  }

  public async updateDelivery(
    deliveryId: string,
    deliveryData: Partial<Delivery>
  ): Promise<ServiceResponse<Delivery>> {
    const deliveryItem = await this.mongoService.update(
      deliveryId,
      deliveryData
    );

    if (deliveryItem) {
      return {
        status: ResponseCode.HTTP_200_OK,
        message: `delivery with id: ${deliveryId} has been update`,
        data: deliveryItem,
      };
    }

    return {
      status: ResponseCode.HTTP_404_NOT_FOUND,
      message: `delivery with id: ${deliveryId} not found`,
    };
  }

  public async deleteDelivery(
    deliveryId: string
  ): Promise<ServiceResponse<Delivery>> {
    try {
      await this.mongoService.delete(deliveryId);
      return {
        status: ResponseCode.HTTP_202_ACCEPTED,
        message: 'delivery delete successfully',
      };
    } catch (error) {
      return {
        status: ResponseCode.HTTP_404_NOT_FOUND,
        message: `Delivery with id: ${deliveryId} not found`,
      };
    }
  }
}
