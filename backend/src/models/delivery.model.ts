import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const deliverySchema = new Schema<Delivery>({
  delivery_id: { type: String, required: true },
  active_delivery_id: String,
  package_id: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  pickup_time: Date,
  start_time: Date,
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
  delivery_id: string;
  active_delivery_id: string;
  package_id: mongoose.Types.ObjectId;
  pickup_time: Date;
  start_time: Date;
  end_time: Date;
  location: { lat: number; lng: number };
  status: string;
}

export const DeliveryModel = model<Delivery>('Delivery', deliverySchema);
