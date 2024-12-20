declare module '*.toml' {
  import { Migration } from './migrations.types';

  const content: Migration;
  export default content;
}
