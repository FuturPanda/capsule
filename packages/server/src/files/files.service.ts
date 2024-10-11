import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';

@Injectable()
export class FilesService {
  checkIfFileOrDirectoryExists = (path: string): boolean => {
    return fs.existsSync(path);
  };
}
