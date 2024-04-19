import { Model, ObjectId as ObjectIdType } from 'mongoose';
import { ObjectId, Document } from '../../mongodb';

export interface IModelService<T> {
  create(data: Partial<T>): Promise<T>;
  read(filter?: any): Promise<T[]>;
  readById(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
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
}
