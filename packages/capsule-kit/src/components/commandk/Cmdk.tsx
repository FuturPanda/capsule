import { CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk";
import { Archive, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandDialog } from "../ui/command.tsx";
import { useBoundStore } from "@/stores/global.store.ts";
import { useCommands } from "@/hooks/useCommands.tsx";

export const Cmdk = () => {
  const [open, setOpen] = useState(false);
  const commands = useCommands();
  const caplets = useBoundStore((state) => state.caplets);

  useEffect(() => {
    console.log("DOWN");
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="border-b border-zinc-800 px-4">
        <div className="flex items-center space-x-3 py-4">
          <Search className="h-5 w-5 text-zinc-400" />
          <CommandInput
            placeholder="Search your workspace..."
            className="flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      <CommandList className="max-h-96 overflow-y-auto p-4">
        <CommandGroup
          heading="LAST VIEWED BY YOU"
          className="text-xs text-zinc-500 font-medium"
        >
          {commands.map((cmd) => (
            <CommandItem
              key={cmd.name}
              className="flex items-start gap-4 rounded-lg px-4 py-3 hover:bg-zinc-900"
              onMouseDown={cmd.onActivate}
            >
              <div className="p-2 bg-zinc-900 rounded-md">
                <Archive className="h-5 w-5 text-zinc-400" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-medium text-zinc-200">
                  {cmd.name}
                </h3>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup
          heading="Caplets"
          className="text-xs text-zinc-500 font-medium"
        >
          {caplets.map((result) => (
            <CommandItem
              key={result.id}
              className="flex items-start gap-4 rounded-lg px-4 py-3 hover:bg-zinc-900"
            >
              <div className="p-2 bg-zinc-900 rounded-md">
                <Archive className="h-5 w-5 text-zinc-400" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-medium text-zinc-200">
                  {result.title}
                </h3>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      <div className=" flex border-t gap-2 border-zinc-800 p-4 text-center items-center text-sm justify-center text-zinc-500">
        Open the workspace search from anywhere with{" "}
        <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
          <kbd className="font-mono px-1.5 py-0.5 bg-zinc-800/50 rounded">
            CMD
          </kbd>
          <span className="text-zinc-600">then</span>
          <kbd className="font-mono px-1.5 py-0.5 bg-zinc-800/50 rounded">
            K
          </kbd>
        </div>
      </div>
    </CommandDialog>
  );
};
