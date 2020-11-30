import { Redis } from "../deps.ts";
import BaseModule from "./base-module.ts";

/**
 * Redis client
 */
export default class RedisClient extends BaseModule {
  private _redisClient?: Redis.Redis = undefined;

  /**
   * Getter: _redisClient
   */
  public get redisClient(): Redis.Redis {
    return this._redisClient as Redis.Redis;
  }

  /**
   * Connect
   */
  public async connect(options: Redis.RedisConnectOptions): Promise<void> {
    this._redisClient = await Redis.connect(options);
  }

  /**
   * Close
   */
  public async close(): Promise<void> {
    this.redisClient.close();
  }

  /**
   * Run command
   * @param cmd string Command
   * @param args Array<string|number> Arguments
   */
  public async runCmd(
    cmd: string,
    ...args: (string | number)[]
  ): Promise<Redis.RedisRawReply> {
    return this.redisClient.executor.exec(cmd, ...args);
  }
}
