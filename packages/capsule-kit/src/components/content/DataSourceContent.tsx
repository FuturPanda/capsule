import { Button } from "@/components/ui/button.tsx";
import {
  Activity,
  Badge,
  ChevronDown,
  ChevronRight,
  Clock,
  Database,
  Layout,
  Lock,
  PlusCircle,
  Server,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useBoundStore } from "@/stores/global.store.ts";
import React, { useState } from "react";
import { DataSource } from "@/stores/data-sources/data-source.model.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Table } from "@/components/ui/table.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { PopoverCardMenu } from "@/components/popovers/PopoverCardMenu.tsx";
import { TableContent } from "@/components/content/TableContent.tsx";

interface DataSourceContentProps {
  capletId: string;
  dataContentId: string;
}

export const DataSourceContent = ({
  capletId,
  dataContentId,
}: DataSourceContentProps) => {
  const dataSources = useBoundStore((state) => state.dataSources);
  const findDataSource = useBoundStore((state) => state.findDataSource);
  const removeContentFromCaplet = useBoundStore(
    (state) => state.removeContentFromCaplet,
  );

  const [selectedDataSource, setSelectedDataSource] =
    useState<DataSource | null>(null);

  const handleSelectDataSource = (id: string) => {
    const content = findDataSource(id);
    if (content) setSelectedDataSource(content);
  };

  return (
    <div className="flex flex-col bg-zinc-950 border my-3 p-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
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
              {dataSources.map((dataSource) => (
                <DropdownMenuItem
                  className="text-zinc-200 hover:bg-zinc-800 focus:bg-zinc-800"
                  onMouseDown={() => handleSelectDataSource(dataSource.id)}
                >
                  {dataSource.name}
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
            onDelete={() => {
              console.log("on delete", capletId, dataContentId);
              removeContentFromCaplet(capletId, dataContentId);
            }}
          />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-px bg-zinc-800">
        {selectedDataSource ? (
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {selectedDataSource.name}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedDataSource.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Active Connections</p>
                      <p className="text-sm text-muted-foreground">
                        Connections
                        {/*{selgccectedDataSource.connections}*/}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        TIME
                        {/*{selectedDataSource.lastUpdated}*/}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Database Size</p>
                      <p className="text-sm text-muted-foreground">
                        3{/*{database.size}*/}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  Database Entities
                </h3>
                <ScrollArea className="h-[300px] rounded-md border">
                  <div className="space-y-1 p-2">
                    {selectedDataSource.entities.length <= 0 ? (
                      <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
                        <TableContent
                          capletId={capletId}
                          contentId={dataContentId}
                        />
                      </div>
                    ) : (
                      selectedDataSource.entities.map((entity, index) => (
                        <Collapsible key={index}>
                          <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-muted/50 p-2 rounded-md">
                            <div className="flex items-center gap-2">
                              <ChevronRight className="h-4 w-4" />
                              <span className="font-medium">{entity.name}</span>
                              <Lock className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <Badge className="text-xs">
                              Type TEXT
                              {/*{entity.type}*/}
                            </Badge>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-8 pr-2 py-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>
                                {/*{entity.rowCount.toLocaleString()} */}
                                18 rows
                              </span>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-zinc-950 p-6">
            <EmptyState
              icon={<Database className="w-8 h-8 text-zinc-600" />}
              title="First, select a data source"
            />
          </div>
        )}

        <div className="bg-zinc-950 p-6">
          <EmptyState
            icon={<PlusCircle className="w-8 h-8 text-zinc-600" />}
            title="Then, add a metric to see data"
          />
        </div>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
}

function EmptyState({ icon, title }: EmptyStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-zinc-300 font-medium">{title}</h3>
    </div>
  );
}
