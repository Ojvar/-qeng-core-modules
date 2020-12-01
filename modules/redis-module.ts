import { Redis } from "../deps.ts";
import { BaseModule } from "./base-module.ts";

/**
 * Redis Module
 */
export class RedisModule extends BaseModule {
  private _redisClient?: Redis.Redis;
  private _subChannel?: Redis.RedisSubscription;

  /**
   * Getter: _redisClient
   */
  public get redisClient(): Redis.Redis {
    return this._redisClient as Redis.Redis;
  }

  /**
   * Getter: _subChannel
   */
  public get subChannel(): Redis.RedisSubscription {
    return this._subChannel as Redis.RedisSubscription;
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

  /**
   * Publish a message
   * @param channel string Channel name
   * @param message string Message
   */
  public async publish(channel: string, message: string): Promise<number> {
    return this.redisClient.publish(channel, message);
  }

  /**
   * Subscribe to a channel
   * @param channel string Channel name
   */
  public async subscribe(
    channel: string,
    callback?: SubscribeCallbackType,
  ): Promise<void> {
    this._subChannel = await this.redisClient.subscribe(
      channel,
    );

    (async () => {
      for await (const { channel, message } of this.subChannel.receive()) {
        if (callback) {
          callback(channel, message);
        }
      }
    })();
  }

  /**
   * Close subscription channel
   */
  public async closeSubscribeChannel(): Promise<void> {
    this.subChannel.close();
  }
}

export type SubscribeCallbackType = (channel: string, message: string) => void;
