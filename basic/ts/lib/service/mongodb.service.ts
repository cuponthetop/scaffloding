import { Service } from '../../types/service';
import { LoggerInstance } from 'winston';
import { Db, MongoClient, MongoClientOptions, Collection, ObjectID, FilterQuery } from 'mongodb';
import * as _ from 'lodash';
import { LRUCache } from '../../util/lru';

type Auth = { user: string, password: string };

export interface MongoDatum {
  _id: ObjectID;
};

export class MongoService implements Service {
  private db: Db = null;
  private conn: MongoClient = null;
  private collections: LRUCache<Collection>;

  constructor(private logger: LoggerInstance, private uri: string, private dbName: string, private auth: Auth = null) {
    this.collections = new LRUCache<Collection>(10);
  }

  async init(): Promise<boolean> {
    let opts: MongoClientOptions = { logger: this.logger };
    if (false === _.isNull(this.auth)) {
      opts.auth = this.auth;
    }

    try {
      this.conn = await new MongoClient(this.uri, opts).connect();
    } catch (e) {
      throw new Error(`Failed to connect to MongoDB server at ${this.uri}: ${e.message}`);
    }

    try {
      this.db = await this.conn.db(this.dbName);
    } catch (e) {
      throw new Error(`Failed to create new Db instance ${this.dbName}: ${e.message}`);
    }

    return true;
  }

  async destroy(): Promise<boolean> {
    try {
      if (false === _.isNull(this.conn)) {
        await this.conn.close();
      }
    } catch (e) {
      this.logger.error(`Failed to destroy MongoDB connection: ${e.message}`);
    }
    return true;
  }

  immediateCleanup(): boolean {
    return true;
  }

  isAvailable(): boolean {
    return (false === _.isNull(this.db)) && (false === _.isNull(this.conn)) && this.conn.isConnected(this.dbName);
  }

  private getCollection(collection: string): Collection {
    let found: Collection = this.collections.get(collection);
    if (false === _.isUndefined(found)) {
      return found;
    } else {
      let coll: Collection = this.db.collection(collection);
      this.collections.put(collection, coll);
      return coll;
    }
  }

  async save<T extends MongoDatum>(collection: string, datum: T): Promise<void> {
    if (true === this.isAvailable()) {
      let coll: Collection = this.getCollection(collection);
      try {
        await coll.updateOne({ _id: datum._id }, datum, { upsert: true });
      } catch (e) {
        this.logger.warn(`Exception occured while saving datum: ${e.message}`);
      }
    } else {
      this.logger.warn("MongoService is not in savable state");
    }
  }

  async getOne<T extends MongoDatum>(collection: string, filter: FilterQuery<T>): Promise<T> {

    if (true === this.isAvailable()) {
      let coll: Collection = this.getCollection(collection);
      try {
        return await coll.findOne(filter);
      } catch (e) {
        this.logger.warn(`Exception occured while finding datum: ${e.message}`);
      }
    } else {
      this.logger.warn("MongoService is not in findable state");
    }
  }
}