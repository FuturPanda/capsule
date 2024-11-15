import { useBoundStore } from "@/stores/global.store.ts";
import { Database } from "lucide-react";
import { AddDataSourceDialog } from "@/components/data-sources/AddDataSourceDialog.tsx";
import { PopoverCardMenu } from "@/components/popovers/PopoverCardMenu.tsx";

export const DataSourceDashboard = () => {
  const dataSources = useBoundStore((state) => state.dataSources);
  const deleteDataSource = useBoundStore((state) => state.removeDataSource);

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950">
      <div className="px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-zinc-100">
              Data Sources
            </h2>
          </div>
        </div>

        <div className="flex gap-6 mt-6">
          <button className="text-sm text-zinc-100 border-b-2 border-zinc-100 pb-2">
            All data
          </button>
          <button className="text-sm text-zinc-400 hover:text-zinc-100 pb-2">
            Recently used
          </button>
          <button className="text-sm text-zinc-400 hover:text-zinc-100 pb-2">
            Favorites
          </button>
        </div>
      </div>

      {dataSources.length <= 0 ? (
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="w-[600px] border border-zinc-800 rounded-lg p-12 bg-zinc-900/50">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Icon or illustration */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
                <div className="relative bg-zinc-900 p-4 rounded-full">
                  <Database className="w-12 h-12 text-zinc-100" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-zinc-100">
                  Connect your first data source
                </h3>
                <p className="text-sm text-zinc-400 max-w-sm mx-auto">
                  Securely connect your database once, and your team will be off
                  to the races. Support for all major databases and data
                  warehouses.
                </p>
              </div>
              <AddDataSourceDialog />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6 grid grid-cols-1 gap-6">
          <div className="border border-zinc-800 rounded-lg p-6">
            <div className="grid grid-cols-2 gap-3">
              {dataSources.map((dataSource) => (
                <div className="group p-4 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="p-2 bg-zinc-800/50 rounded-md">
                      <Database className="w-5 h-5 text-zinc-400" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100">
                        {dataSource.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">
                        {dataSource.tables?.length ?? 0} tables • Updated{" "}
                        {dataSource.lastUpdatedAt?.toString()}
                      </p>
                    </div>

                    <div className="absolute right-3 flex mt-1 mb-1 top-0 opacity-0 invisible gap-2 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-all duration-600">
                      <PopoverCardMenu
                        id={dataSource.id}
                        onDelete={deleteDataSource}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <AddDataSourceDialog />
          </div>
        </div>
      )}
    </div>
  );
};
