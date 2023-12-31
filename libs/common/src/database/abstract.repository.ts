import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    const doc = await createdDocument.save();
    return doc.toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const doc = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!doc) {
      this.logger.warn('Document not found with filter', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return doc as unknown as TDocument;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const doc = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!doc) {
      this.logger.warn('Document not found with filter', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return doc;
  }

  async find(filterQuery: FilterQuery<TDocument>) {
    return await this.model.find(
      filterQuery,
      {},
      {
        lean: true,
      },
    );
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
    return await this.model.findByIdAndDelete(filterQuery, { lean: true });
  }
}
