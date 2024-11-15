import { useBoundStore } from "@/stores/global.store.ts";
import { Database, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "@tanstack/react-router";
import Icon from "@/components/ui/icon.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";

export const CapletDashboard = () => {
  const caplets = useBoundStore((state) => state.caplets);

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-zinc-100">Caplets</h2>
          </div>
        </div>

        <div className="flex gap-6 mt-6">
          <button className="text-sm text-zinc-100 border-b-2 border-zinc-100 pb-2">
            All Caplets
          </button>
        </div>
      </div>

      {caplets.length <= 0 ? (
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="w-[600px] border border-zinc-800 rounded-lg p-12 bg-zinc-900/50">
            <div className="flex flex-col items-center text-center space-y-6">
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
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6 grid grid-cols-1 gap-6">
          <div className="border border-zinc-800 rounded-lg p-6">
            <div className="grid grid-cols-2 gap-3">
              {caplets.map((caplet) => (
                <div
                  key={caplet.id}
                  className="group p-4 rounded-lg hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Link
                      to={`/caplets/$capletId`}
                      params={{
                        capletId: caplet.id,
                      }}
                      className="flex-1 flex items-start gap-4"
                    >
                      <div className="p-2 bg-zinc-800/50 rounded-md">
                        <Icon name="slice" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100">
                          {caplet.title}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1"></p>
                      </div>
                    </Link>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-48"
                        align="end"
                      ></PopoverContent>
                    </Popover>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
