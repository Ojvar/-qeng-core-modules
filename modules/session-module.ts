import { Oak } from "../deps.ts";
import { Session } from "../deps.ts";
import { BaseModule } from "./base-module.ts";

/**
 * Session Module
 */
export class SessionModule extends BaseModule {
  /**
   * Setup
   */
  public async setup(
    app: Oak.Application,
    sessionEngine: SessionFrameworkEnum
  ): Promise<void> {
    const framework: string = sessionEngine;

    const session = new Session.Session({ framework: framework });
    await session.init();
    
    // app.use(session.use()(session, { path: "/", httpOnly: true, secure: false }))
    app.use(session.use()(session));
  }
}

/**
 * Session framework enum
 */
export enum SessionFrameworkEnum {
  Oak = "oak",
  Attain = "attain",
}
