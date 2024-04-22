import { Delivery } from '../models';

export interface Package {
  package_id: string;
  active_delivery_id?: string;
  description: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  from_name: string;
  from_address: string;
  from_location: {
    lat: number;
    lng: number;
  };
  to_name: string;
  to_address: string;
  to_location: {
    lat: number;
    lng: number;
  };
}

export type PackageInput = Omit<
  Package,
  'package_id' | 'active_delivery_id' | 'active_delivery'
>;
