import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PackageJSONType } from '../types/package-json';

export const projectRoot: string = resolve(__dirname, "..");
let content: string = "";
try {
  const jsonableContent: string = readFileSync(`${projectRoot}/package.json`).toString('utf-8');

  JSON.parse(jsonableContent);

  content = jsonableContent;
} catch (e) {

}

export const packageJSON: PackageJSONType = JSON.parse(content);

