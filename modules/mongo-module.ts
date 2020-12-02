import { Mongo, MongoDatabase, MongoCollection } from "../deps.ts";
import { BaseModule } from "./base-module.ts";
import { IHash } from "../libs/interfaces/hash-interface.ts";

/**
 * Mongo Module
 */
export class MongoModule extends BaseModule {
  private _client?: Mongo.MongoClient;
  private _db?: MongoDatabase.Database;
  private _collections: IHash<MongoCollection.Collection<any>> = {};

  /**
   * Constructor
   */
  constructor() {
    super();

    this.init();
  }

  /**
   * Getter: _client
   */
  public get client(): Mongo.MongoClient {
    return this._client as Mongo.MongoClient;
  }

  /**
   * Getter: _db
   */
  public get db(): MongoDatabase.Database {
    return this._db as MongoDatabase.Database;
  }

  /**
   * Init
   */
  public async init(): Promise<void> {
    this._client = new Mongo.MongoClient();
  }

  /**
   * Connect to server
   * @param options
   */
  public async connectByOptions(options?: Mongo.ConnectOptions): Promise<void> {
    if (!options) {
      options = {} as Mongo.ConnectOptions;
    }
    await this.client.connect(options);
  }

  /**
   * Connect to server
   * @param options
   */
  public async connectByUri(uri: string): Promise<void> {
    await this.client.connect(uri);
  }

  /**
   * Close
   * @param options
   */
  public async close(): Promise<void> {
    await this.client.close();
  }

  /**
   * Select database
   * @param options
   */
  public async selectDB(db: string): Promise<MongoDatabase.Database> {
    this._db = await this.client.database(db);

    return this._db;
  }

  /**
   * Get model
   * @param model string Model name
   */
  public getModel<T>(name: string): MongoCollection.Collection<T> {
    const collection: MongoCollection.Collection<T> = this._collections[name];

    if (null == collection) {
      throw new Error("Model not defined");
    }

    return collection;
  }

  /**
   * Define a new model
   */
  public async defineModel<T>(
    model: IModel
  ): Promise<MongoCollection.Collection<T>> {
    const name = model.name();
    const newCollection = await model.setup(this.db);
    this._collections[name] = newCollection;

    return newCollection;
  }
}

/**
 * Model interface
 */
export interface IModel {
  setup(db: MongoDatabase.Database): MongoCollection.Collection<any>;
  collectionName(): string;
  name(): string;
}
