import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "@/components/ui/button.tsx";
import { CommandIcon, MoreHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import { ComponentProps } from "react";

interface PopoverCardMenuProps extends ComponentProps<typeof Popover> {
  id?: string;
  onDelete: (...params: never[]) => void;
}

const PopoverCardMenu = ({ onDelete, ...props }: PopoverCardMenuProps) => {
  const handleDeleteContent = () => {
    onDelete();
  };

  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className=" h-6 w-6 hover:text-zinc-100 hover:bg-zinc-900"
        >
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-1.5 bg-zinc-900/95 border-zinc-800 shadow-xl"
        align="end"
        side="left"
        sideOffset={10}
      >
        <div className="flex flex-col space-y-0.5">
          {/* Add above/below */}
          <Button
            variant="ghost"
            className="w-full h-9 px-3 flex items-center justify-between group hover:bg-zinc-800/50"
          >
            <span className="text-zinc-200 text-sm font-medium">Add above</span>
            <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
              <span className="font-mono px-1.5 py-0.5 bg-zinc-800/50 rounded">
                ESC
              </span>
              <span className="text-zinc-600">then</span>
              <span className="font-mono px-1.5 py-0.5 bg-zinc-800/50 rounded">
                A
              </span>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="w-full h-9 px-3 flex items-center justify-between group hover:bg-zinc-800/50"
          >
            <span className="text-zinc-200 text-sm font-medium">Add below</span>
            <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
              <span className="font-mono px-1.5 py-0.5 bg-zinc-800/50 rounded">
                ESC
              </span>
              <span className="text-zinc-600">then</span>
              <span className="font-mono px-1.5 py-0.5 bg-zinc-800/50 rounded">
                B
              </span>
            </div>
          </Button>

          {/* Move up/down */}
          <Button
            variant="ghost"
            className="w-full h-9 px-3 flex items-center justify-between group hover:bg-zinc-800/50"
          >
            <span className="text-zinc-200 text-sm font-medium">Move up</span>
            <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
              <span className="font-mono px-1.5 py-0.5 bg-zinc-800/50 rounded">
                ESC
              </span>
              <span className="text-zinc-600">then</span>
              <span className="flex items-center font-mono px-1.5 py-0.5 bg-zinc-800/50 rounded">
                <CommandIcon className="h-2.5 w-2.5 mr-1" />K
              </span>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="w-full h-9 px-3 flex items-center justify-between group hover:bg-zinc-800/50"
          >
            <span className="text-zinc-200 text-sm font-medium">Move down</span>
            <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
              <span className="font-mono px-1.5 py-0.5 bg-zinc-800/50 rounded">
                ESC
              </span>
              <span className="text-zinc-600">then</span>
              <span className="flex items-center font-mono px-1.5 py-0.5 bg-zinc-800/50 rounded">
                <CommandIcon className="h-2.5 w-2.5 mr-1" />J
              </span>
            </div>
          </Button>

          <Separator className="my-1 bg-zinc-800" />

          {/* Other options without shortcuts */}
          <Button
            variant="ghost"
            className="w-full h-9 px-3 flex items-center justify-between group hover:bg-zinc-800/50"
          >
            <span className="text-zinc-200 text-sm font-medium">Duplicate</span>
          </Button>

          {/* <Button
                  variant="ghost"
                  className="w-full h-9 px-3 flex items-center justify-between group hover:bg-zinc-800/50"
                >
                  <span className="text-zinc-200 text-sm font-medium">
                    Copy link
                  </span>
                  <ChevronRightIcon className="h-4 w-4 text-zinc-500" />
                </Button>*/}

          <Button
            variant="ghost"
            className="w-full h-9 px-3 flex items-center justify-between group hover:bg-zinc-800/50"
          >
            <span className="text-zinc-200 text-sm font-medium">
              Full screen
            </span>
            <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
              <span className="font-mono px-1.5 py-0.5 bg-zinc-800/50 rounded">
                ESC
              </span>
              <span className="text-zinc-600">then</span>
              <span className="font-mono px-1.5 py-0.5 bg-zinc-800/50 rounded">
                FF
              </span>
            </div>
          </Button>

          <Separator className="my-1 bg-zinc-800" />

          {/* Delete option */}
          <Button
            variant="ghost"
            className="w-full h-9 px-3 flex items-center justify-between group hover:bg-zinc-800/50"
            onMouseDown={handleDeleteContent}
          >
            <span className="text-red-400 text-sm font-medium group-hover:text-red-300">
              Delete cell
            </span>
            <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
              <span className="font-mono px-1.5 py-0.5 bg-zinc-800/50 rounded">
                ESC
              </span>
              <span className="text-zinc-600">then</span>
              <span className="font-mono px-1.5 py-0.5 bg-zinc-800/50 rounded">
                DD
              </span>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
PopoverCardMenu.displayName = "PopoverCardMenu";

export { PopoverCardMenu };
