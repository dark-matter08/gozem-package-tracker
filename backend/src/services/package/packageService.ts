import { PackageModel, Package as PackageType } from '../../models';
import { Package } from '../../types/package.type';
import { ResponseCode, ServiceResponse, Utils } from '../../utils';
import { IModelService, MongoService } from '../utils/mongo.service';

export default class PackageService {
  private mongoService: IModelService<PackageType>;
  private utilService: Utils;

  constructor() {
    this.mongoService = new MongoService<PackageType>(PackageModel);
    this.utilService = new Utils();
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

  public async getOpenPackages(): Promise<ServiceResponse<Package[]>> {
    const packages = await this.mongoService.read({ active_delivery_id: null });

    console.log(packages);

    // ToDo: Paginate data
    return {
      status: ResponseCode.HTTP_200_OK,
      message: `returning all packages with no deliveries`,
      data: packages as Package[],
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
        data: packageItem as Package,
      };
    }

    return {
      status: ResponseCode.HTTP_404_NOT_FOUND,
      message: `Package with id: ${packageId} not found`,
    };
  }

  public async trackPackage(
    packageId: string
  ): Promise<ServiceResponse<Package>> {
    const packageItem = await this.mongoService.populateOne(
      {
        fields: ['active_delivery_id'],
      },
      { package_id: packageId }
    );

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
    const packageId = this.utilService.generateRandomString(4, 'PAK');
    packageData.package_id = packageId;
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
