import { APPCONFIGS } from '../configs';
import mongoose from 'mongoose';

export async function connectMongoDb() {
  mongoose
    .connect(APPCONFIGS.CONNECTION_STRING as string)
    .then(() =>
      console.log(
        '[🚀 ] - App connected to mongodb on: ',
        APPCONFIGS.CONNECTION_STRING
      )
    );
}

export const ObjectId = mongoose.Types.ObjectId;

export { Document, Model, Query, Types, model } from 'mongoose';
