import { LoggerInstance } from "winston";
import { createLoggerInstance } from './util/logger';
import { parse } from './util/parser';
import { RunArgument } from './types/type';

export async function main(args: RunArgument): Promise<void> {

  const logger: LoggerInstance = createLoggerInstance(args.log);

  handleGlobalProcessEvents(logger);
}

let once: boolean = true;

function handleGlobalProcessEvents(logger: LoggerInstance): void {
  if (true === once) {
    process.addListener("beforeExit", (code: number): void => {
      logger.info(`process is beginning to exit with code: ${code}`);
    });
    process.addListener("exit", (code: number): void => {
      logger.info(`process exited with code: ${code}`);
    });
    process.addListener("rejectionHandled", (promise: Promise<any>): void => {
      promise;
    });
    process.addListener("unhandledRejection", (reason: any, p: Promise<any>): void => {
      p;
      logger.warn(`Uncaught Exception occured: ${reason.name} - ${reason.message} at: ${reason.stack}`);
    });
    process.addListener("uncaughtException", (error: Error): void => {
      logger.warn(`Uncaught Exception occured: ${error.name} - ${error.message} at: ${error.stack}`);
    });
    process.addListener("warning", (warning: Error): void => {
      logger.warn(`${warning.name} - ${warning.message} at: ${warning.stack}`);
    });
  }
}

if (require.main === module) {
  let args: RunArgument = parse();
  main(args);
}