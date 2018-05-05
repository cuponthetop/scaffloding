import { Express, Router } from 'express';
import * as express from 'express';
import { PortHoldingServer, PrepareOpts, ListenOpts } from '../../types/server';
import { Service } from '../../types/service';
import { LoggerInstance, TransportInstance } from 'winston';
import * as _ from 'lodash';
import { Server, IncomingMessage, ServerResponse } from 'http';

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as methodoverride from 'method-override';
import * as cors from 'cors';
import { logger, errorLogger } from 'express-winston';
import { Socket } from 'net';

export interface ExpressListenOpts extends ListenOpts {
  logRequest?: boolean,
  logClientError?: boolean,
  logConnect?: boolean,
};

export abstract class ExpressServer extends PortHoldingServer {
  private app: Express = null;

  constructor(logger: LoggerInstance, port: number, services: Service[]) {
    super(logger, port, services);
  };

  async prepare(opts: PrepareOpts): Promise<boolean> {
    opts;
    this.app = express();

    this.injectMiddleware();

    let router: Router = this.populateRouter();

    this.app.use(router);

    let transports: TransportInstance[] = _.map(this.logger.transports, (transport) => transport);
    this.app.use(errorLogger({ transports }));

    return true;
  };

  async listen(opts: ExpressListenOpts): Promise<Server> {
    opts;

    if (_.isNull(this.app)) {
      return null;
    }

    let ret: Server = this.app.listen(this.port, () => {
      this.logger.info(`Express Server listening on port: ${this.port}`);
    });

    if (true === _.get(opts, 'logClientError', false)) {
      ret.on("clientError", (err: Error, socket: Socket) => {
        this.logger.warn(`Client-side error ${err.name} has occurred from ${socket.remoteAddress} - ${err.message}: ${err.stack}`);
      });
    }


    if (true === _.get(opts, 'logConnect', false)) {
      ret.on("connect", (req: IncomingMessage, socket: Socket, head: Buffer) => {
        req;
        this.logger.info(`Connection from ${socket.remoteAddress}, head: ${head.toString('utf-8')}`);
      });
    }

    if (true === _.get(opts, 'logRequest', false)) {
      ret.on("request", (req: IncomingMessage, res: ServerResponse) => {
        this.logger.info(`Request ${req.method} ${JSON.stringify(req.headers)}, res: ${res.statusCode} - ${res.statusMessage}`);
      });
    }

    return ret;
  };

  abstract populateRouter(): Router;

  injectMiddleware(): void {
    this.app.use(cors());
    this.app.use(bodyParser({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(methodoverride());

    let transports: TransportInstance[] = _.map(this.logger.transports, (transport) => transport);
    this.app.use(logger({
      transports,
      meta: true,
      msg: "[HTTP] {{req.method}} {{req.url}} - {{res.statusCode}} - {{res.responseTime}}ms",
      expressFormat: false,
      colorize: false,
    }));
  };

  async clear(): Promise<boolean> {
    if (false === _.isNull(this.server)) {
      this.server.removeAllListeners("clientError");
      this.server.removeAllListeners("connect");
      this.server.removeAllListeners("request");
    }
    return true;
  };
};