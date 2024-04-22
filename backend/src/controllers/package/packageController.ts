import { Body, Delete, Example, Get, Path, Post, Put, Route, Tags } from 'tsoa';
import { PackageService } from '../../services';
import { ServiceResponse } from '../../utils';
import { Package, PackageInput } from '../../types/package.type';

@Route('/api/v1/package')
@Tags('Package Controller Operations')
export default class PackageController {
  private packageService: PackageService;
  public emailContext: string;
  constructor() {
    this.emailContext = '';
    this.packageService = new PackageService();
  }

  @Example<ServiceResponse<Partial<Package>[]>>({
    status: 200,
    message: 'success',
    data: [
      {
        description: 'hello 00000xxx000',
        weight: 32,
        width: 12,
        height: 43,
        depth: 19,
        from_name: 'xxxxhimxxxxx',
        from_address: 'xxxxxfromxxxxx',
        from_location: {
          lat: 41.2222,
          lng: 45.12112,
        },
        to_name: 'xxxxxherxxxxx',
        to_address: 'xxxxxxwherexxx',
        to_location: {
          lat: 21.1212,
          lng: 32.12121,
        },
      },
      {
        description: 'shoksssss 00000xxx000',
        weight: 32,
        width: 12,
        height: 43,
        depth: 19,
        from_name: 'xxxxherxxxxx',
        from_address: 'xxxxxfromxxxxx',
        from_location: {
          lat: 41.2222,
          lng: 45.12112,
        },
        to_name: 'xxxxxhimxxxxx',
        to_address: 'xxxxxxwherexxx',
        to_location: {
          lat: 21.1212,
          lng: 32.12121,
        },
      },
    ],
  })
  @Get('/')
  public async getAllPackages(): Promise<ServiceResponse<Package[]>> {
    return this.packageService.getAllPackages();
  }

  @Example<ServiceResponse<Partial<Package>[]>>({
    status: 200,
    message: 'success',
    data: [
      {
        description: 'hello 00000xxx000',
        weight: 32,
        width: 12,
        height: 43,
        depth: 19,
        from_name: 'xxxxhimxxxxx',
        from_address: 'xxxxxfromxxxxx',
        from_location: {
          lat: 41.2222,
          lng: 45.12112,
        },
        to_name: 'xxxxxherxxxxx',
        to_address: 'xxxxxxwherexxx',
        to_location: {
          lat: 21.1212,
          lng: 32.12121,
        },
      },
      {
        description: 'shoksssss 00000xxx000',
        weight: 32,
        width: 12,
        height: 43,
        depth: 19,
        from_name: 'xxxxherxxxxx',
        from_address: 'xxxxxfromxxxxx',
        from_location: {
          lat: 41.2222,
          lng: 45.12112,
        },
        to_name: 'xxxxxhimxxxxx',
        to_address: 'xxxxxxwherexxx',
        to_location: {
          lat: 21.1212,
          lng: 32.12121,
        },
      },
    ],
  })
  @Get('/')
  public async getOpenPackages(): Promise<ServiceResponse<Package[]>> {
    return this.packageService.getOpenPackages();
  }

  @Example<ServiceResponse<Partial<Package>>>({
    status: 200,
    message: 'success',
    data: {
      description: 'hello 00000xxx000',
      weight: 32,
      width: 12,
      height: 43,
      depth: 19,
      from_name: 'xxxxhimxxxxx',
      from_address: 'xxxxxfromxxxxx',
      from_location: {
        lat: 41.2222,
        lng: 45.12112,
      },
      to_name: 'xxxxxherxxxxx',
      to_address: 'xxxxxxwherexxx',
      to_location: {
        lat: 21.1212,
        lng: 32.12121,
      },
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
      description: 'hello 00000xxx000',
      weight: 32,
      width: 12,
      height: 43,
      depth: 19,
      from_name: 'xxxxhimxxxxx',
      from_address: 'xxxxxfromxxxxx',
      from_location: {
        lat: 41.2222,
        lng: 45.12112,
      },
      to_name: 'xxxxxherxxxxx',
      to_address: 'xxxxxxwherexxx',
      to_location: {
        lat: 21.1212,
        lng: 32.12121,
      },
    },
  })
  @Post('/create')
  public async createNewPackage(
    @Body() data: PackageInput
  ): Promise<ServiceResponse<Package>> {
    return this.packageService.createNewPackage(data);
  }

  @Example<ServiceResponse<Partial<Package>>>({
    status: 201,
    message: 'success',
    data: {
      description: 'hello 00000xxx000',
      weight: 32,
      width: 12,
      height: 43,
      depth: 19,
      from_name: 'xxxxhimxxxxx',
      from_address: 'xxxxxfromxxxxx',
      from_location: {
        lat: 41.2222,
        lng: 45.12112,
      },
      to_name: 'xxxxxherxxxxx',
      to_address: 'xxxxxxwherexxx',
      to_location: {
        lat: 21.1212,
        lng: 32.12121,
      },
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

  @Example<ServiceResponse<Partial<Package>>>({
    status: 200,
    message: 'success',
    data: {
      description: 'hello 00000xxx000',
      weight: 32,
      width: 12,
      height: 43,
      depth: 19,
      from_name: 'xxxxhimxxxxx',
      from_address: 'xxxxxfromxxxxx',
      from_location: {
        lat: 41.2222,
        lng: 45.12112,
      },
      to_name: 'xxxxxherxxxxx',
      to_address: 'xxxxxxwherexxx',
      to_location: {
        lat: 21.1212,
        lng: 32.12121,
      },
    },
  })
  @Get('/track/{packageId}')
  public async trackPackage(
    @Path() packageId: string
  ): Promise<ServiceResponse<Package>> {
    return this.packageService.trackPackage(packageId);
  }
}
