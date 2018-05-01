import { ArgumentParser, ArgumentOptions } from 'argparse';
import { RunArgument, NullRunArgument } from '../types/type';
import { packageJSON, projectRoot } from 'load-package-json';
import { forEach, cloneDeep, assign } from 'lodash';
import { resolve } from 'path';
import { readFileSync } from 'fs';

export function parse(): RunArgument {
  let parser: ArgumentParser = createParser(list);

  let parsed: any = parser.parseArgs();

  let runArgs: RunArgument = formatRawArguments(parsed);

  return runArgs;
}

function formatRawArguments(raw: any): RunArgument {
  let ret: RunArgument = cloneDeep(NullRunArgument);

  ret.log.label = raw.label;

  let configPath: string = resolve(projectRoot, raw.logConfig);

  try {
    ret.log = assign(ret.log, JSON.parse(readFileSync(configPath).toString('utf-8')));
  } catch (e) {
    throw new Error(`Failed to load logging configuration: ${e.message}`);
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
    args: ["--logConfig"],
    opts: {
      dest: "logConfig",
      type: "string",
      defaultValue: "log.json"
    }
  }
];