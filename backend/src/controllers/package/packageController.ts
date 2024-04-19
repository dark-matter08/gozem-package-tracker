import { Body, Delete, Example, Get, Path, Post, Put, Route, Tags } from 'tsoa';
import { Health, Package } from '../../models';
import { HealthService, PackageService } from '../../services';
import { ServiceResponse } from '../../utils';

@Route('/api/v1/package')
@Tags('Package Controller Operations')
export default class PackageController {
  private packageService: PackageService;
  public emailContext: string;
  constructor() {
    this.emailContext = '';
    this.packageService = new PackageService();
  }

  @Get('/')
  @Example<ServiceResponse<Partial<Package>[]>>({
    status: 200,
    message: 'success',
    data: [
      {
        package_id: 'xxxx1',
        description: 'xxxx',
      },
      {
        package_id: 'xxxx2',
        description: 'xxxxxxxx',
      },
    ],
  })
  public async getAllPackages(): Promise<ServiceResponse<Package[]>> {
    return this.packageService.getAllPackages();
  }

  @Get('/{packageId}')
  @Example<ServiceResponse<Partial<Package>>>({
    status: 200,
    message: 'success',
    data: {
      package_id: 'xxxx1',
      description: 'xxxx',
    },
  })
  public async getPackageById(
    @Path() packageId: string
  ): Promise<ServiceResponse<Package>> {
    return this.packageService.getPackageById(packageId);
  }

  @Post('/create')
  @Example<ServiceResponse<Partial<Package>>>({
    status: 201,
    message: 'success',
    data: {
      package_id: 'xxxx1',
      description: 'xxxx',
    },
  })
  public async createNewPackage(
    @Body() data: Partial<Package>
  ): Promise<ServiceResponse<Package>> {
    return this.packageService.createNewPackage(data);
  }

  @Put('/{packageId}')
  @Example<ServiceResponse<Partial<Package>>>({
    status: 201,
    message: 'success',
    data: {
      package_id: 'xxxx1',
      description: 'xxxx',
    },
  })
  public async updatePackage(
    @Path() packageId: string,
    @Body() data: Partial<Package>
  ): Promise<ServiceResponse<Package>> {
    return this.packageService.updatePackage(packageId, data);
  }

  @Delete('/{packageId}')
  @Example<ServiceResponse<Partial<Package>>>({
    status: 201,
    message: 'success',
  })
  public async deletePackage(
    @Path() packageId: string
  ): Promise<ServiceResponse<Package>> {
    return this.packageService.deletePackage(packageId);
  }
}
