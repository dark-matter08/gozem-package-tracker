import { Delivery as DeliveryType, DeliveryModel } from '../../models';
import { Delivery } from '../../types/delivery.type';
import { ResponseCode, ServiceResponse } from '../../utils';
import { PackageService } from '../package';
import { IModelService, MongoService } from '../utils/mongo.service';

export default class DeliveryService {
  private mongoService: IModelService<DeliveryType>;
  private packageService: PackageService;
  constructor() {
    this.mongoService = new MongoService<DeliveryType>(DeliveryModel);
    this.packageService = new PackageService();
  }
  public async getAllDeliveries(): Promise<ServiceResponse<Delivery>> {
    const deliveries = await this.mongoService.read();

    // ToDo: Paginate data
    return {
      status: ResponseCode.HTTP_200_OK,
      message: `returning all deliveries`,
      data: deliveries as Delivery[],
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
        data: deliveryItem as Delivery,
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
    const deliveryItem = await this.mongoService.create(
      deliveryData as DeliveryType
    );
    // if (deliveryData.package_id) {
    //   const packageId = deliveryData.package_id.toString();
    //   await this.packageService.updatePackage(packageId, {
    //     active_delivery_id: deliveryItem._id,
    //   });
    // }
    return {
      status: ResponseCode.HTTP_201_CREATED,
      message: `successfully created new delivery`,
      data: deliveryItem as Delivery,
    };
  }

  public async updateDelivery(
    deliveryId: string,
    deliveryData: Partial<Delivery>
  ): Promise<ServiceResponse<Delivery>> {
    const deliveryItem = await this.mongoService.update(
      deliveryId,
      deliveryData as DeliveryType
    );

    if (deliveryItem) {
      return {
        status: ResponseCode.HTTP_200_OK,
        message: `delivery with id: ${deliveryId} has been update`,
        data: deliveryItem as Delivery,
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
