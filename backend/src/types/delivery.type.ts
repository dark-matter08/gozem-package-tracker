import { Package } from '../models';

export interface Delivery {
  delivery_id: string;
  package_id?: string;
  pickup_time?: Date;
  start_time?: Date;
  end_time?: Date;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
}

export type DeliveryInput = Omit<
  Delivery,
  | 'delivery_id'
  | 'end_time'
  | 'package'
  | 'pickup_time'
  | 'start_time'
  | 'location'
  | 'status'
>;
