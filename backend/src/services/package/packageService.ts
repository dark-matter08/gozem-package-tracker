import { PackageModel, Package as PackageType } from '../../models';
import { Package } from '../../types/package.type';
import { ResponseCode, ServiceResponse } from '../../utils';
import { IModelService, MongoService } from '../utils/mongo.service';

export default class PackageService {
  private mongoService: IModelService<PackageType>;
  constructor() {
    this.mongoService = new MongoService<PackageType>(PackageModel);
  }
  public async getAllPackages(): Promise<ServiceResponse<Package[]>> {
    const packages = await this.mongoService.read();

    // ToDo: Paginate data
    return {
      status: ResponseCode.HTTP_200_OK,
      message: `returning all packages`,
      data: packages as Package[],
    };
  }

  public async getPackageById(
    packageId: string
  ): Promise<ServiceResponse<Package>> {
    const packageItem = await this.mongoService.populate(packageId, {
      fields: ['active_delivery_id'],
    });
    if (packageItem) {
      return {
        status: ResponseCode.HTTP_200_OK,
        message: `return package with id: ${packageId}`,
        data: packageItem as Package,
      };
    }

    return {
      status: ResponseCode.HTTP_404_NOT_FOUND,
      message: `Package with id: ${packageId} not found`,
    };
  }

  public async createNewPackage(
    packageData: Partial<Package>
  ): Promise<ServiceResponse<Package>> {
    const packageItem = await this.mongoService.create(
      packageData as PackageType
    );
    return {
      status: ResponseCode.HTTP_201_CREATED,
      message: `successfully created new package`,
      data: packageItem as Package,
    };
  }

  public async updatePackage(
    packageId: string,
    packageData: Partial<Package>
  ): Promise<ServiceResponse<Package>> {
    const packageItem = await this.mongoService.update(
      packageId,
      packageData as PackageType
    );

    if (packageItem) {
      return {
        status: ResponseCode.HTTP_200_OK,
        message: `package with id: ${packageId} has been update`,
        data: packageItem as Package,
      };
    }

    return {
      status: ResponseCode.HTTP_404_NOT_FOUND,
      message: `Package with id: ${packageId} not found`,
    };
  }

  public async deletePackage(
    packageId: string
  ): Promise<ServiceResponse<Package>> {
    try {
      await this.mongoService.delete(packageId);

      return {
        status: ResponseCode.HTTP_202_ACCEPTED,
        message: 'package delete successfully',
      };
    } catch (error) {
      return {
        status: ResponseCode.HTTP_404_NOT_FOUND,
        message: `Package with id: ${packageId} not found`,
      };
    }
  }
}
