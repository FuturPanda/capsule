import {Database} from "better-sqlite3";
import {ChiselQueries} from "./_utils/interfaces/queries.interfaces";
import {ClassType} from "./_utils/types/queries.type";
import {ChiselModel} from "./chisel.model";

/**
 * Class to queries dynamic models.
 * To use when the model isn't know ahead of time
 */
export class ChiselQuerable implements ChiselQueries {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  public getModel<T>(model: ClassType<T>) {
    return new ChiselModel(this.db, model);
  }

  runSqlCommands(sqlCommands: string[]) {
    for (const command of sqlCommands) {
      const stmt = this.db.prepare(command);
      stmt.run();
    }
  }

  close() {
    this.db.close();
  }
}
