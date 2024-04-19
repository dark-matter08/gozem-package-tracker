import mongoose from 'mongoose';
import { Delivery } from '../types/delivery.type';
import { model, Schema, Types } from '../mongodb';

const packageSchema = new Schema<Package>({
  active_delivery_id: {
    type: Schema.Types.ObjectId,
    ref: 'Delivery',
    required: false,
  },
  description: String,
  weight: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  depth: { type: Number, required: true },
  from_name: { type: String, required: true },
  from_address: { type: String, required: true },
  from_location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  to_name: { type: String, required: true },
  to_address: { type: String, required: true },
  to_location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

export interface Package extends mongoose.Document {
  _id?: string;
  active_delivery_id?: Types.ObjectId;
  description: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  from_name: string;
  from_address: string;
  from_location: { lat: number; lng: number };
  to_name: string;
  to_address: string;
  to_location: { lat: number; lng: number };
}

export const PackageModel = model<Package>('Package', packageSchema);
