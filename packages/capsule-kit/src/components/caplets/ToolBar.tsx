import { Button } from "@/components/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { DiamondPlus, Type } from "lucide-react";
import { useBoundStore } from "@/stores/global.store.ts";
import { DataSourceDialog } from "@/components/data-sources/DataSourceDialog.tsx";
import { CapletContentTypeEnum } from "@/stores/caplets/caplet.model.ts";

export interface ToolbarProps {
  capletId: string;
}

const ToolBarButtons = [
  {
    id: 1,
    description: "Text",
    tooltip: "Text",
    contentType: CapletContentTypeEnum.TEXT,
    icon: <Type className="w-4 h-4 mr-2" />,
    shortcut: "T",
  },
  {
    id: 2,
    description: "Source",
    tooltip: "Quick Add Source",
    contentType: CapletContentTypeEnum.SOURCE,
    icon: <DiamondPlus className="w-4 h-4 mr-2" />,
    shortcut: "S",
  },
  {
    id: 3,
    description: "Entity",
    tooltip: "Quick Add Entity",
    contentType: CapletContentTypeEnum.ENTITY,
    icon: <DiamondPlus className="w-4 h-4 mr-2" />,
    shortcut: "E",
  },
];

export default function ToolBar(props: ToolbarProps) {
  const addContent = useBoundStore((state) => state.createContent);
  const handleAddContent = (type: CapletContentTypeEnum) => {
    addContent(props.capletId, type);
  };

  return (
    <div className="flex flex-row items-center justify-center gap-1 p-2 m-b-8 bg-zinc-950 rounded-lg border">
      {ToolBarButtons.map((o) => (
        <TooltipProvider key={o.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                onMouseDown={() => handleAddContent(o.contentType)}
              >
                {o.icon}
                {o.description}
                <kbd className="ml-2 text-xs">{o.shortcut}</kbd>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{o.tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      <DataSourceDialog />
    </div>
  );
}
