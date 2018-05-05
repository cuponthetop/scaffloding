import * as ws from 'ws';
import { PortHoldingServer, PrepareOpts, ListenOpts } from '../../types/server';
import { Service } from '../../types/service';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
import { Server as BaseServer } from 'net';
import { Server as HTTPServer, IncomingMessage } from 'http';
import { Server as HTTPSServer } from 'https';

export interface WSListenOpts extends ListenOpts {
  server?: HTTPServer | HTTPSServer,
  protocol: WSProtocol[],
  hello: ConnFunc,
  error: ConnFunc
};

export interface WSData {
  type: string
};

export type ConnFunc = (ws: ws, req: IncomingMessage) => string;

export type WSProtocol = {
  type: string,
  handler: (this: WSServer, ws: ws, wss: ws.Server, data: WSData) => string,
  sendError: (this: WSServer, ws: ws, wss: ws.Server, data: WSData, err: Error) => void
};

export abstract class WSServer extends PortHoldingServer {
  protected wss: ws.Server = null;

  constructor(logger: LoggerInstance, port: number, services: Service[]) {
    super(logger, port, services);
  };

  async prepare(opts: PrepareOpts): Promise<boolean> {
    opts;

    return true;
  };

  async listen(opts: WSListenOpts): Promise<BaseServer> {
    if (_.isUndefined(opts.server)) {
      this.wss = new ws.Server({ port: this.port });
      this.server = _.get(this.wss, '_server', null);
    } else {
      this.wss = new ws.Server({ server: <HTTPServer | HTTPSServer>opts.server });
      this.server = opts.server;
    }

    if (false === _.isNull(this.wss)) {
      try {
        this.registerOnConnectionHandler(opts.protocol, opts.hello, opts.error);
      } catch (e) {
        this.logger.error(`registering onConnection handler failed: ${e.message}`);
      }
    }

    return this.server;
  };

  protected registerOnConnectionHandler(protocol: WSProtocol[], hello: ConnFunc, error: ConnFunc): void {
    this.wss.on('connection', this.createOnConnectionHandler(protocol, hello, error));
    this.wss.on('error', (ws: ws, err: Error) => {
      this.logger.error(`WS Error occured, ${ws.readyState} ${err.message}: ${err.stack}`);
    });
  };

  private createOnConnectionHandler(protocols: WSProtocol[], hello: ConnFunc, error: ConnFunc): (ws: ws, req: IncomingMessage) => void {
    return (ws: ws, req: IncomingMessage): void => {
      this.logger.info(`Connection established ${req.connection.remoteAddress}`);

      ws.on('message', (data: ws.Data) => {
        try {
          let datum: WSData = JSON.parse(data.toString());

          let protocol = _.find(protocols, { type: datum.type });
          if (false === _.isUndefined(protocol)) {
            ws.send(protocol.handler.call(this, ws, this.wss, datum), protocol.sendError.bind(this, ws, this.wss, datum));
          } else {
            this.logger.warning(`Unknown protocol, ${datum.type}`);
            ws.send(error(ws, req));
          }
        } catch (e) {
          this.logger.error(`WS parse error: ${e.message}: ${e.stack}`);
        }
      });

      ws.on('error', (err: Error) => {
        this.logger.error(`Unknown error: ${err.message}: ${err.stack}`);
      });

      ws.send(hello(ws, req));
    };
  };

  async clear(): Promise<boolean> {
    if (false === _.isNull(this.server)) {
      this.server = null;
    }

    if (false === _.isNull(this.wss)) {
      this.wss.close();
      this.wss = null;
    }
    return true;
  };
};
