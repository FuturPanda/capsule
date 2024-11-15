import { StateCreator } from "zustand";
import {
  DataSource,
  DataSourceTypeEnum,
  Entity,
} from "@/stores/data-sources/data-source.model.ts";
import { v4 as uuidv4 } from "uuid";

export interface DataSourceSlice {
  dataSources: DataSource[];
  addDataSource: (name: string, description?: string) => void;
  findDataSource: (dataSourceId: string) => DataSource | undefined;
  removeDataSource: (dataSourceId: string) => void;
  addEntityToDataSource: (dataSourceId: string, entity: Entity) => void;
  updateEntityInDataSource: (
    dataSourceId: string,
    entityId: string,
    updatedEntity: Entity,
  ) => void;
  deleteEntityFromDataSource: (dataSourceId: string, entityId: string) => void;
  getEntityFromDataSource: (dataSourceId: string, entityId: string) => void;
}

export const createDataSourceSlice: StateCreator<
  DataSourceSlice,
  [],
  [["zustand/persist", unknown]]
> = (set, get) => ({
  dataSources: [],
  findDataSource: (dataSourceId: string) => {
    const state = get();
    return state.dataSources.find(
      (dataSource) => dataSource.id === dataSourceId,
    );
  },
  addDataSource: (
    name: string,
    description?: string,
    type: DataSourceTypeEnum = DataSourceTypeEnum.DATABASE,
  ) =>
    set((state) => ({
      ...state,
      dataSources: [
        ...state.dataSources,
        {
          id: uuidv4(),
          name: name,
          description: description ?? "",
          type: type,
          entities: [],
          lastUpdatedAt: new Date(),
        },
      ],
    })),

  addEntityToDataSource: (dataSourceId: string, entity: Entity) =>
    set((state) => ({
      ...state,
      dataSources: state.dataSources.map((source) =>
        source.id === dataSourceId
          ? {
              ...source,
              entities: [...(source.entities || []), entity],
            }
          : source,
      ),
    })),

  updateEntityInDataSource: (
    dataSourceId: string,
    entityId: string,
    updatedEntity: Entity,
  ) => {
    set((state) => {
      const newState = { ...state };
      const dataSourceIndex = newState.dataSources.findIndex(
        (ds) => ds.id === dataSourceId,
      );

      if (dataSourceIndex === -1) return state;

      const dataSource = { ...newState.dataSources[dataSourceIndex] };
      const entityIndex = dataSource.entities.findIndex(
        (e) => e.id === entityId,
      );

      if (entityIndex === -1) return state;

      const newEntities = [...dataSource.entities];
      newEntities[entityIndex] = updatedEntity;

      dataSource.entities = newEntities;
      newState.dataSources[dataSourceIndex] = dataSource;

      return newState;
    });
  },

  deleteEntityFromDataSource: (dataSourceId: string, entityId: string) =>
    set((state) => ({
      ...state,
      dataSources: state.dataSources.map((source) =>
        source.id === dataSourceId
          ? {
              ...source,
              entities: (source.entities || []).filter(
                (entity) => entity.id !== entityId,
              ),
            }
          : source,
      ),
    })),

  getEntityFromDataSource: (dataSourceId: string, entityId: string) => {
    const dataSource = get().dataSources.find(
      (source) => source.id === dataSourceId,
    );
    return dataSource?.entities?.find((entity) => entity.id === entityId);
  },

  removeDataSource: (dataSourceId: string) =>
    set((state) => ({
      ...state,
      dataSources: state.dataSources.filter(
        (dataSource) => dataSource.id !== dataSourceId,
      ),
    })),
});
