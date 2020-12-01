import { Mongo } from "../deps.ts";
import { BaseModule } from "./base-module.ts";
import { IHash } from "../lib/interface/hash.ts";

/**
 * Mongo Module
 */
export class MongoModule extends BaseModule {
  private _client?: Mongo.MongoClient;
  private _db?: Mongo.Database;
  private _collections: IHash<Mongo.Collection<any>> = {};

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
  public get db(): Mongo.Database {
    return this._db as Mongo.Database;
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
  public async connectByOptions(options?: Mongo.ClientOptions): Promise<void> {
    if (!options) {
      options = {} as Mongo.ClientOptions;
    }
    await this.client.connectWithOptions(options);
  }

  /**
   * Connect to server
   * @param options 
   */
  public async connectByUri(uri: string): Promise<void> {
    await this.client.connectWithUri(uri);
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
  public async selectDB(db: string): Promise<Mongo.Database> {
    this._db = await this.client.database(db);

    return this._db;
  }

  /**
   * Get model
   * @param model string Model name
   */
  public getModel<T>(
    name: string,
  ): Mongo.Collection<T> {
    const collection: Mongo.Collection<T> = this._collections[name];

    if (null == collection) {
      throw new Error("Model not defined");
    }

    return collection;
  }

  /**
   * Define a new model
   */
  public async defineModel<T>(
    model: IModel,
  ): Promise<Mongo.Collection<T>> {
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
  setup(db: Mongo.Database): Mongo.Collection<any>;
  collectionName(): string;
  name(): string;
  schema(): any;
}
