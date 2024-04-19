import mongoose from 'mongoose';
import { Types, Schema, model } from '../mongodb';

const deliverySchema = new Schema<Delivery>({
  package_id: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  pickup_time: Date,
  start_time: { type: Date, default: Date.now },
  end_time: Date,
  location: {
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: ['open', 'picked-up', 'in-transit', 'delivered', 'failed'],
    default: 'open',
  },
});

export interface Delivery extends mongoose.Document {
  _id?: string;
  package_id?: Types.ObjectId;
  pickup_time: Date;
  start_time: Date;
  end_time: Date;
  location: { lat: number; lng: number };
  status: string;
}

export const DeliveryModel = model<Delivery>('Delivery', deliverySchema);
