import { Package, PackageModel } from '../../models';
import { ResponseCode, ServiceResponse } from '../../utils';
import { IModelService, MongoService } from '../utils/mongo.service';

export default class PackageService {
  private mongoService: IModelService<Package>;
  constructor() {
    this.mongoService = new MongoService<Package>(PackageModel);
  }
  public async getAllPackages(): Promise<ServiceResponse<Package[]>> {
    const packages = await this.mongoService.read();

    // ToDo: Paginate data
    return {
      status: ResponseCode.HTTP_200_OK,
      message: `returning all packages`,
      data: packages,
    };
  }

  public async getPackageById(
    packageId: string
  ): Promise<ServiceResponse<Package>> {
    const packageItem = await this.mongoService.readById(packageId);
    if (packageItem) {
      return {
        status: ResponseCode.HTTP_200_OK,
        message: `return package with id: ${packageId}`,
        data: packageItem,
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
    const packageItem = await this.mongoService.create(packageData);
    return {
      status: ResponseCode.HTTP_201_CREATED,
      message: `successfully created new package`,
      data: packageItem,
    };
  }

  public async updatePackage(
    packageId: string,
    packageData: Partial<Package>
  ): Promise<ServiceResponse<Package>> {
    const packageItem = await this.mongoService.update(packageId, packageData);

    if (packageItem) {
      return {
        status: ResponseCode.HTTP_200_OK,
        message: `package with id: ${packageId} has been update`,
        data: packageItem,
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
