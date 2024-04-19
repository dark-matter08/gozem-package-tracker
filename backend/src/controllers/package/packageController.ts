import { Body, Delete, Example, Get, Path, Post, Put, Route, Tags } from 'tsoa';
import { PackageService } from '../../services';
import { ServiceResponse } from '../../utils';
import { Package } from '../../types/package.type';

@Route('/api/v1/package')
@Tags('Package Controller Operations')
export default class PackageController {
  private packageService: PackageService;
  public emailContext: string;
  constructor() {
    this.emailContext = '';
    this.packageService = new PackageService();
  }

  @Example<ServiceResponse<Partial<Package>>>({
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
  @Get('/')
  public async getAllPackages(): Promise<ServiceResponse<Package>> {
    return this.packageService.getAllPackages();
  }

  @Example<ServiceResponse<Partial<Package>>>({
    status: 200,
    message: 'success',
    data: {
      package_id: 'xxxx1',
      description: 'xxxx',
    },
  })
  @Get('/{packageId}')
  public async getPackageById(
    @Path() packageId: string
  ): Promise<ServiceResponse<Package>> {
    return this.packageService.getPackageById(packageId);
  }

  @Example<ServiceResponse<Partial<Package>>>({
    status: 201,
    message: 'success',
    data: {
      package_id: 'xxxx1',
      description: 'xxxx',
    },
  })
  @Post('/create')
  public async createNewPackage(
    @Body() data: Partial<Package>
  ): Promise<ServiceResponse<Package>> {
    return this.packageService.createNewPackage(data);
  }

  @Example<ServiceResponse<Partial<Package>>>({
    status: 201,
    message: 'success',
    data: {
      package_id: 'xxxx1',
      description: 'xxxx',
    },
  })
  @Put('/{packageId}')
  public async updatePackage(
    @Path() packageId: string,
    @Body() data: Partial<Package>
  ): Promise<ServiceResponse<Package>> {
    return this.packageService.updatePackage(packageId, data);
  }

  @Example<ServiceResponse<Partial<Package>>>({
    status: 201,
    message: 'success',
  })
  @Delete('/{packageId}')
  public async deletePackage(
    @Path() packageId: string
  ): Promise<ServiceResponse<Package>> {
    return this.packageService.deletePackage(packageId);
  }
}
