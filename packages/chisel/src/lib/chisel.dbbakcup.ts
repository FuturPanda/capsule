// @ts-ignore
import Database from 'better-sqlite3';
/*
export class ChiselDb extends Database {
  private readonly logger = pino();
  private filePath: string;
  private dbName: string;

  constructor(filename: string, params?: IChiselDbParams) {
    super(filename);
    if (params?.filePath) this.filePath = params.filePath;
  }

  static SchemaFactory(params?: IFactoryOpts) {
    const logger = pino();

    async function fromSchema(schema: ChiselSchema) {

      const dbName = schema.dbName.toLowerCase();
      const rootPath = './';
      const rootDir = path.join(rootPath, 'databases');
      const dirPath = path.join(rootDir, dbName);
      const filepath = path.join(dirPath, `${dbName}.capsule`);

      if (fs.existsSync(filepath)) {
        logger.info(`Cannot create Database, db already exists at ${filepath}, using ${dbName}`);
        return new ChiselDb(filepath);
      } else {
        await fs.promises.mkdir(dirPath, { recursive: true });
        logger.info(`Database doesn't exists at ${filepath}, creating ${dbName}`);
        const db = new ChiselDb(filepath);
        const sqlSchema = createDatabaseSchema(schema.dbName).addEntities(schema.entities).build();
        const sqlScripts = generateDatabaseSQL(sqlSchema);

        db.exec(sqlScripts.join('\n'));

        const fileName = generateUniqueFilename();
        const journal = generateJournal(fileName);
        const snapshot = generateSnapshot(schema);

        const migrationsPath = path.join(dirPath, 'migrations');
        const journalFilePath = path.join(dirPath, `_journal.json`);
        const metaDirectoryPath = path.join(migrationsPath, '_meta');
        const schemaFilePath = path.join(migrationsPath, `${fileName}.sql`);

        const snapshotPath = path.join(metaDirectoryPath, '_snapshot_0000.json');

        await fs.promises.mkdir(metaDirectoryPath, { recursive: true });
        await Promise.all([
          fs.promises.writeFile(snapshotPath, JSON.stringify(snapshot, null, 2), 'utf8'),
          fs.promises.writeFile(journalFilePath, JSON.stringify(journal, null, 2), 'utf8'),
          fs.promises.writeFile(schemaFilePath, sqlScripts.join('\n'), 'utf8'),
        ]);

        const data = JSON.parse(await fs.promises.readFile(snapshotPath, 'utf8'));
        await generateTypes(data, { dir: params.dir });
        if (!db) throw new Error('Error during database creation ');
        logger.info(`Connection with SQLite Dabatase "${filepath}" has been established`);
        return db;
      }
    }

    return { fromSchema };
  }
  /*
  static Connect = async (dbName: string) => {
    const dirPath = path.join(DATABASES_PATH, dbName.toLowerCase());
    const filepath = path.join(dirPath, `${dbName.toLowerCase()}.capsule`);

    if (fs.existsSync(filepath)) {
      console.log('exists : ', filepath);
      return new ChiselDb(filepath);
    } else {
      await fs.promises.mkdir(dirPath, { recursive: true });
      console.log("doesn't exists : ", filepath);
      const db = new Database(filepath);
      console.log(`Connection with SQLite Dabatase "${filepath}" has been established`);
      return db;
    }
  };

  insertInto<T>(table: ClassType<T>) {
    if (!this) throw new Error('Database not initialized');
    let query: string = '';
    let params: string[];
    let db = this as ChiselDb;

    function values(params: Partial<Pick<T, keyof T>>) {
      const keys = Object.keys(params);
      const placeholders = keys.map(() => '?').join(', ');
      query += ` (${keys.join(', ')}) VALUES (${placeholders})`;
      try {
        console.log(query);
        console.log(Object.values(params));
        const stmt = db.prepare(query);
        console.log(stmt);
        stmt.run(Object.values(params));
      } catch (error) {
        console.error('Error writing to the database:', error);
      }
    }

    query += `INSERT INTO ${table.name.toLowerCase()}`;
    return { values };
  }

  selectFrom<T>(table: ClassType<T>) {
    if (!this) throw new Error('Database not initialized');
    let query: string = '';

    const values = (...params: (keyof T)[]) => {
      let values = Object.values(params);
      query += `SELECT ${values.join(', ')} FROM ${table.name.toLowerCase()}`;
      return { where, orderBy, exec, limit };
    };

    const where = (params: FilterQuery<T>) => {
      for (const field in params) {
        const conditions = params[field];
        if (conditions && typeof conditions === 'object') {
          for (const conditionKey in conditions) {
            const conditionValue = conditions[conditionKey];
            query += this.generateFilterQuery(field, conditionValue, conditionKey as keyof QuerySelector<T>);
          }
        }
      }
      return { exec, limit, orderBy };
    };

    const orderBy = (column: keyof T, params: 'DESC' | 'ASC') => {
      query += `ORDER BY ${String(column)} ${params === 'DESC' ? 'DESC' : 'ASC'}`;
      return {
        exec,
        limit,
      };
    };
    //function groupBy(params: OrderByQuery) {}
    function limit(params: number) {
      query += `LIMIT ${number}`;
      return { exec };
    }

    const exec = () => {
      try {
        console.log(query);
        //db.("SELECT 'email' FROM 'client'");
        //stmt.run();
      } catch (error) {
        console.error('Error writing to the database:', error);
      }
    };

    return { values };
  }

  updateFrom<T>(table: ClassType<T>) {
    if (!this) throw new Error('Database not initialized');
    let query: string = `UPDATE ${table.name.toLowerCase()}`;

    const set = (params: { [P in keyof T]?: T[P] }) => {
      let entries = Object.entries(params);
      const values = entries.map(([key, value]) => `${key} = ${value}`);
      query += `SET ${values.join(', ')}`;
      return { where, orderBy, exec, limit };
    };

    const where = (params: FilterQuery<T>) => {
      for (const field in params) {
        const conditions = params[field];
        if (conditions && typeof conditions === 'object') {
          for (const conditionKey in conditions) {
            const conditionValue = conditions[conditionKey];
            query += this.generateFilterQuery(field, conditionValue, conditionKey as keyof QuerySelector<T>);
          }
        }
      }
      return { exec, limit, orderBy };
    };

    const orderBy = (column: keyof T, params: 'DESC' | 'ASC') => {
      query += `ORDER BY ${String(column)} ${params === 'DESC' ? 'DESC' : 'ASC'}`;
      return {
        exec,
        limit,
      };
    };
    //function groupBy(params: OrderByQuery) {}
    const limit = (params: number) => {
      query += `LIMIT ${number}`;
      return { exec };
    };

    const exec = () => {
      try {
        console.log(query);
        const stmt = db.prepare(query);
        stmt.run();
      } catch (error) {
        console.error('Error writing to the database:', error);
      }
    };

    return { set };
  }

  deleteFrom<T>(table: ClassType<T>) {
    if (!this) throw new Error('Database not initialized');
    let query: string = `DELETE FROM ${table.name.toLowerCase()}`;

    const where = (params: FilterQuery<T>) => {
      for (const field in params) {
        const conditions = params[field];
        if (conditions && typeof conditions === 'object') {
          for (const conditionKey in conditions) {
            const conditionValue = conditions[conditionKey];
            query += this.generateFilterQuery(field, conditionValue, conditionKey as keyof QuerySelector<T>);
          }
        }
      }
      return { exec };
    };

    const exec = () => {
      try {
        console.log(query);
        const stmt = db.prepare(query);
        stmt.run();
      } catch (error) {
        console.error('Error writing to the database:', error);
      }
    };

    return { where };
  }

  private generateFilterQuery<T extends T[], K extends keyof QuerySelector<T>>(
    field: string,
    conditionValue: T,
    conditionKey: K,
  ) {
    let conditionOutput = '';
    switch (conditionKey) {
      case '$eq':
        console.log(`Field ${field}: Equal to ${conditionValue}`);
        conditionOutput += `${field} = ${conditionValue}`;
        break;
      case '$ne':
        conditionOutput += `${field} != ${conditionValue}`;
        break;
      case '$gt':
        console.log(`Field ${field}: Greater than ${conditionValue}`);
        conditionOutput += `${field} > ${conditionValue}`;
        break;
      case '$lt':
        console.log(`Field ${field}: Less than ${conditionValue}`);
        conditionOutput += `${field} < ${conditionValue}`;
        break;
      case '$gte':
        console.log(`Field ${field}: Greater than ${conditionValue}`);
        conditionOutput += `${field} >= ${conditionValue}`;
        break;
      case '$lte':
        console.log(`Field ${field}: Less than ${conditionValue}`);
        conditionOutput += `${field} <= ${conditionValue}`;
        break;
      case '$btw':
        conditionOutput += `${field} BETWEEN ${conditionValue[0]} AND ${conditionValue[1]}`;
        break;
      case '$in':
        conditionOutput += `${field} IN (${conditionValue.join(', ')})`;
        break;
      case '$nin':
        conditionOutput += `${field} NOT IN (${conditionValue.join(', ')})`;
        break;
      case '$like':
        conditionOutput += `${field} LIKE ${conditionValue}`;
        break;
      case '$ilike':
        conditionOutput += `${field} LIKE ${conditionValue} COLLATE NOCASE`;
        break;
      default:
        console.log(`Field ${field}: Unknown condition ${conditionKey}`);
    }
    return `WHERE ${conditionOutput}`;
  }
}

class Client {
  name: string;
  age: number;
  email: string;
}

const db = new ChiselDb('');
db.selectFrom(Client).values('age').where({ age: 2 });

db.updateFrom(Client)
  .set({ age: 12 })
  .where({ age: { $lt: 10 } });


 */
