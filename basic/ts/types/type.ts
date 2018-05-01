export const NullRunArgument: RunArgument = {
  log: {
    label: null
  }
};

export type RunArgument = {
  log: LogOption,
};

export type LogOption = {
  http?: {
    ssl: boolean,
    method: string,
    host: string,
    port: number,
    path: string,
    level: LogLevel
  },
  file?: {
    dir: string,
    filename: string,
    maxSizeInKB: number,
    level: LogLevel
  },
  console?: {
    logConsole: boolean,
    level: LogLevel
  }
  label: string
};

type LogLevel = "warn" | "error" | "info" | "debug" | "verbose" | "silly";