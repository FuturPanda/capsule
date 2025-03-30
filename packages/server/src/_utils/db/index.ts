import * as TOML from '@iarna/toml';
import * as fs from 'fs';
import * as path from 'path';
import { Migration } from '../_types/migrations.types';

function loadMigration(filename: string): Migration {
  const filePath = path.join(__dirname, './changelog', filename);
  const content = fs.readFileSync(filePath, 'utf8');
  return TOML.parse(content) as unknown as Migration;
}

export const migrations: Migration[] = [
  loadMigration('2024-12-13-initial-database.toml'),
  loadMigration('2025-02-05-add-oauth.toml'),
  loadMigration('2025-03-24-add-resources.toml'),
];
