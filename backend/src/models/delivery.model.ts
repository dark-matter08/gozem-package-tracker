import mongoose from 'mongoose';
import { Types, Schema, model } from '../mongodb';
import { DeliveryStatus } from '../utils/enums';

const deliverySchema = new Schema<Delivery>({
  package_id: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  pickup_time: Date,
  delivery_id: { type: String, required: true },
  start_time: Date,
  end_time: Date,
  location: {
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: DeliveryStatus,
    default: DeliveryStatus.open,
  },
});

export interface Delivery extends mongoose.Document {
  _id?: string;
  delivery_id: string;
  package_id?: Types.ObjectId;
  pickup_time: Date;
  start_time: Date;
  end_time: Date;
  location: { lat: number; lng: number };
  status: string;
}

export const DeliveryModel = model<Delivery>('Delivery', deliverySchema);
