import { Model, ObjectId as ObjectIdType } from 'mongoose';
import { ObjectId, Document } from '../../mongodb';

export interface IModelService<T> {
  create(data: Partial<T>): Promise<T>;
  read(filter?: any): Promise<T[]>;
  readById(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
  populate(id: string, populateOptions: PopulateOptions): Promise<T | null>;
}

export class PopulateOptions {
  // Define properties for your customization options here
  fields?: string[]; // Array of field names to populate
  model?: Model<any>; // Model to populate the fields with
  options?: any; // Additional options for the populate function (optional)
}

export class MongoService<T> implements IModelService<T> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const createdDocument = new this.model(data);
    const newData = await createdDocument.save();

    return newData as T;
  }

  async read(filter?: any): Promise<T[]> {
    return this.model.find(filter);
  }

  async readById(id: string): Promise<T | null> {
    return this.model.findById(new ObjectId(id));
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(new ObjectId(id), data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(new ObjectId(id));
  }

  async populate(
    id: string,
    populateOptions: PopulateOptions
  ): Promise<T | null> {
    const query = this.model.findById(new ObjectId(id));

    // Build the populate options based on provided arguments
    if (populateOptions.fields) {
      populateOptions.fields.forEach((field) =>
        query.populate(field, populateOptions.model, populateOptions.options)
      );
    }

    const populatedDoc = await query;
    return populatedDoc as T;
  }
}
