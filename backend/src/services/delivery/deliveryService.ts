import { Delivery as DeliveryType, DeliveryModel } from '../../models';
import { Delivery } from '../../types/delivery.type';
import { ResponseCode, ServiceResponse, Utils } from '../../utils';
import { DeliveryStatus } from '../../utils/enums';
import { PackageService } from '../package';
import { IModelService, MongoService } from '../utils/mongo.service';

export default class DeliveryService {
  private mongoService: IModelService<DeliveryType>;
  private packageService: PackageService;
  private utilService: Utils;
  constructor() {
    this.mongoService = new MongoService<DeliveryType>(DeliveryModel);
    this.packageService = new PackageService();
    this.utilService = new Utils();
  }

  public async getAllDeliveries(): Promise<ServiceResponse<Delivery[]>> {
    const deliveries = await this.mongoService.populate({
      fields: ['package_id'],
    });

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
    const deliveryItem = await this.mongoService.populateById(deliveryId, {
      fields: ['package_id'],
    });
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

  public async trackDelivery(
    deliveryId: string
  ): Promise<ServiceResponse<Delivery>> {
    const deliveryItem = await this.mongoService.populateOne(
      {
        fields: ['package_id'],
      },
      { delivery_id: deliveryId }
    );
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
    if (!deliveryData.package_id) {
      return {
        status: ResponseCode.HTTP_400_BAD_REQUEST,
        message: `package_id is required`,
      };
    }
    const packageItem = await this.packageService.getPackageById(
      deliveryData.package_id
    );
    if (!packageItem.data) {
      return {
        status: ResponseCode.HTTP_404_NOT_FOUND,
        message: `package with that id does not exist`,
      };
    }

    if (packageItem.data.active_delivery_id) {
      const activeDelivery = await this.getDeliveryById(
        packageItem.data.active_delivery_id
      );
      if (
        activeDelivery.data?.status === DeliveryStatus.open ||
        activeDelivery.data?.status === DeliveryStatus.in_transit ||
        activeDelivery.data?.status === DeliveryStatus.picked_up
      ) {
        return {
          status: ResponseCode.HTTP_409_CONFLICT,
          message: `this package is already linked to an active delivery`,
        };
      }
    }

    const deliveryId = this.utilService.generateRandomString(4, 'DEL');
    deliveryData.location = packageItem.data.from_location;
    deliveryData.delivery_id = deliveryId;
    const deliveryItem = await this.mongoService.create(
      deliveryData as DeliveryType
    );

    const packageId = deliveryData.package_id;
    await this.packageService.updatePackage(packageId, {
      active_delivery_id: deliveryItem._id,
    });

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

  public async updateDeliveryLocation(
    packageId: string,
    data: { location: { lat: number; lng: number } }
  ): Promise<ServiceResponse<Delivery>> {
    const findDelivery = await this.mongoService.read({
      package_id: packageId,
    });

    if (findDelivery.length < 1) {
      return {
        status: ResponseCode.HTTP_404_NOT_FOUND,
        message: `Delivery with package id: ${packageId} not found`,
      };
    }
    const deliveryItem = await this.mongoService.update(
      findDelivery[0]._id as string,
      {
        location: data.location,
      }
    );

    if (deliveryItem) {
      return {
        status: ResponseCode.HTTP_200_OK,
        message: `delivery with package id : ${packageId} has been update`,
        data: deliveryItem as Delivery,
      };
    }

    return {
      status: ResponseCode.HTTP_404_NOT_FOUND,
      message: `delivery with package: ${packageId} could not be updated`,
    };
  }
}
