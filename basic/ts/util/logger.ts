import { has, get, isNull } from 'lodash';
import * as winston from 'winston';
import { format, Format } from 'logform';
import { LogOption } from '../types/type';


export let logger: winston.LoggerInstance = null;

export function createLoggerInstance(logOpts: LogOption): winston.LoggerInstance {
  if (false === isNull(logger)) {
    process.emitWarning("createLoggerInstance was called more than twice!");
    return logger;
  }

  let transports: winston.TransportInstance[] = [];
  let globalLabel: string = get(logOpts, 'label', 'DEFAULT');
  const endFormatter = format.printf((info) => {
    return `[${info.label}][${info.timestamp}][${info.level}] ${info.message}`;
  });

  let formatter: Format = format.combine(format.label({ label: globalLabel }), format.timestamp(), endFormatter);

  if (has(logOpts, 'http') === true) {
    let transport: winston.TransportInstance = new winston.transports.Http({
      level: logOpts.http.level,
      ssl: logOpts.http.ssl,
      host: logOpts.http.host,
      port: logOpts.http.port,
      path: logOpts.http.path
    });
    transports.push(transport);
  }

  if (has(logOpts, 'file') === true) {
    let transport: winston.TransportInstance = new winston.transports.DailyRotateFile({
      level: logOpts.file.level,
      filename: logOpts.file.filename,
      dirname: logOpts.file.dir,
      maxsize: (logOpts.file.maxSizeInKB * 1024)
    });
    transports.push(transport);
  }

  if (has(logOpts, 'console') === true && true === logOpts.console.logConsole) {
    let transport: winston.TransportInstance = new winston.transports.Console({
      level: logOpts.console.level,
    });
    transports.push(transport);
  }

  logger = new winston.Logger({ transports, format: formatter });
  return logger;
}
