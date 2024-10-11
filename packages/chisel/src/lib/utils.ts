import * as fs from 'node:fs';
import * as path from 'node:path';
import { DATABASES_PATH } from './_utils/constants/constants';

export const isDatabaseExisting = (dbName: string) =>
  fs.existsSync(path.join(DATABASES_PATH, `${dbName.toLowerCase()}/${dbName.toLowerCase()}.capsule`));
