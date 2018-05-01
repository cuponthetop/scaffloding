import { Service } from './service';
import { LoggerInstance } from 'winston';

export interface InitOpts {
  listen: ListenOpts;
  prepare: PrepareOpts;
  logger: LoggerInstance;
}

export interface ListenOpts {

};

export interface PrepareOpts {

};

export abstract class PortHoldingServer {
  constructor(protected logger: LoggerInstance, protected port: number, protected services: Service[]) {
  }

  async init(opts: InitOpts): Promise<boolean> {
    let ret: boolean = true;

    ret = ret && await this.prepare(opts.prepare);

    ret = ret && await this.listen(opts.listen);

    return ret;
  }

  abstract async prepare(opts: PrepareOpts): Promise<boolean>;
  abstract async listen(opts: ListenOpts): Promise<boolean>;
}