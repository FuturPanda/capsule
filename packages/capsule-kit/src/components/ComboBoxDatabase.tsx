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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CustomComboboxProps<T extends Record<string, unknown>> {
  choiceLabel: string;
  choices: T[];
  nameKey?: string;
  callback: (choice: T) => void;
  selected: T;
}

export function CustomCombobox<T extends Record<string, unknown>>({
  choiceLabel,
  choices,
  nameKey = "name",
  callback,
  selected,
}: CustomComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [truncatedItems, setTruncatedItems] = useState<Record<string, boolean>>(
    {},
  );
  const itemRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

  useEffect(() => {
    if (!open) return;
    const timeoutId = setTimeout(() => {
      const newTruncatedState: Record<string, boolean> = {};

      itemRefs.current.forEach((element, key) => {
        newTruncatedState[key] = element.scrollWidth > element.clientWidth;
      });

      setTruncatedItems(newTruncatedState);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [open, choices]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <span className="truncate mr-2">
            {selected
              ? (selected[nameKey] as string)
              : `Select ${choiceLabel.trim()}...`}
          </span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${choiceLabel.trim()}s...`} />
          <CommandList>
            <CommandEmpty>No {choiceLabel.trim()}s found.</CommandEmpty>
            <CommandGroup>
              {choices &&
                choices.map((choice) => {
                  const itemValue = choice[nameKey] as string;
                  const isItemTruncated = truncatedItems[itemValue] || false;

                  return (
                    <CommandItem
                      key={itemValue}
                      value={itemValue}
                      onSelect={() => {
                        callback(choice);
                        setOpen(false);
                      }}
                      className="flex items-center"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 flex-shrink-0",
                          itemValue === (selected?.[nameKey] ?? "")
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <TooltipProvider delayDuration={1000}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className="truncate"
                              ref={(el) => {
                                if (el) {
                                  itemRefs.current.set(itemValue, el);
                                } else {
                                  itemRefs.current.delete(itemValue);
                                }
                              }}
                            >
                              {itemValue.toLowerCase()}
                            </span>
                          </TooltipTrigger>
                          {isItemTruncated && (
                            <TooltipContent side="right">
                              {itemValue}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
