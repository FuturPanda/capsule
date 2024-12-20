import { Migration } from '../_types/migrations.types';
import * as fs from 'fs';
import * as path from 'path';
import * as TOML from '@iarna/toml';

function loadMigration(filename: string): Migration {
  const filePath = path.join(__dirname, './changelog', filename);
  const content = fs.readFileSync(filePath, 'utf8');
  return TOML.parse(content) as unknown as Migration;
}

export const migrations: Migration[] = [
  loadMigration('2024-12-13-initial-database.toml'),
  loadMigration('2024-12-13-add-test.toml'),
];
