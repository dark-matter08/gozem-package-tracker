import { Package } from './package.type';

export interface Delivery {
  _id: string;
  delivery_id: string;
  package_id?: Package | string;
  pickup_time?: Date;
  start_time?: Date;
  end_time?: Date;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
}
