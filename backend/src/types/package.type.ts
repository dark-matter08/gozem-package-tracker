import { Types } from '../mongodb';

export interface Package {
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
