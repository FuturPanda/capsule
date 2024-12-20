import TOML from '@iarna/toml';
import fs from 'fs';

module.exports = function (source) {
  const tomlContent = fs.readFileSync(this.resourcePath, 'utf8');
  const parsed = TOML.parse(tomlContent);
  return `module.exports = ${JSON.stringify(parsed)}`;
};
