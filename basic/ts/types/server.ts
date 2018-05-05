import { Service } from './service';
import { Server, Socket } from 'net';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';

export interface InitOpts {
  listen: ListenOpts;
  prepare: PrepareOpts;
  logger: LoggerInstance;
  logConnection?: boolean;
  logError?: boolean;
}

export interface ListenOpts {

};

export interface PrepareOpts {

};

export interface DestroyOpts {

};

export abstract class PortHoldingServer {
  protected server: Server = null;

  constructor(protected logger: LoggerInstance, protected port: number, protected services: Service[]) {
  };

  async init(opts: InitOpts): Promise<boolean> {
    let ret: boolean = true;

    ret = ret && await this.prepare(opts.prepare);

    this.server = await this.listen(opts.listen);
    ret = ret && (false === _.isNull(this.server));

    if (true === ret) {
      this.server.on("close", async () => {
        // retry
        await this.clear();
        this.server.removeAllListeners("close");
        this.server.removeAllListeners("error");
        this.server.removeAllListeners("connection");
        this.server.removeAllListeners("listening");

        await this.init(opts);
      });

      if (_.has(opts, 'logError') && true === opts.logError) {
        this.server.on("error", (err: Error) => {
          this.logger.warn(`Error ${err.name} occured on server: ${err.message} - stack: ${err.stack}`);
        });
      }

      if (_.has(opts, 'logConnection') && true === opts.logConnection) {
        this.server.on("connection", (socket: Socket) => {
          this.logger.info(`New connection from ${socket.remoteAddress}`);
        });
      }
    }

    return ret;
  };

  abstract async prepare(opts: PrepareOpts): Promise<boolean>;
  abstract async listen(opts: ListenOpts): Promise<Server>;

  abstract async clear(): Promise<boolean>;
  async destroy(opts: DestroyOpts): Promise<boolean> {
    opts;

    let ret: boolean = await this.clear();

    this.server = null;

    return ret;
  };
}