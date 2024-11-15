import { Input } from "@/components/ui/input.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useBoundStore } from "@/stores/global.store.ts";
import { EntityCapletContentValue } from "@/stores/caplets/caplet.model.ts";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { ChevronDown, Database, Layout, Plus } from "lucide-react";
import { PopoverCardMenu } from "@/components/popovers/PopoverCardMenu.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { v4 as uuidv4 } from "uuid";
import { Entity } from "@/stores/data-sources/data-source.model.ts";
import { ColumnOptions } from "@capsule/chisel";

interface TableContentProps extends React.ComponentProps<"div"> {
  capletId: string;
  contentId: string;
}

const DATA_TYPES = ["TEXT", "INTEGER", "REAL", "BOOLEAN", "DATETIME"] as const;

export function TableContent({
  contentId,
  capletId,
  ...props
}: TableContentProps) {
  // Get initial data from store
  const content = useBoundStore((state) => state.findContent(contentId));
  const contentValue = content?.value as EntityCapletContentValue;
  const dataSources = useBoundStore((state) => state.dataSources);
  const updateEntityInDataSource = useBoundStore(
    (state) => state.updateEntityInDataSource,
  );
  const updateContent = useBoundStore((state) => state.updateContent);
  const removeContentFromCaplet = useBoundStore(
    (state) => state.removeContentFromCaplet,
  );
  const addEntityToDataSource = useBoundStore(
    (state) => state.addEntityToDataSource,
  );

  const [selectedDataSource, setSelectedDataSource] = useState(() =>
    contentValue
      ? dataSources.find((ds) => ds.id === contentValue.dataSourceId)
      : null,
  );

  const [entity, setEntity] = useState(() =>
    selectedDataSource?.entities.find((e) => e.id === contentValue?.entityId),
  );

  const handleSelectDataSource = (dataSourceId: string) => {
    const dataSource = dataSources.find((ds) => ds.id === dataSourceId);
    if (!dataSource) return;

    const newEntityId = uuidv4();
    const newEntity: Entity = {
      id: newEntityId,
      name: "",
      fields: {
        id: { type: "integer", primaryKey: true, notNull: true },
      },
      indexes: {},
      foreignKeys: {},
      compositePrimaryKeys: [],
      uniqueConstraints: [],
    };

    addEntityToDataSource(dataSourceId, newEntity);
    updateContent(contentId, {
      value: { dataSourceId, entityId: newEntityId },
    });

    setSelectedDataSource(dataSource);
    setEntity(newEntity);
  };

  const handleUpdateName = (name: string) => {
    if (!selectedDataSource || !contentValue?.entityId || !entity) return;

    const updatedEntity: Entity = {
      ...entity,
      name,
    };

    updateEntityInDataSource(
      selectedDataSource.id,
      contentValue.entityId,
      updatedEntity,
    );
    setEntity(updatedEntity);
  };

  const addColumn = () => {
    if (!selectedDataSource || !contentValue?.entityId || !entity) return;

    const newColumnName = `column_${uuidv4()}`;
    const updatedEntity: Entity = {
      ...entity,
      fields: {
        ...entity.fields,
        [newColumnName]: {
          type: "text",
          primaryKey: false,
          notNull: false,
        },
      },
    };

    updateEntityInDataSource(
      selectedDataSource.id,
      contentValue.entityId,
      updatedEntity,
    );
    setEntity(updatedEntity);
  };

  const updateColumn = (
    columnName: string,
    field: "name" | keyof ColumnOptions,
    value: string | boolean,
  ) => {
    if (!selectedDataSource || !contentValue?.entityId || !entity) return;

    const newFields = { ...entity.fields };
    newFields[columnName] = {
      ...newFields[columnName],
      [field]: value,
    };

    const updatedEntity: Entity = {
      ...entity,
      fields: newFields,
    };

    updateEntityInDataSource(
      selectedDataSource.id,
      contentValue.entityId,
      updatedEntity,
    );
    setEntity(updatedEntity);
  };

  const removeColumn = (columnName: string) => {
    if (!selectedDataSource || !contentValue?.entityId || !entity) return;
    if (columnName === "id") return;

    const newFields = { ...entity.fields };
    delete newFields[columnName];

    const updatedEntity: Entity = {
      ...entity,
      fields: newFields,
    };

    updateEntityInDataSource(
      selectedDataSource.id,
      contentValue.entityId,
      updatedEntity,
    );
    setEntity(updatedEntity);
  };
  return (
    <div className="flex flex-col bg-zinc-950 border my-3" {...props}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Input
            className="text-zinc-100 font-medium"
            placeholder="your entity name"
            value={entity?.name || ""}
            onChange={(e) => handleUpdateName(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-zinc-100"
              >
                <Database className="w-4 h-4 mr-2" />
                {selectedDataSource
                  ? selectedDataSource.name
                  : "Select a source"}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-zinc-900 border-zinc-800"
            >
              {dataSources.map((ds) => (
                <DropdownMenuItem
                  key={ds.id}
                  className="text-zinc-200 hover:bg-zinc-800 focus:bg-zinc-800"
                  onMouseDown={() => handleSelectDataSource(ds.id)}
                >
                  {ds.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-100"
          >
            <Layout className="w-4 h-4" />
          </Button>
          <PopoverCardMenu
            onDelete={() => removeContentFromCaplet(capletId, contentId)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4">
          <div className="space-y-3">
            <Label className="text-zinc-100">Columns</Label>
            {entity &&
              Object.entries(entity.fields).map(
                ([columnName, columnOptions]) => (
                  <div
                    key={columnName}
                    className="grid grid-cols-12 gap-2 items-center bg-zinc-800 p-3 rounded-md"
                  >
                    <div className="col-span-3">
                      <Input
                        placeholder="Column name"
                        value={columnOptions.name || columnName}
                        onChange={(e) =>
                          updateColumn(columnName, "name", e.target.value)
                        }
                        className="bg-zinc-900 border-zinc-700 text-zinc-100"
                      />
                    </div>

                    <div className="col-span-3">
                      <Select
                        value={columnOptions.type}
                        onValueChange={(value) =>
                          updateColumn(columnName, "type", value)
                        }
                      >
                        <SelectTrigger className="bg-zinc-900 border-zinc-700 text-zinc-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700">
                          {DATA_TYPES.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="text-zinc-100"
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                      <Switch
                        checked={columnOptions.primaryKey}
                        onCheckedChange={(checked) =>
                          updateColumn(columnName, "primaryKey", checked)
                        }
                        disabled={columnName === "id"}
                      />
                      <Label className="text-zinc-400">Primary</Label>
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                      <Switch
                        checked={!columnOptions.notNull}
                        onCheckedChange={(checked) =>
                          updateColumn(columnName, "notNull", !checked)
                        }
                        disabled={columnOptions.primaryKey}
                      />
                      <Label className="text-zinc-400">Nullable</Label>
                    </div>

                    <div className="col-span-2 flex justify-end">
                      {columnName !== "id" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeColumn(columnName)}
                          className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  </div>
                ),
              )}

            <Button
              variant="outline"
              onClick={addColumn}
              className="w-full border-zinc-700 text-zinc-100 hover:bg-zinc-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Column
            </Button>
          </div>

          <div className="mt-6 p-4 bg-zinc-900 rounded-md border border-zinc-800">
            <Label className="text-zinc-100 mb-2 block">SQL Preview</Label>
            <pre className="text-sm text-zinc-400 font-mono whitespace-pre-wrap">
              {`CREATE TABLE ${entity?.name || "table_name"}
                (
                    ${
                      entity
                        ? Object.entries(entity.fields)
                            .map(
                              ([columnName, options]) =>
                                `${columnName} ${options.type}${options.primaryKey ? " PRIMARY KEY" : ""}${options.notNull ? " NOT NULL" : ""}`,
                            )
                            .join(",\n    ")
                        : ""
                    }
                );`}
            </pre>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
