import { Types } from '../mongodb';
import { Package } from './package.type';

export interface Delivery {
  delivery_id: string;
  active_delivery_id: string;
  package_id: Package;
  pickup_time: Date;
  start_time: Date;
  end_time: Date;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
}
