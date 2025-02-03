import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GetDatabaseDto } from "@/stores/databases/database.model.ts";

interface ComboxBoxDatabaseProps {
  databases: GetDatabaseDto[];
  selectedDb: string;
  setSelectedDb: React.Dispatch<React.SetStateAction<string>>;
}

export function ComboboxDatabase({
  databases,
  selectedDb,
  setSelectedDb,
}: ComboxBoxDatabaseProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedDb ? selectedDb : "Select database..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No databases found.</CommandEmpty>
            <CommandGroup>
              {databases.map((database) => (
                <CommandItem
                  key={database.name}
                  value={database.name}
                  onSelect={(currentValue) => {
                    setSelectedDb(
                      currentValue === selectedDb ? "" : currentValue,
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedDb === database.name
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {database.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
