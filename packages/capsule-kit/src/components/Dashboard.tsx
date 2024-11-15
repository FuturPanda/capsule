"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Content Area */}
      <main className="flex-1 overflow-auto p-4 items-center">
        <div className="mb-6 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-white">Caplets</h2>
            </div>
            <div className="bg-zinc-950 p-4 rounded-md"></div>
          </div>
        </div>
        <div className="mb-6 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-white">Documentation</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                  onMouseDown={() => {}}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            <div className="bg-zinc-950 p-4 rounded-md"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
