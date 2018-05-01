import { ArgumentParser, ArgumentOptions } from 'argparse';
import { RunArgument, NullRunArgument } from '../types/type';
import { packageJSON } from 'load-package-json';
import { forEach, cloneDeep, has, get } from 'lodash';

export function parse(): RunArgument {
  let parser: ArgumentParser = createParser(list);

  let parsed: any = parser.parseArgs();

  let runArgs: RunArgument = formatRawArguments(parsed);

  return runArgs;
}

function formatRawArguments(raw: any): RunArgument {
  let ret: RunArgument = cloneDeep(NullRunArgument);

  ret.log.label = raw.label;

  if (has(raw, 'logStoreAddress')) {
    // surely not enonugh
    const httpMatcher: RegExp = /((https?):\/\/)?(([\w]+\.?)+)(:[\d]+)?(\/\w+)*/;
    const address: string = raw.logStoreAddress;
    let matched: string[] = httpMatcher.exec(address);

    ret.log.http.ssl = matched[2].toLowerCase() === 'https';
    ret.log.http.host = matched[3];
    ret.log.http.port = parseInt(matched[5]);
    ret.log.http.path = matched[6];

    if (has(raw, 'httpMethod')) {
      ret.log.http.method = raw.httpMethod;
    }

    if (has(raw, 'httpLevel')) {
      ret.log.http.level = raw.httpLevel;
    }
  }

  if (has(raw, 'logFileDirectory')) {
    ret.log.file.dir = raw.logFileDirectory;
    ret.log.file.filename = get(raw, 'logFilename', 'DEFAULT_LOG_FILENAME');
    ret.log.file.maxSizeInKB = get(raw, 'logFileSize', 4096);

    if (has(raw, 'fileLevel')) {
      ret.log.file.level = raw.fileLevel;
    }
  }

  if (true === raw.useConsole) {
    ret.log.console.logConsole = true;

    if (has(raw, 'consoleLevel')) {
      ret.log.console.level = raw.consoleLevel;
    }
  }

  return ret;
}

function createParser(list: ArgumentItem[]): ArgumentParser {
  let parser: ArgumentParser = new ArgumentParser({
    version: packageJSON.version,
    addHelp: true,
    description: packageJSON.description
  });

  forEach(list, (item: ArgumentItem) => {
    parser.addArgument(item.args, item.opts);
  });

  return parser;
}

type ArgumentItem = {
  args: string[],
  opts: ArgumentOptions
};

const list: ArgumentItem[] = [
  {
    args: ["--label", "-l"],
    opts: {
      dest: "label",
      type: "string",
      required: true,
    }
  },
  {
    args: ["--logStoreAddress", "-laddr"],
    opts: {
      dest: "logStoreAddress",
      type: "string",
      required: false,
    }
  },
  {
    args: ["--httpLevel"],
    opts: {
      dest: "httpLevel",
      type: "string",
      required: false,
    }
  },
  {
    args: ["--httpMethod"],
    opts: {
      dest: "httpMethod",
      type: "string",
      required: false,
    }
  },
  {
    args: ["--logFileDirectory", "-fdir"],
    opts: {
      dest: "logFileDirectory",
      type: "string",
      help: "relative path",
      required: false,
    }
  },
  {
    args: ["--logFilename", "-fname"],
    opts: {
      dest: "logFilename",
      type: "string",
      required: false,
    }
  },
  {
    args: ["--logFileSize", "-fsize"],
    opts: {
      dest: "logFileSize",
      type: "int",
      required: false,
    }
  },
  {
    args: ["--fileLevel"],
    opts: {
      dest: "fileLevel",
      type: "string",
      required: false,
    }
  },
  {
    args: ["--useConsole", "-console"],
    opts: {
      dest: "useConsole",
      action: "storeTrue",
      type: "boolean",
      required: false,
    }
  },
  {
    args: ["--consoleLevel"],
    opts: {
      dest: "consoleLevel",
      type: "string",
      required: false,
    }
  },
];