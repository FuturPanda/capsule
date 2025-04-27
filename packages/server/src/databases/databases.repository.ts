import { ChiselModel } from '@capsulesh/chisel';
import { Injectable } from '@nestjs/common';
import { DatabaseModel } from '../_utils/models/root/database';
import { InjectModel } from '../chisel/chisel.module';
import { ChiselId } from '@capsulesh/shared-types';

@Injectable()
export class DatabasesRepository {
  constructor(
    @InjectModel(DatabaseModel.name)
    private readonly databaseModel: ChiselModel<DatabaseModel>,
  ) {}

  createDatabase = (id: ChiselId, name: string, clientId?: string) => {
    return this.databaseModel.insert(
      { id: id, name: name, client_id: clientId },
      { ignoreExisting: true },
    );
  };

  findDatabaseByName = (name: string): DatabaseModel =>
    this.databaseModel
      .select()
      .where({ name: { $eq: name } })
      .exec({ one: true });

  findAllDatabase = () => this.databaseModel.select().exec();

  deleteDatabase(dbId: number) {
    return this.databaseModel.delete().where({ id: dbId }).exec();
  }
}
